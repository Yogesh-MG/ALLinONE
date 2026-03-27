# compliance/serializers.py
from rest_framework import serializers
from .models import ComplianceStandard, Audit, ComplianceDocument
from django.utils import timezone

class ComplianceStandardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceStandard
        fields = ['id', 'name', 'status', 'progress', 'last_audit_date', 'next_audit_date', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class AuditSerializer(serializers.ModelSerializer):
    compliance_standard_id = serializers.PrimaryKeyRelatedField(
        queryset=ComplianceStandard.objects.all(), source='Compliance_standard', write_only=True
    )

    class Meta:
        model = Audit
        fields = ['id', 'title', 'audit_date', 'status', 'auditor', 'notes', 'compliance_standard_id', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_audit_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Audit date must be in the future.")
        return value

    def create(self, validated_data):
        compliance_standard = validated_data.pop('Compliance_standard', None)
        audit = Audit.objects.create(
            Compliance_standard=compliance_standard,
            **validated_data
        )
        return audit

class ComplianceDocumentSerializer(serializers.ModelSerializer):
    compliance_standard_id = serializers.PrimaryKeyRelatedField(
        queryset=ComplianceStandard.objects.all(), source='Compliance_standard', write_only=True
    )
    file = serializers.FileField(allow_null=True, required=False)

    class Meta:
        model = ComplianceDocument
        fields = ['id', 'name', 'file', 'status', 'last_updated', 'compliance_standard_id', 'created_at', 'updated_at']
        read_only_fields = ['last_updated', 'created_at', 'updated_at']