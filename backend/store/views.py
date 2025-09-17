from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Q
from django.db import transaction
from django.utils import timezone
from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from decimal import Decimal
from .models import (
    Category, Stone, StoneImage, StoneVideo, Project, ProjectImage, 
    ProjectVideo, ProjectStone, Cart, CartItem, Quote, QuoteItem, Order, OrderItem
)
from .serializers import (
    CategorySerializer, StoneSerializer, ProjectSerializer, 
    CartSerializer, CartItemSerializer, QuoteSerializer, QuoteItemSerializer,
    UserSerializer, OrderSerializer, OrderItemSerializer, UserRegistrationSerializer
)
from .payment import ZarinPalPayment


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class StoneViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stone.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'videos')
    serializer_class = StoneSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'origin']
    search_fields = ['name_en', 'name_fa', 'description_en', 'description_fa']
    ordering_fields = ['name_en', 'price', 'created_at']
    ordering = ['name_en']
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured stones (you can customize this logic)"""
        featured_stones = self.queryset[:6]  # Get first 6 stones as featured
        serializer = self.get_serializer(featured_stones, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get stones grouped by category"""
        categories = Category.objects.prefetch_related('stones').all()
        result = {}
        for category in categories:
            stones = category.stones.filter(is_active=True)
            if stones.exists():
                result[category.slug] = {
                    'category': CategorySerializer(category).data,
                    'stones': StoneSerializer(stones, many=True).data
                }
        return Response(result)


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.filter(is_active=True).prefetch_related('images', 'videos', 'project_stones__stone')
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category_en', 'year']
    search_fields = ['title_en', 'title_fa', 'description_en', 'description_fa', 'location_en', 'location_fa']
    ordering_fields = ['title_en', 'year', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured projects"""
        featured_projects = self.queryset[:3]  # Get first 3 projects as featured
        serializer = self.get_serializer(featured_projects, many=True)
        return Response(serializer.data)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user, is_active=True)
    
    def get_or_create_cart(self):
        cart, created = Cart.objects.get_or_create(
            user=self.request.user,
            is_active=True,
            defaults={'is_active': True}
        )
        return cart
    
    def list(self, request):
        cart = self.get_or_create_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        cart = self.get_or_create_cart()
        stone_id = request.data.get('stone_id')
        quantity = request.data.get('quantity', 1)
        selected_finish = request.data.get('selected_finish', '')
        selected_thickness = request.data.get('selected_thickness', '')
        notes = request.data.get('notes', '')
        
        try:
            stone = Stone.objects.get(id=stone_id, is_active=True)
        except Stone.DoesNotExist:
            return Response({'error': 'Stone not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if item already exists in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            stone=stone,
            defaults={
                'quantity': quantity,
                'selected_finish': selected_finish,
                'selected_thickness': selected_thickness,
                'notes': notes
            }
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def update_item(self, request):
        """Update cart item quantity"""
        cart = self.get_or_create_cart()
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            if quantity <= 0:
                cart_item.delete()
                return Response({'message': 'Item removed from cart'})
            else:
                cart_item.quantity = quantity
                cart_item.save()
                serializer = CartItemSerializer(cart_item)
                return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from cart"""
        cart = self.get_or_create_cart()
        item_id = request.data.get('item_id')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'})
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear all items from cart"""
        cart = self.get_or_create_cart()
        cart.items.all().delete()
        return Response({'message': 'Cart cleared'})
    
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """Create order from cart and initiate payment"""
        cart = self.get_or_create_cart()
        
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate shipping information
        shipping_data = request.data.get('shipping', {})
        required_fields = ['address', 'city', 'postal_code', 'phone']
        for field in required_fields:
            if not shipping_data.get(field):
                return Response({'error': f'Missing required field: {field}'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate total amount
        total_amount = Decimal('0')
        for item in cart.items.all():
            if item.stone.price:
                total_amount += item.stone.price * item.quantity
            else:
                return Response({'error': f'Price not set for stone: {item.stone.name_en}'}, status=status.HTTP_400_BAD_REQUEST)
        
        if total_amount <= 0:
            return Response({'error': 'Invalid total amount'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                # Create order
                order = Order.objects.create(
                    user=request.user,
                    total_amount=total_amount,
                    shipping_address=shipping_data['address'],
                    shipping_city=shipping_data['city'],
                    shipping_postal_code=shipping_data['postal_code'],
                    shipping_phone=shipping_data['phone']
                )
                
                # Create order items
                for cart_item in cart.items.all():
                    OrderItem.objects.create(
                        order=order,
                        stone=cart_item.stone,
                        quantity=cart_item.quantity,
                        price=cart_item.stone.price,
                        selected_finish=cart_item.selected_finish,
                        selected_thickness=cart_item.selected_thickness,
                        notes=cart_item.notes
                    )
                
                # Initiate payment with ZarinPal
                payment = ZarinPalPayment()
                payment_result = payment.create_payment_request(
                    amount=total_amount,
                    description=f"Order {order.order_number} - Stone Store Purchase",
                    order_id=order.id,
                    user_email=request.user.email,
                    user_phone=shipping_data['phone']
                )
                
                if payment_result['success']:
                    # Update order with payment authority
                    order.payment_id = payment_result['authority']
                    order.save()
                    
                    return Response({
                        'order': OrderSerializer(order).data,
                        'payment_url': payment_result['payment_url'],
                        'authority': payment_result['authority']
                    })
                else:
                    # Payment request failed, delete order
                    order.delete()
                    return Response({'error': payment_result['error']}, status=status.HTTP_400_BAD_REQUEST)
                    
        except Exception as e:
            return Response({'error': f'Checkout failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [AllowAny]  # Allow anonymous quotes
    
    def perform_create(self, serializer):
        # If user is authenticated, associate with user
        if self.request.user.is_authenticated:
            # You might want to add user field to Quote model
            pass
        serializer.save()
    
    @action(detail=False, methods=['post'])
    def submit_quote(self, request):
        """Submit a quote with items"""
        quote_data = request.data.copy()
        items_data = quote_data.pop('items', [])
        
        quote_serializer = self.get_serializer(data=quote_data)
        if quote_serializer.is_valid():
            quote = quote_serializer.save()
            
            # Create quote items
            for item_data in items_data:
                QuoteItem.objects.create(
                    quote=quote,
                    stone_id=item_data['stone_id'],
                    quantity=item_data['quantity'],
                    notes=item_data.get('notes', '')
                )
            
            return Response(quote_serializer.data, status=status.HTTP_201_CREATED)
        return Response(quote_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get', 'patch'])
    def profile(self, request):
        """Get or update current user profile"""
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request):
        """Register a new user"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(ObtainAuthToken):
    """Custom login view that returns user data along with token"""
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                         context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'Login successful'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
    def list(self, request):
        """Get user's order history"""
        orders = self.get_queryset()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get specific order details"""
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return render(request, 'payment/payment_result.html', {
                'success': False,
                'message': 'سفارش یافت نشد'
            })


class PaymentCallbackView(viewsets.ViewSet):
    """Handle ZarinPal payment callbacks"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get', 'post'])
    def callback(self, request):
        """Handle payment callback from ZarinPal"""
        authority = request.GET.get('Authority') or request.data.get('Authority')
        status_param = request.GET.get('Status') or request.data.get('Status')
        
        if not authority:
            return Response({'error': 'Missing Authority parameter'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find the order by payment authority
            order = Order.objects.get(payment_id=authority)
            
            # Check if order is already processed
            if order.status == 'paid':
                return render(request, 'payment/payment_result.html', {
                    'success': True,
                    'message': 'پرداخت قبلاً با موفقیت انجام شده است',
                    'order_number': order.order_number
                })
            elif order.status in ['cancelled', 'failed']:
                return render(request, 'payment/payment_result.html', {
                    'success': False,
                    'message': f'سفارش قبلاً {order.status} شده است',
                    'order_number': order.order_number
                })
            
            if status_param == 'OK':
                # Payment was successful, verify with ZarinPal
                payment = ZarinPalPayment()
                verification_result = payment.verify_payment(authority, order.total_amount)
                
                if verification_result['success']:
                    # Payment verified successfully
                    with transaction.atomic():
                        order.status = 'paid'
                        order.payment_status = 'completed'
                        order.payment_date = timezone.now()
                        order.save()
                        
                        # Clear the user's cart
                        cart = Cart.objects.filter(user=order.user, is_active=True).first()
                        if cart:
                            cart.items.all().delete()
                            cart.is_active = False
                            cart.save()
                    
                    # Return HTML response for browser redirect
                    return render(request, 'payment/payment_result.html', {
                        'success': True,
                        'message': 'پرداخت با موفقیت انجام شد',
                        'order_number': order.order_number,
                        'ref_id': verification_result['ref_id']
                    })
                else:
                    # Payment verification failed
                    order.status = 'cancelled'
                    order.payment_status = 'failed'
                    order.save()
                    
                    # Return HTML response for browser redirect
                    return render(request, 'payment/payment_result.html', {
                        'success': False,
                        'message': 'تأیید پرداخت ناموفق بود',
                        'order_number': order.order_number
                    })
            else:
                # Payment was cancelled by user
                order.status = 'cancelled'
                order.payment_status = 'cancelled'
                order.save()
                
                # Return HTML response for browser redirect
                return render(request, 'payment/payment_result.html', {
                    'success': False,
                    'message': 'پرداخت توسط کاربر لغو شد',
                    'order_number': order.order_number
                })
                
        except Order.DoesNotExist:
            return render(request, 'payment/payment_result.html', {
                'success': False,
                'message': 'سفارش یافت نشد'
            })
        except Exception as e:
            return render(request, 'payment/payment_result.html', {
                'success': False,
                'message': f'خطا در پردازش پرداخت: {str(e)}'
            })


class MockPaymentView(View):
    """Mock payment page for development"""
    
    def get(self, request):
        authority = request.GET.get('authority')
        amount = request.GET.get('amount')
        description = request.GET.get('description')
        order_id = request.GET.get('order_id')
        
        if not all([authority, amount, description, order_id]):
            return render(request, 'payment/payment_result.html', {
                'success': False,
                'message': 'پارامترهای پرداخت نامعتبر'
            })
        
        # Get order number for display
        try:
            order = Order.objects.get(id=order_id)
            order_number = order.order_number
        except Order.DoesNotExist:
            order_number = f"ORD-{order_id}"
        
        return render(request, 'payment/mock_payment.html', {
            'authority': authority,
            'amount': float(amount),
            'description': description,
            'order_number': order_number,
            'callback_url': 'http://localhost:8000/api/payment/callback/'
        })
