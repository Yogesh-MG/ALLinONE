from django.db import models
from hospitals.models import Hospital
from employees.models import Employee
from django.db.models.signals import post_save
from django.dispatch import receiver
import qrcode
from django.core.files import File
from io import BytesIO


# Create your models here.
class Device(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='devices')
    name = models.CharField(max_length=50, null=True, blank=True)
    make_model = models.CharField(max_length=100)
    manufacture = models.CharField(max_length=100, null=True, blank=True)
    serial_number = models.CharField(max_length=50, unique=True)
    date_of_installation = models.DateField(blank=True, null=True)
    warranty_until = models.DateField(blank=True, null=True)
    asset_number = models.CharField(max_length=50)
    asset_details = models.CharField(max_length=50, null=True, choices=[('Excellent','Excellent'), ('Poor','Poor')])
    is_active = models.CharField(max_length=50,null=True, choices=[('Operational','Operational'),('Needs_Calibration','Needs_Calibration'),('Under_Maintenance','Under_Maintenance')],default='Operational')
    department = models.CharField(max_length=50, blank=True, null=True)
    Room = models.CharField(max_length=50, blank=True, null=True)
    nfc_uuid = models.CharField(max_length=64, unique=True, null=True, blank=True)
    next_calibration = models.DateField(null=True, blank=True)
    qr_code = models.ImageField(upload_to='device_qr_codes/%Y/%m/%d/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.make_model} ({self.serial_number}) - {self.hospital.name}"
    
    def generate_qr_code(self):
        """Generate and save a QR code for the device."""
        qr_data = {
            "hospital_id": self.hospital_id,
            "device_id": self.id,
            "asset_number": self.asset_number,
            "nfc_id": self.nfc_uuid
        }
        qr_url = f"https://meditrackpro.com/devices/{self.hospital_id}/{self.id}"  # Example URL for mobile app
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)  # Encode the URL (can change to JSON if needed)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        file_name = f"device_{self.id}_qr.png"
        
        # Save to ImageField
        self.qr_code.save(file_name, File(buffer), save=False)
        buffer.close()
    
class ServiceLog(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='service_logs')
    service_date = models.DateField(auto_now_add=True)
    service_type = models.CharField(max_length=50, blank=True, null=True)
    engineer = models.ForeignKey(Employee, on_delete=models.DO_NOTHING ,related_name='service_logs')
    service_details = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[("scheduled", "Scheduled"), ("completed", "Completed"), ("overdue", "Overdue")], default="scheduled")
    document = models.FileField(upload_to='service_logs/%Y/%m/%d/', null=True, blank=True)
    def __str__(self):
        return f'{self.device.make_model} - {self.engineer.user.name}'

class Specification(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='specification')
    power_supply = models.CharField(max_length=50, null=True, blank=True)
    battery_type = models.CharField(max_length=50, null=True, blank=True)
    battery_life = models.CharField(max_length=50, null=True, blank=True)
    weight = models.CharField(max_length=50, null=True, blank=True)
    dimensions = models.CharField(max_length=50, null=True, blank=True)
    conncetivity_options = models.CharField(max_length=50, null=True, blank=True)
    certifications = models.CharField(max_length=50, null=True, blank=True)

class Documentation(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='documentation')
    document = models.CharField(max_length=50, null=True, blank=True)
    types = models.CharField(max_length=50, null=True, blank=True)
    last_updated = models.DateField(auto_now_add=True)
    storage_location = models.CharField(max_length=255, blank=True, null=True) 
    
class Calibration(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='calibrations')
    calibration_date = models.DateTimeField()
    next_calibration = models.DateField(null=True, blank=True)
    result = models.CharField(max_length=50, null=True, blank=True) 
    notes = models.TextField(blank=True, null=True)
    engineer = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employe_calibration', null=True, blank=True)
    status = models.CharField(max_length=20, choices=[("scheduled", "Scheduled"), ("completed", "Completed"), ("overdue", "Overdue")], default="scheduled")
    document = models.FileField(upload_to='service_logs/%Y/%m/%d/', null=True, blank=True)
    def __str__(self):
        return f"Calibration on {self.device} - {self.calibration_date}"
    
    
class IncidentReport(models.Model):
    INCIDENT_TYPES = [
        ('env_fault', 'Environmental Fault'),
        ('user_fault', 'User Fault'),
        ('user_knowledge', 'User Lack of Knowledge'),
        ('user_carelessness', 'User Carelessness'),
        ('electrical_failure', 'Electrical Failure'),
        ('comp_failure', 'Component Failure'),
        ('comp_malfunction', 'Component Malfunction'),
        ('device_lifetime_end', 'Device Lifetime End'),
        ('incompatible_component', 'Incompatible Component'),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='incident_reports')
    incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPES)
    incident_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    reported_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents_reported')
    related_employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents_related')  # For user-related faults

    def __str__(self):
        return f"{self.incident_type} on {self.device} - {self.incident_date}"
    
@receiver(post_save, sender=Calibration)
def update_device_next_calibration(sender, instance, created, **kwargs):
    if created and instance.next_calibration:
        device = instance.device
        device.next_calibration = instance.next_calibration
        device.save(update_fields=['next_calibration'])

@receiver(post_save, sender=Device)
def create_or_update_qr_code(sender, instance, created, **kwargs):
    """Generate QR code when device is created or updated."""
    if created or not instance.qr_code:  # Generate on creation or if qr_code is empty
        instance.generate_qr_code()
        instance.save(update_fields=['qr_code'])