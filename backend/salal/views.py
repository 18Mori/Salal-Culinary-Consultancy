from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'non_field_errors': ['Email and password are required.']}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = authenticate(request, username=email, password=password)
        if not user:
            return Response(
                {'non_field_errors': ['Invalid email or password.']}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'user_type': user.user_type,
                'status': user.status,
            }
        }, status=status.HTTP_200_OK)
