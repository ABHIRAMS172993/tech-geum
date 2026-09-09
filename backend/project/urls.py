from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from products.views import ProductViewSet
from customers.views import CustomerViewSet
from orders.views import OrderViewSet, SalesReportView
from users.views import RegisterView


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('api/auth/register/', RegisterView.as_view(), name='auth-register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('api/auth/token/refresh', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/', include(router.urls)),
    path('api/reports/sales', SalesReportView.as_view(), name='sales-report'),
]
