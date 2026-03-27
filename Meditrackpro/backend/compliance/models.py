from django.db import models
from hospitals.models import Hospital


class ComplianceStandard(models.Model):
    STATUS_CHOICES = (
        ('Compliant', 'Compliant'),
        ('Pending Review', 'Pending Review'),
        ('Require Attention', 'Require Attention'),
    )
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='compliance_reports')
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending Review')
    progress = models.IntegerField(default=0)  # Percentage of compliance
    last_audit_date = models.DateTimeField(null=True, blank=True)
    next_audit_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hospital', 'name'], name='unique_compliance_report_per_hospital')
        ]
    
    def __str__(self):
        return f"{self.name} - {self.hospital.name} ({self.status})"
    
class Audit(models.Model):
    STATUS_CHOICES = (
        ('Scheduled', 'Scheduled'),
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
    )
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='audits')
    Compliance_standard = models.ForeignKey(ComplianceStandard, on_delete=models.CASCADE, related_name='audits')
    title = models.CharField(max_length=100)
    audit_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    auditor = models.CharField(max_length=100)  # Name of the auditor
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.hospital.name} ({self.status})"
    
class ComplianceDocument(models.Model):
    STATUS_CHOICES = (
        ('Complete', 'Complete'),
        ('In Progress', 'In Progress'),
        ('Require Attention', 'Require Attention'),
    )
    
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='compliance_documents')
    Compliance_standard = models.ForeignKey(ComplianceStandard, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=100)
    file = models.FileField(upload_to='compliance_documents/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='In Progress')
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.hospital.name} ({self.status})"
    
    
