from django.db import models
from django.utils import timezone
from gymnast.models import Member  # Import Member from the existing app

class ClassInstance(models.Model):
    name = models.CharField(max_length=100)
    schedule = models.DateTimeField()  # Start time of the class
    duration = models.DurationField(default=timezone.timedelta(hours=1))
    instructor = models.CharField(max_length=100)
    room = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('upcoming', 'Upcoming'),
            ('in-progress', 'In Progress'),
            ('full', 'Full'),
            ('completed', 'Completed'),
        ],
        default='upcoming'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.schedule.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['schedule']

class Booking(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='bookings')
    class_instance = models.ForeignKey(ClassInstance, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(
        max_length=20,
        choices=[
            ('confirmed', 'Confirmed'),
            ('waitlist', 'Waitlist'),
            ('cancelled', 'Cancelled'),
        ],
        default='confirmed'
    )
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.member} - {self.class_instance.name} - {self.status}"

    class Meta:
        unique_together = ['member', 'class_instance']