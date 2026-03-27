from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Hospital(models.Model):
    name = models.CharField(max_length=255)
    hospital_type = models.CharField(max_length=100)  # e.g., General, Specialty
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hospitals', null=True, blank=True)
    plan = models.CharField(max_length=50, choices=[('basic', 'Basic'), ('pro', 'Pro'), ('premium', 'Premium')], default='basic')
    payment_method = models.CharField(max_length=50, choices=[('prepaid', 'Prepaid'), ('cod', 'Cash on Delivery'), ('direct', 'Direct')], default='prepaid')
    is_active = models.BooleanField(default=True)
    gstin = models.CharField(max_length=15, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):  
        return f'{self.name}'
    
class Subscription(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.CharField(max_length=50, choices=[('basic', 'Basic'), ('pro', 'Pro'), ('premium', 'Premium')], default='basic')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    payment_status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('paid', 'Paid'), ('overdue', 'Overdue')], default='pending')
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.hospital.name} - {self.plan}"
    