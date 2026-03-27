from django.db import models
from django.contrib.auth.models import User
from hospitals.models import Hospital

# Create your models here.

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='employees', null=True, blank=True)
    role = models.CharField(max_length=50, choices=[
            ('doctor', 'Doctor'), ('nurse', 'Nurse'), ('staff', 'Staff'),('engineer','Engineer'),
            ('receptionist','Receptionist'),('other','Other')], default='staff')
    department = models.CharField(max_length=100, choices=[
            ('cardiology', 'Cardiology'), ('neurology', 'Neurology'), ('pediatrics', 'Pediatrics'),
            ('orthopedics', 'Orthopedics'), ('radiology', 'Radiology'), ('emergency', 'Emergency'),
            ('it', 'IT'), ('administration', 'Administration')
        ], default='it')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    access_level = models.CharField(max_length=50, choices=[
            ('admin', 'Administrator'), ('full', 'Full Access'), ('standard', 'Standard Access'),
            ('limited', 'Limited Access'), ('none', 'No Access')
        ], default='standard')
    status = models.CharField(max_length=10, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    date_of_birth = models.DateField(null=True, blank=True)
    employee_id = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return f"{self.user.username}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hospital', 'employee_id'], name='unique_employee_per_hospital')
        ]