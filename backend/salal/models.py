import datetime
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')

    def is_admin(self):
        return self.role == 'admin'


class Booking(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    title = models.CharField(max_length=200)
    date = models.DateField(null=True, default=datetime.date.today)
    time = models.TimeField(default=timezone.now)
    duration = models.DurationField(null=True, default=datetime.timedelta(minutes=60))
    notes = models.TextField(null=True, blank=True)
    service_type = models.CharField(max_length=100)
    session_type = models.CharField(max_length=20, choices=[
        ('video', 'Video Call'),
        ('in-person', 'In-Person'),
        ('phone', 'Phone Call'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
      ordering = ['-created_at']
      unique_together = ('client', 'date', 'time', 'service_type')
    
    def __str__(self):
        return f"{self.title} on {self.date} at {self.time} by {self.client.username}"