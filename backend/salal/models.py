from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Consultation(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    date = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[
          ('scheduled', 'Scheduled'),
          ('completed', 'Completed'),
          ('cancelled', 'Cancelled'),
      ], default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
      ordering = ['-date']
      
    def __str__(self):
      return f"{self.title} with {self.client.username} on {self.date.strftime('%Y-%m-%d %H:%M')}"
    
    def is_upcoming(self):
      return self.date > timezone.now()
    
    def is_past(self):
      return self.date <= timezone.now()
    
    def mark_completed(self):
      self.status = 'completed'
      self.save()
      
    def mark_cancelled(self):
      self.status = 'cancelled'
      self.save()
    
class Project(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    progress_percent = models.PositiveSmallIntegerField(default=0)  
    status = models.CharField(max_length=20, choices=[
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
    ], default='planning')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.client.username})"
      
class AccountPlan(models.Model):
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('basic', 'Basic'),
        ('premium', 'Premium'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    plan_type = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    start_at = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.plan_type}"
    
    def upgrade_plan(self, new_plan):
        if new_plan in dict(self.PLAN_CHOICES).keys():
            self.plan_type = new_plan
            self.save()
    
    def cancel_plan(self):
        self.is_active = False
        self.end_date = timezone.now().date()
        self.save()
        
class Messages(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-sent_at']

    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username} at {self.sent_at.strftime('%Y-%m-%d %H:%M')}"