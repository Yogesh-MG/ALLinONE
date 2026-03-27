# patients/models.py
from django.db import models
from hospitals.models import Hospital
from employees.models import Employee
from django.contrib.auth.models import User
from django.utils import timezone

class Patient(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )
    BLOOD_TYPE_CHOICES = (
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    )
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    )

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='patients')
    patient_id = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True, default='India')
    blood_type = models.CharField(max_length=10, choices=BLOOD_TYPE_CHOICES, blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    primary_physician = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='patients')
    allergies = models.TextField(blank=True, null=True)
    medical_conditions = models.TextField(blank=True, null=True)
    medication = models.TextField(blank=True, null=True)
    insurance_provider = models.CharField(max_length=100, blank=True, null=True)
    policy_number = models.CharField(max_length=50, blank=True, null=True)
    group_number = models.CharField(max_length=50, blank=True, null=True)
    policy_holder = models.CharField(max_length=100, blank=True, null=True)
    relationship_to_holder = models.CharField(max_length=50, blank=True, null=True)
    coverage_start_date = models.DateField(blank=True, null=True)
    coverage_end_date = models.DateField(blank=True, null=True)
    has_secondary_insurance = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    last_visit = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['hospital', 'patient_id'], name='unique_patient_id_per_hospital')
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.patient_id})"

    def save(self, *args, **kwargs):
        if not self.patient_id:
            last_patient = Patient.objects.filter(hospital=self.hospital).order_by('-id').first()
            last_number = int(last_patient.patient_id.split('-')[1]) if last_patient and last_patient.patient_id else 1000
            self.patient_id = f"P-{last_number + 1}"
        super().save(*args, **kwargs)

class EmergencyContact(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.relationship}) for {self.patient}"

class Vital(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='vitals')
    heart_rate = models.IntegerField(blank=True, null=True)  # bpm
    blood_pressure = models.CharField(max_length=20, blank=True, null=True)  # e.g., "120/80"
    temperature = models.FloatField(blank=True, null=True)  # °F
    respiratory_rate = models.IntegerField(blank=True, null=True)  # breaths per minute
    oxygen_saturation = models.IntegerField(blank=True, null=True)  # %
    recorded_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Vitals for {self.patient} at {self.recorded_at}"

class MedicalHistory(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Controlled', 'Controlled'),
        ('Resolved', 'Resolved'),
    )

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_history')
    condition = models.CharField(max_length=200)
    diagnosed_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.condition} for {self.patient}"

class Medication(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=100)
    prescribed_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='prescriptions')
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} for {self.patient}"

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Canceled', 'Canceled'),
    )

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    type = models.CharField(max_length=100, default='Consultation')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type} for {self.patient} with {self.doctor} on {self.appointment_date}"