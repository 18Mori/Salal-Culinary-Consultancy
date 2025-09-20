from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from django.db.models import Sum, Q

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
        projects = self._get_projects(user)
        recent_messages = self._get_recent_messages(user)
        account_status = self._get_account_status(user)
        
        # Serialize
        user_data = UserInfoSerializer(user).data
        stats_data = stats
        consultations_data = ConsultationSerializer(upcoming_consultations, many=True).data
        projects_data = ProjectSerializer(projects, many=True).data
        messages_data = MessageSerializer(recent_messages, many=True).data
        account_data = AccountStatusSerializer(account_status).data
        
        return Response({
                'user': user_data,
                'stats': stats_data,
                'upcoming_consultations': consultations_data,
                'projects': projects_data,
                'recent_messages': messages_data,
                'account_status': account_data,
            })
    
    def get_dashboard_stats(self, user):
        total_projects = Project.objects.filter(client=user).count()
        completed_projects = Project.objects.filter(
            client=user, status='completed'
            ).count()
        upcoming_consultations = Consultation.objects.filter(
            client=user,
            date__gte=timezone.now(),
            status='scheduled'
        ).count()
        total_spent = Consultation.objects.filter(
        client=user,
        status='completed'
    ).aggregate(total=Sum('price'))['total'] or 0.0

        return {
            'total_projects': total_projects,
            'completed_projects': completed_projects,
            'upcoming_consultations': upcoming_consultations,
        }

    def get_upcoming_consultations(self, user):
        return Consultation.objects.filter(
            client=user,
            date__gte=timezone.now(),
            status='scheduled'
        ).order_by('date')[:5]
        
    def get_projects(self, user):
        return Project.objects.filter(client=user).order_by('-updated_at')[:5]
    
    def get_recent_messages(self, user):
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).order_by('-sent_at')[:5]
        

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
