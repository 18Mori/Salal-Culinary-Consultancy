from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .models import User

class LoginView(APIView):
    permission_classes = []
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'username': 'Username is required', 'password': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {'non_field_errors': ['Invalid username or password.']}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        if not user.is_active:
            return Response(
                {'non_field_errors': ['This account is inactive.']}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
            }
        }, status=status.HTTP_200_OK)
        
        
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'firstname': user.first_name,
                    'lastname': user.last_name,
                    'email': user.email,
                    'username': user.username,
                }
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
