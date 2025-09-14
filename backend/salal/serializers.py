from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, max_length=8)
    last_name = serializers.CharField(write_only=True, max_length=8)
    email = serializers.CharField(write_only=True, min_length=8)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm']
        
    def validate(self, attrs):
      if attrs['password'] != attrs.pop('password_confirm'):
        raise serializers.ValidationError({'password_confirm': "Passwords do not match"})
      return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            user_type='client',
            status='active'
        )
        return user