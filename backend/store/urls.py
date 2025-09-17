from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'stones', views.StoneViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'cart', views.CartViewSet, basename='cart')
router.register(r'quotes', views.QuoteViewSet)
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'register', views.UserRegistrationViewSet, basename='register')
router.register(r'payment', views.PaymentCallbackView, basename='payment')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/login/', views.CustomAuthToken.as_view(), name='login'),
    path('payment/mock/', views.MockPaymentView.as_view(), name='mock_payment'),
]
