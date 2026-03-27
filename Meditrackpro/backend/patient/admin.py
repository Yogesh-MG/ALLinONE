from django.contrib import admin
from .models import Patient, EmergencyContact

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'first_name', 'last_name', 'hospital', 'date_of_birth', 'gender', 'status', 'created_at')
    list_filter = ('hospital', 'gender', 'status')
    search_fields = ('patient_id', 'first_name', 'last_name', 'email')
    readonly_fields = ('patient_id', 'created_at', 'updated_at')

@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('patient', 'name', 'relationship', 'phone', 'created_at')
    list_filter = ('patient__hospital', 'relationship')
    search_fields = ('name', 'phone', 'relationship')