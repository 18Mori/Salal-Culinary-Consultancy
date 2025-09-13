from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('api/auth/login/', LoginView.as_view(), name='login'),
]