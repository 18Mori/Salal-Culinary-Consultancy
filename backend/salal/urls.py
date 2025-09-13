from django.urls import path
from .views import *

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    # path('auth/register/', RegisterView.as_view(), name='register'),
    # path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
]