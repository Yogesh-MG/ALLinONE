from rest_framework import serializers
from .models import Ticket, TicketComment
from django.contrib.auth.models import User
from device.serializers import DeviceSerializer
from device.models import Device
from employees.models import Employee
from hospitals.serializers import HospitalSerializer
from employees.serializers import EmployeeSerializer
from django.utils import timezone


class TicketCommentSerializer(serializers.ModelSerializer):
    author = EmployeeSerializer(read_only=True)
    author_id = serializers.CharField(write_only=True, required=True)
    file = serializers.FileField(allow_null=True, required=False)

    class Meta:
        model = TicketComment
        fields = ['id', 'ticket', 'author', 'author_id', 'content', 'file', 'created_at']
        read_only_fields = ['ticket', 'created_at']

    def validate_author_id(self, value):
        print(f"Validating author_id: {value}")  # Debug log
        try:
            employee = Employee.objects.get(employee_id=value)
            print(f"Found employee: {employee}")  # Debug log
            return employee.id
        except Employee.DoesNotExist:
            print(f"Employee with ID {value} does not exist")  # Debug log
            raise serializers.ValidationError(f"Employee with ID {value} does not exist.")

    def validate(self, data):
        if not data.get('content').strip():
            raise serializers.ValidationError({"content": "Comment can’t be empty!"})
        if data.get('file'):
            max_size = 5 * 1024 * 1024  # 5MB
            if data['file'].size > max_size:
                raise serializers.ValidationError({"file": "File’s too big! Keep it under 5MB."})
        return data

class TicketSerializer(serializers.ModelSerializer):
    device = DeviceSerializer(read_only=True)
    device_id = serializers.PrimaryKeyRelatedField(
        queryset=Device.objects.all(), source='device', write_only=True, allow_null=True
    )
    nfc_uuid = serializers.CharField(write_only=True, required=False, allow_blank=True)  # New field for NFC UUID
    created_by = EmployeeSerializer(read_only=True)
    created_by_id = serializers.CharField(write_only=True, allow_null=False)
    assigned_to = EmployeeSerializer(read_only=True, allow_null=True)
    assigned_to_id = serializers.CharField(write_only=True, allow_null=True)
    hospital = HospitalSerializer(read_only=True)
    comments = TicketCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_id', 'hospital', 'title', 'device', 'device_id', 'nfc_uuid',
            'category', 'priority', 'status', 'location', 'created_by', 'created_by_id',
            'assigned_to', 'assigned_to_id', 'description', 'created_at', 'updated_at', 'comments'
        ]
        read_only_fields = ['ticket_id', 'hospital', 'created_at', 'updated_at']

    def validate_created_by_id(self, value):
        try:
            employee = Employee.objects.get(employee_id=value)
            return employee
        except Employee.DoesNotExist:
            raise serializers.ValidationError(f"Employee with ID {value} does not exist.")

    def validate_assigned_to_id(self, value):
        if not value:
            return None
        try:
            employee = Employee.objects.get(employee_id=value)
            if employee.role != 'engineer':
                raise serializers.ValidationError(f"Employee with ID {value} must be a Biomedical Engineer.")
            return employee
        except Employee.DoesNotExist:
            raise serializers.ValidationError(f"Employee with ID {value} does not exist.")

    def validate(self, data):
        if self.partial:
            return data
        if not data.get('title'):
            raise serializers.ValidationError({"title": "Title cannot be empty, bro!"})
        if len(data.get('title')) < 3:
            raise serializers.ValidationError({"title": "Title needs at least 3 characters."})
        if not data.get('description'):
            raise serializers.ValidationError({"description": "Gotta describe the issue!"})
        if len(data.get('description')) < 10:
            raise serializers.ValidationError({"description": "Description needs at least 10 characters."})
        if not data.get('location'):
            raise serializers.ValidationError({"location": "Where’s this happening? Add a location."})
        if not data.get('category'):
            raise serializers.ValidationError({"category": "Specify a category."})

        # Validate NFC UUID if provided
        nfc_uuid = data.get('nfc_uuid')
        device = data.get('device')
        if nfc_uuid and not device:
            try:
                device = Device.objects.get(nfc_uuid=nfc_uuid, hospital_id=self.context['request'].parser_context['kwargs']['hospital_id'])
                data['device'] = device
            except Device.DoesNotExist:
                raise serializers.ValidationError({"nfc_uuid": "No device found for this NFC UUID."})
        elif nfc_uuid and device and device.nfc_uuid != nfc_uuid:
            raise serializers.ValidationError({"nfc_uuid": "NFC UUID does not match the selected device."})

        return data

    def create(self, validated_data):
        created_by_employee = validated_data.pop('created_by_id', None)
        if not created_by_employee:
            raise serializers.ValidationError({"created_by_id": "Employee is required."})
        validated_data['created_by'] = created_by_employee
        assigned_to_employee = validated_data.pop('assigned_to_id', None)
        if assigned_to_employee:
            validated_data['assigned_to'] = assigned_to_employee
        validated_data.pop('device_id', None)
        validated_data.pop('nfc_uuid', None)  # Remove nfc_uuid as it's not a model field
        ticket = Ticket.objects.create(**validated_data)
        return ticket