from django.shortcuts import render
from django.contrib.auth import get_user_model
from .serializers import *
from .models import *
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
import logging
from typing import cast

User = get_user_model()
logger = logging.getLogger(__name__)


class UserHeartbeatView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.last_seen = timezone.now()
        user.save(update_fields=['last_seen'])
        return Response({'status': 'active', 'last_seen': user.last_seen}, status=status.HTTP_200_OK)


class AdminClientsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        clients = User.objects.filter(is_staff=False).order_by('-date_joined')
        data = []
        for client in clients:
            activity_timestamp = getattr(client, 'last_seen', None) or client.last_login
            
            if activity_timestamp:
                diff = timezone.now() - activity_timestamp
                total_seconds = diff.total_seconds()
                
                # Active if pinged within the last 2 minutes (120s)
                if total_seconds < 120:
                    active_status = "Active now"
                elif total_seconds < 3600:
                    mins = int(total_seconds // 60)
                    active_status = f"Active {mins}m ago"
                elif total_seconds < 86400:
                    hours = int(total_seconds // 3600)
                    active_status = f"Active {hours} hour{'s' if hours > 1 else ''} ago"
                else:
                    days = int(total_seconds // 86400)
                    active_status = f"Active {days} day{'s' if days > 1 else ''} ago"
            else:
                active_status = "Inactive"

            data.append({
                'id': client.pk,
                'username': client.username,
                'email': client.email,
                'first_name': client.first_name,
                'last_name': client.last_name,
                'date_joined': client.date_joined,
                'last_login': client.last_login,
                'last_seen': getattr(client, 'last_seen', None),
                'active_status': active_status,
            })
        return Response(data)

class AdminBookingsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        bookings = Booking.objects.select_related('client').order_by('-created_at')
        data = []
        for booking in bookings:
            data.append({
                'id': booking.pk,
                'client_id': booking.client.pk,
                'client_username': booking.client.username,
                'client_email': booking.client.email,
                'booking_title': booking.title,
                'service_type': booking.service_type,
                'date': booking.date,
                'time': booking.time,
                'notes': booking.notes,
                'created_at': booking.created_at,
                'session_type': booking.session_type,
                'assigned_chef': booking.assigned_chef,
                'status': booking.status,
            })
        return Response(data)

class AdminBookingUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            serializer = BookingSerializer(booking, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                'id': booking.pk,
                'assigned_chef': booking.assigned_chef,
                'status': booking.status,
                'message': 'Booking updated successfully'
            })
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
    
class AdminDeleteClientView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, user_id):
        if user_id == request.user.id:
            return Response(
                {"error": "Cannot delete your own account"},
                status=400
            )
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "Client deleted"}, status=204)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class ClientDashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def _get_dashboard_stats(self, user):
        bookings = Booking.objects.filter(client=user)
        today = timezone.localdate()
        return {
            'total_bookings': bookings.count(),
            'upcoming_bookings': bookings.filter(date__gte=today).count(),
            'completed_bookings': bookings.filter(date__lt=today).count(),
        }

    def _get_upcoming_consultations(self, user):
        return Booking.objects.filter(
            client=user,
            date__gte=timezone.localdate(),
        ).order_by('date', 'time')

    def get(self, request):
        user = request.user
        
        # Keep user active while accessing dashboard
        user.last_seen = timezone.now()
        user.save(update_fields=['last_seen'])
            
        stats = self._get_dashboard_stats(user)
        upcoming_consultations = self._get_upcoming_consultations(user)
        
        return Response({
            'stats': stats,
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
        try:
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

            # Record login timestamp & last_seen timestamp
            user.last_login = timezone.now()
            setattr(user, 'last_seen', timezone.now())
            user.save(update_fields=['last_login', 'last_seen'])
                
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.pk,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email, 
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'role': user.role,
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Login error: {str(e)}", exc_info=True)
            return Response(
                {'non_field_errors': ['An unexpected error occurred during login. Please try again.']},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = cast(AbstractUser, serializer.save())
                
                setattr(user, 'last_seen', timezone.now())
                user.save(update_fields=['last_seen'])

                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.pk,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'email': user.email,
                        'username': user.username,
                        'is_staff': user.is_staff,
                        'is_superuser': user.is_superuser,
                        'role': user.role,
                    }
                }, status=status.HTTP_201_CREATED)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}", exc_info=True)
            return Response(
                {'non_field_errors': ['An unexpected error occurred during registration. Please try again.']},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request):
    return Response({
        'id': request.user.id,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name, 
        'email': request.user.email,
        'is_staff': request.user.is_staff,
        'is_superuser': request.user.is_superuser,
        'role': request.user.role,
    })