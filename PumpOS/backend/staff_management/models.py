from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class StaffMember(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('part-time', 'Part-Time'),
        ('on-leave', 'On Leave'),
        ('inactive', 'Inactive'),
    ]
    staff_id = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='staff_profile')
    role = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    hours_week = models.PositiveIntegerField(default=40)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField()
    join_date = models.DateField(default=timezone.now)
    certifications = models.JSONField(default=list)  # Store certifications as JSON list
    avatar = models.CharField(max_length=200, blank=True, default='/placeholder.svg')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.staff_id}"

    class Meta:
        ordering = ['user__first_name']

class Schedule(models.Model):
    staff = models.ForeignKey(StaffMember, on_delete=models.CASCADE, related_name='schedules')
    day = models.CharField(max_length=20)
    time = models.CharField(max_length=50)
    type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.staff} - {self.day} {self.time}"

    class Meta:
        ordering = ['day', 'time']

class Resource(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('maintenance', 'Maintenance'),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    location = models.CharField(max_length=100)
    capacity = models.CharField(max_length=100, blank=True)
    maintenance = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.type}"

    class Meta:
        ordering = ['name']