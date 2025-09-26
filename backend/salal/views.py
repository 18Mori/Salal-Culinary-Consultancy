from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from django.db.models import Sum, Q
import logging
logger = logging.getLogger(__name__)

class ClientDashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if not user.last_login_at:
            user.last_login_at = timezone.now()
            user.save(update_fields=['last_login_at'])
            
            # Fetch all required data
        stats = self._get_dashboard_stats(user)
        upcoming_consultations = self._get_upcoming_consultations(user)
        
        # Serialize
        stats_data = stats
        
        return Response({
                'stats': stats_data,
                'upcoming_consultations': BookingSerializer(upcoming_consultations, many=True).data,
            })
        
class BookingView(APIView):
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        user = request.user
        bookings = Booking.objects.filter(client=user).order_by('-date', '-time')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        user = request.user
        data = request.data.copy()
        data['client'] = user.id
        
        serializer = BookingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['POST'])
    def create_booking(request):
        logger.info(f"Received booking data: {request.data}")  
        logger.info(f"User: {request.user}")

        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save(user=request.user)
            logger.info(f"Booking created: {booking.id}")
            return Response(BookingSerializer(booking).data, status=201)
        else:
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=400)

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
                'password': user.password,
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
                    'password': user.password,
                }
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
