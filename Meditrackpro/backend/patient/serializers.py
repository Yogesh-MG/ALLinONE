# patients/serializers.py
from rest_framework import serializers
from .models import Patient, EmergencyContact, Vital, MedicalHistory, Medication, Appointment
from employees.serializers import EmployeeSerializer
from employees.models import Employee
from hospitals.models import Hospital
from django.utils import timezone

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ['id', 'name', 'relationship', 'phone', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class VitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vital
        fields = ['id', 'heart_rate', 'blood_pressure', 'temperature', 'respiratory_rate', 'oxygen_saturation', 'recorded_at', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        fields = ['id', 'condition', 'diagnosed_date', 'status', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class MedicationSerializer(serializers.ModelSerializer):
    prescribed_by = EmployeeSerializer(read_only=True)
    prescribed_by_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.filter(role='doctor'), source='prescribed_by', write_only=True, allow_null=True
    )

    class Meta:
        model = Medication
        fields = ['id', 'name', 'dosage', 'frequency', 'prescribed_by', 'prescribed_by_id', 'start_date', 'end_date', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class AppointmentSerializer(serializers.ModelSerializer):
    doctor = EmployeeSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.filter(role='doctor'), source='doctor', write_only=True, allow_null=True
    )

    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'doctor_id', 'appointment_date', 'appointment_time', 'type', 'status', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class PatientSerializer(serializers.ModelSerializer):
    hospital = serializers.PrimaryKeyRelatedField(queryset=Hospital.objects.all(), write_only=True)
    primary_physician = EmployeeSerializer(read_only=True)
    primary_physician_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.filter(role='doctor'), source='primary_physician', write_only=True, allow_null=True
    )
    emergency_contacts = EmergencyContactSerializer(many=True, read_only=True)
    vitals = VitalSerializer(many=True, read_only=True)
    medical_history = MedicalHistorySerializer(many=True, read_only=True)
    medications = MedicationSerializer(many=True, read_only=True)
    appointments = AppointmentSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'hospital', 'patient_id', 'first_name', 'last_name', 'date_of_birth', 'gender',
            'email', 'phone_number', 'address', 'city', 'state', 'postal_code', 'country',
            'blood_type', 'height', 'weight', 'primary_physician', 'primary_physician_id',
            'allergies', 'medical_conditions', 'medications', 'insurance_provider', 'policy_number',
            'group_number', 'policy_holder', 'relationship_to_holder', 'coverage_start_date',
            'coverage_end_date', 'has_secondary_insurance', 'status', 'last_visit',
            'emergency_contacts', 'vitals', 'medical_history', 'appointments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['patient_id', 'created_at', 'updated_at']

    def validate(self, data):
        if not data.get('first_name') or not data.get('last_name'):
            raise serializers.ValidationError({"first_name": "First and last name are required."})
        if data.get('date_of_birth') and data['date_of_birth'] > timezone.now().date():
            raise serializers.ValidationError({"date_of_birth": "Date of birth cannot be in the future."})
        return data