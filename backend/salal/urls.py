from django.urls import path
from .views import *

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('dashboard/', ClientDashboardView.as_view(), name='client_dashboard'),
]