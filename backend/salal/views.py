from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import *
from .models import *
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
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
        bookings = Booking.objects.filter(client=request.user).order_by('-date', '-time')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data.copy()
        data['client'] = request.user.id
        
        serializer = BookingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, client=request.user)
            booking.delete()
            return Response({"message": "Booking deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found or access denied"}, status=status.HTTP_404_NOT_FOUND)
        
class BookingCountView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Booking.objects.filter(client=request.user).count()
        return Response({'total_bookings': count})


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
    
@api_view(['GET'])
def user_detail(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
    })
