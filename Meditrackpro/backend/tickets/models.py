from django.db import models
from employees.models import Employee
from hospitals.models import Hospital
from device.models import Device
from django.db import transaction
import uuid

class Ticket(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )

    CATEGORY_CHOICES = (
        ('hardware', 'Hardware Problem'),
        ('software', 'Software Issue'),
        ('calibration', 'Calibration Required'),
        ('maintenance', 'Maintenance Request'),
        ('training', 'Usage Training'),
        ('other', 'Other'),
    )
    
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='tickets')
    ticket_id = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    category = models.CharField(max_length=50, default='hardware')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    location = models.CharField(max_length=100)
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='created_ticket')
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_ticket')
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['hospital', 'ticket_id'], name="unique Ticket name per hospital")
        ]
        
    def __str__(self):
        return f"{self.ticket_id}: {self.title}"
    
    #def save(self, *args, **kwargs):
    #    if not self.ticket_id:
    #        with transaction.atomic():
    #            last_ticket = Ticket.objects.filter(hospital=self.hospital).order_by('-id').first()
    #            last_number = int(last_ticket.ticket_id.split('-')[1]) if last_ticket and last_ticket.ticket_id else 1000
    #            self.ticket_id = f"TIC{last_number + 1}"
    #    super().save(*args, **kwargs)
    def save(self, *args, **kwargs):
        if not self.ticket_id:
            with transaction.atomic():
                last_ticket = Ticket.objects.filter(hospital=self.hospital).order_by('-id').first()
                if last_ticket and last_ticket.ticket_id and '-' in last_ticket.ticket_id:
                    try:
                        last_number = int(last_ticket.ticket_id.split('-')[1])
                    except (IndexError, ValueError):
                        last_number = 1000  # Fallback to 1000 if parsing fails
                else:
                    last_number = 1000  # Start at 1000 if no valid ticket_id
                self.ticket_id = f"TIC-{last_number + 1:04d}"  # Ensure consistent format
        super().save(*args, **kwargs)    
    
class TicketComment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='ticket_comments')
    content = models.TextField()
    file = models.FileField(upload_to='ticket_comment/%Y/%m/%d', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        
    def __str__(self):
        return f"comment by {self.author} on {self.ticket.ticket_id}"
    