from django.db import models
from customer.models import CustomerModel # Import your existing models

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
# --- INVENTORY / INCOMING GOODS ---
class IncomingGood(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='supplies')
    date = models.DateField()
    item_name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100) # e.g., "50 kg" or "10 pcs"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_name} - {self.supplier.name}"

# --- QUOTATIONS ---
class Quotation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    quotation_id = models.CharField(max_length=50, unique=True) # e.g., QUO-001
    customer = models.ForeignKey(CustomerModel, on_delete=models.CASCADE, related_name='quotations')
    date = models.DateField()
    gst_applied = models.BooleanField(default=False)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18.0)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_amount(self):
        # Calculate dynamically based on items
        subtotal = sum(item.price for item in self.items.all())
        tax = (subtotal * (self.gst_rate / 100)) if self.gst_applied else 0
        return subtotal + tax

    def __str__(self):
        return f"{self.quotation_id} - {self.customer.name}"

class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, related_name='items', on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sl_no = models.PositiveIntegerField()

# --- INVOICES ---
class Invoice(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]

    invoice_id = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(CustomerModel, on_delete=models.CASCADE, related_name='invoices')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    final_amount = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    gst_applied = models.BooleanField(default=False)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.invoice_id} - {self.customer.name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    sl_no = models.PositiveIntegerField()
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2) # This is the Amount (Qty * Rate)

    def __str__(self):
        return f"{self.invoice.invoice_id} - Item {self.sl_no}"
    
class Motor(models.Model):
    TYPE_CHOICES = [
        ('Single Phase', 'Single Phase'),
        ('Three Phase', 'Three Phase'),
        ('Submersible Single', 'Submersible (Single Phase)'),
        ('Submersible Three', 'Submersible (Three Phase)'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    motor_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Single Phase')
    power_rating = models.CharField(max_length=50) # e.g. "1 HP"
    voltage = models.CharField(max_length=50)      # e.g. "230V"
    winding_type = models.CharField(max_length=50, blank=True, null=True) # e.g. "Star", "Delta"
    coil_count = models.CharField(max_length=50, blank=True, null=True)
    
    # Deprecated for complex types, but kept for simple search/display
    wire_gauge = models.CharField(max_length=50, blank=True, null=True)
    pitch_details = models.CharField(max_length=255, blank=True, null=True)
    turns_per_coil = models.CharField(max_length=255, blank=True, null=True)
    
    # Stores detailed structure:
    # [
    #   { "name": "Main/Bottom", "gauge": "22", "coils": [{"pitch": "1-8", "turns": "40"}] },
    #   { "name": "Aux/Top", "gauge": "24", "coils": [{"pitch": "1-10", "turns": "60"}] }
    # ]
    winding_data = models.JSONField(blank=True, null=True, default=list) 
    
    rewinding_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.power_rating})"
