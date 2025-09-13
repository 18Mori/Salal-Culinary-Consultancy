from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    username = models.CharField(
        max_length=150,
        unique=True,
        blank=True,
        null=True,
        help_text="Optional",
        validators=[AbstractUser.username_validator],
    )

    email = models.EmailField(_('email address'), unique=True)

    USER_TYPE_CHOICES = [
        ('client', 'Client'),
        ('admin', 'Admin'),
    ]
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='client',
        help_text="Role of the user in the system"
    )
    
    STATUS_TYPE_CHOICES = [
        ('premium', 'Premium'),
        ('free', 'Free'),
    ]
    status = models.CharField(
        max_length=10,
        choices=STATUS_TYPE_CHOICES,
        default='free',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'user_type']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # Auto-generate username from email if not added
        if not self.username:
            base_username = self.email.split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            self.username = username

        super().save(*args, **kwargs)