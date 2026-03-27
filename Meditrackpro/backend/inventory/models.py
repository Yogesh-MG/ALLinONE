from django.db import models
from hospitals.models import Hospital
from django.db.models.signals import post_save
from django.dispatch import receiver
import qrcode
from django.core.files import File
from io import BytesIO

# Create your models here.
class Category(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='inventory_categories')
    name = models.CharField(max_length=50)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hospital', 'name'], name="unique category name per hospital")
        ]
    def __str__(self):
        return self.name
    
class Unit(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='inventory_units')
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hospital', 'name'], name="unique_unit_name_per_hospital")
        ]
        
    def __str__(self):
        return self.name
    
    
class InventoryItem(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='inventory_items')
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='items')
    quantity = models.PositiveIntegerField(default=0)
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, related_name='items')
    reorder_level = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    expiry_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=50, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    supplier = models.ForeignKey('suppliers.Supplier', on_delete=models.CASCADE,
                                blank=True, null=True, related_name='inventory_name')
    batch = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    qr_code = models.ImageField(upload_to='inventory_qr_codes/%Y/%m/%d/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.sku}) - {self.hospital.name}"

    def generate_qr_code(self):
        qr_url = f"https://meditrackpro.com/inventory/{self.hospital_id}/{self.id}"
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
        qr.add_data(qr_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        file_name = f"item_{self.id}_qr.png"
        self.qr_code.save(file_name, File(buffer), save=False)
        buffer.close()

@receiver(post_save, sender=InventoryItem)
def create_or_update_qr_code(sender, instance, created, **kwargs):
    if created or not instance.qr_code:
        instance.generate_qr_code()
        instance.save(update_fields=['qr_code'])