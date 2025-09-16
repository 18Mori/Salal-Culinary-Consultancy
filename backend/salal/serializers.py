from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
import re

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150, min_length=3)
    first_name = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'password', 'password_confirm']
        
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