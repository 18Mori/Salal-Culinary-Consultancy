from django.urls import path
from .views import *

urlpatterns = [
    path('admin/bookings/', AdminBookingsView.as_view(), name='admin-bookings'),
    path('admin/bookings/<int:pk>/', AdminBookingUpdateView.as_view(), name='admin-booking-update'),
    path('admin/clients/', AdminClientsView.as_view(), name='admin-clients'),
    path('admin/clients/<int:user_id>/', AdminDeleteClientView.as_view(), name='admin-delete-client'),
    
    path('user/', user_detail, name='user-detail'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('dashboard/', ClientDashboardView.as_view(), name='client_dashboard'),
    path('booking/', BookingView.as_view(), name='booking'),
    path('booking/<int:pk>/', BookingView.as_view(), name='booking-delete'),
    path('booking/count/', BookingCountView.as_view(), name='booking-count'),
]