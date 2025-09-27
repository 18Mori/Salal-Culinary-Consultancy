from django.urls import path
from .views import *

urlpatterns = [
    path('stkpush/', stk_push, name='stk_push'),
    path('callback/', mpesa_callback, name='mpesa_callback'),
    path('test/', test_view, name='test'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('dashboard/', ClientDashboardView.as_view(), name='client_dashboard'),
    path('booking/', BookingView.as_view(), name='booking'),
    path('booking/<int:pk>/', BookingView.as_view(), name='booking-delete'),
    path('booking/count/', BookingView.as_view(), name='booking-count'),
]