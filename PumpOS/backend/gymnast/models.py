from django.db import models
from django.contrib.auth.models import User

class GymSettings(models.Model):
    gym_name = models.CharField(max_length=255, default="FitLife Wellness Center")
    email = models.EmailField(default="info@fitlifegym.com")
    phone = models.CharField(max_length=20, default="(555) 123-4567")
    address = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    timezone = models.CharField(max_length=50, default="est")
    currency = models.CharField(max_length=10, default="usd")
    date_format = models.CharField(max_length=20, default="mdy")
    language = models.CharField(max_length=10, default="en")
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    two_factor = models.BooleanField(default=False)
    auto_backup = models.BooleanField(default=True)
    primary_color = models.CharField(max_length=7, default="#6366f1")
    secondary_color = models.CharField(max_length=7, default="#f1f5f9")
    logo = models.ImageField(upload_to="logos/", blank=True, null=True)

    def __str__(self):
        return self.gym_name

class MembershipPlan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Class(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    instructor = models.CharField(max_length=100)
    schedule = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()
    capacity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.schedule})"

class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    membership_plan = models.ForeignKey(MembershipPlan, on_delete=models.SET_NULL, null=True)
    classes = models.ManyToManyField(Class, blank=True)
    face_embedding = models.JSONField(default=list, blank=True)
    join_date = models.DateField()
    last_visit = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('Active', 'Active'),
        ('Expired', 'Expired'),
        ('Suspended', 'Suspended'),
    ], default='Active')
    address = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=100, blank=True, null=True)
    emergency_phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer-not-to-say', 'Prefer not to say'),
    ], blank=True, null=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Activity(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=[
        ('check-in', 'Check-in'),
        ('class', 'Class'),
        ('personal-training', 'Personal Training'),
    ])
    title = models.CharField(max_length=100)
    timestamp = models.DateTimeField()
    location = models.CharField(max_length=100)
    confidence = models.FloatField(default=0.0)
    duration = models.CharField(max_length=20)  # e.g., "2h 15m"

    def __str__(self):
        return f"{self.member} - {self.title} ({self.timestamp})"

class Booking(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ], default='confirmed')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.member} - {self.class_instance}"

class Achievement(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    earned_date = models.DateField()

    def __str__(self):
        return f"{self.member} - {self.title}"

class Message(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    message_type = models.CharField(max_length=20, choices=[
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
    ])
    subject = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.member} - {self.message_type} ({self.sent_at})"