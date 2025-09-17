from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Category, Stone, StoneImage, StoneVideo, Project, ProjectImage, 
    ProjectVideo, ProjectStone, Cart, CartItem, Quote, QuoteItem, Order, OrderItem
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name_en', 'name_fa', 'slug', 'description_en', 'description_fa', 'created_at']


class StoneImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoneImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class StoneVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoneVideo
        fields = ['id', 'video_url', 'title', 'is_primary']


class StoneSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    images = StoneImageSerializer(many=True, read_only=True)
    videos = StoneVideoSerializer(many=True, read_only=True)
    
    # Format for frontend compatibility
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    technical_data = serializers.SerializerMethodField()
    image_urls = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Stone
        fields = [
            'id', 'name_en', 'name_fa', 'name', 'category', 'category_id', 
            'category_name', 'description_en', 'description_fa', 'description',
            'origin', 'price', 'is_active', 'created_at', 'updated_at',
            'density', 'porosity', 'compressive_strength', 'flexural_strength',
            'technical_data', 'images', 'videos', 'image_urls', 'video_url'
        ]
    
    def get_name(self, obj):
        return {
            'en': obj.name_en,
            'fa': obj.name_fa
        }
    
    def get_description(self, obj):
        return {
            'en': obj.description_en,
            'fa': obj.description_fa
        }
    
    def get_category_name(self, obj):
        return {
            'en': obj.category.name_en,
            'fa': obj.category.name_fa
        }
    
    def get_technical_data(self, obj):
        return {
            'density': obj.density,
            'porosity': obj.porosity,
            'compressiveStrength': obj.compressive_strength,
            'flexuralStrength': obj.flexural_strength
        }
    
    def get_image_urls(self, obj):
        return [image.image.url for image in obj.images.all()]
    
    def get_video_url(self, obj):
        primary_video = obj.videos.filter(is_primary=True).first()
        return primary_video.video_url if primary_video else None


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProjectVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectVideo
        fields = ['id', 'video_url', 'title', 'is_primary']


class ProjectStoneSerializer(serializers.ModelSerializer):
    stone = StoneSerializer(read_only=True)
    stone_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = ProjectStone
        fields = ['id', 'stone', 'stone_id', 'quantity', 'notes']


class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    videos = ProjectVideoSerializer(many=True, read_only=True)
    project_stones = ProjectStoneSerializer(many=True, read_only=True)
    
    # Format for frontend compatibility
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    challenges = serializers.SerializerMethodField()
    solutions = serializers.SerializerMethodField()
    stones = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title_en', 'title_fa', 'title', 'description_en', 'description_fa', 'description',
            'location_en', 'location_fa', 'location', 'year', 'category_en', 'category_fa', 'category',
            'client_en', 'client_fa', 'client', 'size_en', 'size_fa', 'size',
            'duration_en', 'duration_fa', 'duration', 'challenges_en', 'challenges_fa', 'challenges',
            'solutions_en', 'solutions_fa', 'solutions', 'is_active', 'created_at', 'updated_at',
            'images', 'videos', 'project_stones', 'stones', 'image', 'gallery', 'video'
        ]
    
    def get_title(self, obj):
        return {
            'en': obj.title_en,
            'fa': obj.title_fa
        }
    
    def get_description(self, obj):
        return {
            'en': obj.description_en,
            'fa': obj.description_fa
        }
    
    def get_location(self, obj):
        return {
            'en': obj.location_en,
            'fa': obj.location_fa
        }
    
    def get_category(self, obj):
        return {
            'en': obj.category_en,
            'fa': obj.category_fa
        }
    
    def get_client(self, obj):
        return {
            'en': obj.client_en,
            'fa': obj.client_fa
        }
    
    def get_size(self, obj):
        return {
            'en': obj.size_en,
            'fa': obj.size_fa
        }
    
    def get_duration(self, obj):
        return {
            'en': obj.duration_en,
            'fa': obj.duration_fa
        }
    
    def get_challenges(self, obj):
        return {
            'en': obj.challenges_en,
            'fa': obj.challenges_fa
        }
    
    def get_solutions(self, obj):
        return {
            'en': obj.solutions_en,
            'fa': obj.solutions_fa
        }
    
    def get_stones(self, obj):
        return [project_stone.stone.name_en for project_stone in obj.project_stones.all()]
    
    def get_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        return primary_image.image.url if primary_image else None
    
    def get_gallery(self, obj):
        return [image.image.url for image in obj.images.all()]
    
    def get_video(self, obj):
        primary_video = obj.videos.filter(is_primary=True).first()
        return primary_video.video_url if primary_video else None


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='profile.phone', allow_blank=True, required=False)
    address = serializers.CharField(source='profile.address', allow_blank=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'address', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined']
    
    def update(self, instance, validated_data):
        # Handle profile data
        profile_data = validated_data.pop('profile', {})
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update profile fields
        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return instance


class CartItemSerializer(serializers.ModelSerializer):
    stone = StoneSerializer(read_only=True)
    stone_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'stone', 'stone_id', 'quantity', 'selected_finish', 
            'selected_thickness', 'notes', 'created_at'
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total', 'created_at', 'updated_at', 'is_active']
    
    def get_total(self, obj):
        total = 0
        for item in obj.items.all():
            if item.stone.price:
                total += float(item.stone.price) * item.quantity
        return total


class QuoteItemSerializer(serializers.ModelSerializer):
    stone = StoneSerializer(read_only=True)
    stone_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = QuoteItem
        fields = ['id', 'stone', 'stone_id', 'quantity', 'notes']


class QuoteSerializer(serializers.ModelSerializer):
    items = QuoteItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quote
        fields = [
            'id', 'name', 'email', 'company', 'phone', 'project_type', 
            'project_location', 'timeline', 'additional_notes', 'status',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    stone = StoneSerializer(read_only=True)
    stone_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'stone', 'stone_id', 'quantity', 'price', 
            'selected_finish', 'selected_thickness', 'notes'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'order_number', 'tracking_code', 'status', 'total_amount',
            'payment_id', 'payment_status', 'payment_date',
            'shipping_address', 'shipping_city', 'shipping_postal_code', 'shipping_phone',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'order_number', 'tracking_code', 'payment_id', 'payment_status', 
            'payment_date', 'created_at', 'updated_at'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user
