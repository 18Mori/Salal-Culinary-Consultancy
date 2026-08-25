import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    # Track real-time active status
    last_seen = models.DateTimeField(null=True, blank=True)

    @property
    def is_admin(self):
        return self.role == 'admin'


class Booking(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    title = models.CharField(max_length=200)
    date = models.DateField(null=True, default=datetime.date.today)
    time = models.TimeField(null=True, blank=True)
    duration = models.DurationField(null=True, default=datetime.timedelta(minutes=60))
    notes = models.TextField(null=True, blank=True)
    service_type = models.CharField(max_length=100)
    session_type = models.CharField(max_length=20, choices=[
        ('video', 'Video Call'),
        ('in-person', 'In-Person'),
        ('phone', 'Phone Call'),
    ])
    CHEFS = [
        ('Chef Alex Salal', 'Chef Alex Salal'),
        ('Chef Marcus Vance', 'Chef Marcus Vance'),
        ('Chef Elena Rostova', 'Chef Elena Rostova'),
        ('Chef David Chen', 'Chef David Chen'),
    ]
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Assigned', 'Assigned'),
        ('Resolved', 'Resolved'),
    ]
    assigned_chef = models.CharField(max_length=100, choices=CHEFS, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
      ordering = ['-created_at']
      unique_together = ('client', 'date', 'time', 'service_type')
    
    def __str__(self):
        return f"{self.title} on {self.date} at {self.time} by {self.client.username}"