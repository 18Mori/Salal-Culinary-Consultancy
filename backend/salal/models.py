import datetime
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import models

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
      
      
      
class MpesaRequest(models.Model):
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account_reference = models.CharField(max_length=50)
    transaction_desc = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    checkout_request_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.phone_number} - {self.amount}"

class MpesaResponse(models.Model):
    request = models.OneToOneField(MpesaRequest, on_delete=models.CASCADE)
    response_code = models.CharField(max_length=10)
    response_description = models.TextField()
    customer_message = models.TextField()
    merchant_request_id = models.CharField(max_length=100)
    checkout_request_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response for {self.request.phone_number}"