from django.db import models
from django.utils import timezone
from gymnast.models import Member  # Import Member from existing app

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('overdue', 'Overdue'),
    ]
    invoice_id = models.CharField(max_length=20, unique=True)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='invoices')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    plan = models.CharField(max_length=50, blank=True)  # e.g., Basic, Premium, VIP
    issue_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.invoice_id} - {self.member} - {self.status}"

    class Meta:
        ordering = ['-issue_date']

class SalesDeal(models.Model):
    STAGE_CHOICES = [
        ('prospect', 'Prospect'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('closed-won', 'Closed Won'),
        ('closed-lost', 'Closed Lost'),
    ]
    deal_id = models.CharField(max_length=20, unique=True)
    prospect = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='prospect')
    probability = models.PositiveIntegerField(default=0)  # Percentage (0-100)
    close_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.deal_id} - {self.prospect} - {self.stage}"

    class Meta:
        ordering = ['-close_date']