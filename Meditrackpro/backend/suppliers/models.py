from django.db import models
from hospitals.models import Hospital
from inventory.models import Category, InventoryItem
import uuid
from django.utils import timezone


# Create your models here.
class Supplier(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='suppliers')
    name = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(max_length=255, blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    categories = models.ManyToManyField(Category, blank=True)
    reliability_score = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=[
        ('Active', 'Active'),
        ('OnHold', 'On Hold'),
        ('Inactive', 'Inactive'),
    ], default='Active')
    tax_id = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    supplier_type = models.CharField(max_length=50, blank=True)
    payment_terms = models.CharField(max_length=50, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['hospital', 'name', 'tax_id']

    def __str__(self):
        return self.name
    
class PurchaseOrder(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('RECEIVED', 'Received'),
        ('CANCELLED', 'Cancelled'),
    )

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='purchase_orders')
    po_number = models.CharField(max_length=50, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, related_name='purchase_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    order_date = models.DateTimeField(default=timezone.now)
    expected_delivery = models.DateField(null=True, blank=True)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PO {self.po_number} - {self.supplier.name if self.supplier else 'No Supplier'}"

    def generate_po_number(self):
        """Generate unique PO number."""
        return f"PO-{self.hospital_id}-{uuid.uuid4().hex[:8]}"

    def update_total_cost(self):
        """Recalculate total cost based on items."""
        total = sum(item.quantity * item.unit_price for item in self.items.all())
        self.total_cost = total
        self.save()

    def save(self, *args, **kwargs):
        if not self.po_number:
            self.po_number = self.generate_po_number()
        super().save(*args, **kwargs)
        
class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='po_items')
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    received_quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.inventory_item.name} x {self.quantity}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.purchase_order.update_total_cost()