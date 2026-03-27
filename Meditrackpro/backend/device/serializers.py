from rest_framework import serializers
from .models import Device, ServiceLog, Specification, Documentation, Calibration, IncidentReport
from employees.serializers import EmployeeSerializer
from employees.models import Employee
from django.utils import timezone

class ServiceLogSerializer(serializers.ModelSerializer):
    engineer = EmployeeSerializer(read_only=True)
    engineer_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), source='engineer', write_only=True
    )
    document = serializers.FileField(required=False)
    class Meta:
        model = ServiceLog
        fields = ['id', 'service_date', 'service_type', 'engineer', 'engineer_id', 'service_details', 'status', 'document']

class SpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specification
        fields = ['id', 'power_supply', 'battery_type', 'battery_life', 'weight', 'dimensions', 'conncetivity_options', 'certifications']

class DocumentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documentation
        fields = ['id', 'document', 'types', 'last_updated', 'storage_location']

class CalibrationSerializer(serializers.ModelSerializer):
    engineer = EmployeeSerializer(read_only=True)
    engineer_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), source='engineer', write_only=True, allow_null=True
    )
    document = serializers.FileField(required=False)
    
    class Meta:
        model = Calibration
        fields = ['id', 'calibration_date', 'next_calibration', 'result', 'notes', 'engineer', 'engineer_id', 'status', 'document']

class IncidentReportSerializer(serializers.ModelSerializer):
    reported_by = EmployeeSerializer(read_only=True)
    related_employee = EmployeeSerializer(read_only=True)
    reported_by_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), source='reported_by', write_only=True, allow_null=True
    )
    related_employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), source='related_employee', write_only=True, allow_null=True
    )
    class Meta:
        model = IncidentReport
        fields = ['id', 'incident_type', 'incident_date', 'description', 'reported_by', 'reported_by_id', 'related_employee', 'related_employee_id']

        
class DeviceSerializer(serializers.ModelSerializer):
    service_logs = ServiceLogSerializer(many=True, read_only=True)
    specification = SpecificationSerializer(many=True, read_only=True)
    documentation = DocumentationSerializer(many=True, read_only=True)
    calibrations = CalibrationSerializer(many=True, read_only=True)
    incident_reports = IncidentReportSerializer(many=True, read_only=True)
    next_calibration = serializers.SerializerMethodField()  # Use method field instead of DateField
    qr_code = serializers.ImageField(read_only=True, allow_null=True)
    nfc_uuid = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    def get_next_calibration(self, obj):
        latest_calibration = obj.calibrations.order_by('-calibration_date').first()
        print(f"get_next_calibration for device {obj.id}:")
        print(f"  Latest calibration: {latest_calibration}")
        if latest_calibration:
            print(f"  Calibration ID: {latest_calibration.id}, next_calibration: {latest_calibration.next_calibration}")
        return latest_calibration.next_calibration if latest_calibration else None

    def validate_nfc_uuid(self, value):
        if value:
            # Check if NFC UUID is unique for this hospital
            hospital_id = self.context['request'].parser_context['kwargs']['hospital_id']
            if Device.objects.filter(hospital_id=hospital_id, nfc_uuid=value).exclude(
                id=self.instance.id if self.instance else None
            ).exists():
                raise serializers.ValidationError("NFC UUID must be unique for this hospital.")
        return value
    
    def update(self, instance, validated_data):
        next_calibration = validated_data.pop('next_calibration', None)
        validated_data.pop('asset_number', None)
        validated_data.pop('serial_number', None)

        print(f"Updating device {instance.id}, next_calibration from PATCH: {next_calibration}")

        # Update the Device instance with remaining fields
        instance = super().update(instance, validated_data)

        # Handle next_calibration
        if next_calibration is not None:
            latest_calibration = instance.calibrations.order_by('-calibration_date').first()
            if latest_calibration:
                print(f"Updating calibration {latest_calibration.id} with next_calibration: {next_calibration}")
                latest_calibration.next_calibration = next_calibration
                latest_calibration.save()
            else:
                print(f"Creating new calibration for device {instance.id} with next_calibration: {next_calibration}")
                new_calibration = Calibration.objects.create(
                    device=instance,
                    calibration_date=timezone.now().date(),
                    next_calibration=next_calibration
                )
                print(f"Created calibration: {new_calibration.id}")

        print(f"Calibrations after update: {list(instance.calibrations.all())}")
        return instance

    class Meta:
        model = Device
        fields = [
            'id', 'hospital', 'name', 'make_model', 'manufacture', 'serial_number',
            'date_of_installation', 'warranty_until', 'asset_number', 'asset_details',
            'nfc_uuid', 'is_active', 'department', 'Room', 'next_calibration', 'service_logs',
            'specification', 'documentation', 'calibrations', 'incident_reports',
            'qr_code'
        ]
        read_only_fields = ['hospital', 'id', 'qr_code']