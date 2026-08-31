import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager['User']):
    def _create_user(self, username, email, password, **extra_fields):
        """Internal method to create a user. Used by create_user and create_superuser."""
        if not username:
            raise ValueError('The given username must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('role', 'client')
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('role') != 'admin':
            raise ValueError('Superuser must have role="admin".')

        return self._create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    # Track real-time active status
    last_seen = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    def is_admin(self):
        return self.role == 'admin'

    def save(self, *args, **kwargs):
        update_fields = kwargs.get('update_fields')
        if update_fields is not None:
            if isinstance(update_fields, str):
                update_fields = [update_fields]
            if 'role' not in update_fields and self.pk:
                existing = User.objects.get(pk=self.pk)
                if existing.role == 'admin':
                    self.is_staff = True
                    self.is_superuser = True
                else:
                    self.is_staff = False
                    self.is_superuser = False
            else:
                if self.role == 'admin':
                    self.is_staff = True
                    self.is_superuser = True
                else:
                    self.is_staff = False
                    self.is_superuser = False
        else:
            if self.role == 'admin':
                self.is_staff = True
                self.is_superuser = True
            else:
                self.is_staff = False
                self.is_superuser = False
        super().save(*args, **kwargs)


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