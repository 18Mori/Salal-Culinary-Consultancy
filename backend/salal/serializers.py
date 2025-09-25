from email.message import Message
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
import re

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150, min_length=3)
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']
        
    def validate(self, attrs):
      if attrs['password'] != attrs.pop('password_confirm'):
        raise serializers.ValidationError({'password_confirm': "Passwords do not match"})
      
      if User.objects.filter(username=attrs['username']).exists():
        raise serializers.ValidationError({'email': "This email is already registered."})
      
      return attrs
    
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError("Password must contain at least one letter")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number")
        if not re.search(r'[!@#$%]', value):
            raise serializers.ValidationError("Password must contain at least one symbol: !@#$%")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user
    
class DashboardStatsSerializer(serializers.Serializer):
    total_projects = serializers.IntegerField()
    completed_projects = serializers.IntegerField()
    upcoming_consultations = serializers.IntegerField()
    total_spent = serializers.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
class BookingSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.get.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'client', 'client_username', 'title', 'date', 'time', 'notes', 'duration', 'service_type', 'created_at', 'updated_at', 'session_type']
        read_only_fields = ['id', 'created_at', 'client_username']
        
        
class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.get.username', read_only=True)
    recipient_username = serializers.CharField(source='recipient.get.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'subject', 'sender', 'sender_username', 'recipient', 'recipient_username', 'content', 'sent_at', 'read']
        read_only_fields = ['id', 'sent_at', 'read', 'sender_username', 'recipient_username']
        
class AccountPlanSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AccountPlan
        fields = ['id', 'user', 'user_username', 'plan_type', 'started_at', 'expires_at']
        read_only_fields = ['id', 'started_at', 'expires_at', 'user_username']
        
class AccountStatusSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AccountPlan
        fields = ['id', 'user', 'user_username', 'plan_type', 'is_active', 'start_at']
        read_only_fields = ['id', 'user', 'user_username', 'start_at']
        
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']