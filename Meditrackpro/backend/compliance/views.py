from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from hospitals.models import Hospital
from .models import ComplianceStandard, Audit, ComplianceDocument
from .serializers import ComplianceStandardSerializer, AuditSerializer, ComplianceDocumentSerializer
from hospitals.permissions import IsComplianceManager
import csv
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

class ComplianceStandardListCreateView(generics.ListCreateAPIView):
    serializer_class = ComplianceStandardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ComplianceStandard.objects.filter(hospital_id=self.kwargs['hospital_id'])

    def perform_create(self, serializer):
        hospital = get_object_or_404(Hospital, id=self.kwargs['hospital_id'])
        serializer.save(hospital=hospital)

class ComplianceStandardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ComplianceStandardSerializer
    permission_classes = [IsAuthenticated, IsComplianceManager]

    def get_queryset(self):
        return ComplianceStandard.objects.filter(hospital_id=self.kwargs['hospital_id'])

class AuditListCreateView(generics.ListCreateAPIView):
    serializer_class = AuditSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Audit.objects.filter(hospital_id=self.kwargs['hospital_id'])

    def perform_create(self, serializer):
        hospital = get_object_or_404(Hospital, id=self.kwargs['hospital_id'])
        serializer.save(hospital=hospital)

class AuditDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AuditSerializer
    permission_classes = [IsAuthenticated, IsComplianceManager]

    def get_queryset(self):
        return Audit.objects.filter(hospital_id=self.kwargs['hospital_id'])

class ComplianceDocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = ComplianceDocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ComplianceDocument.objects.filter(hospital_id=self.kwargs['hospital_id'])

    def perform_create(self, serializer):
        hospital = get_object_or_404(Hospital, id=self.kwargs['hospital_id'])
        serializer.save(hospital=hospital)

class ComplianceDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ComplianceDocumentSerializer
    permission_classes = [IsAuthenticated, IsComplianceManager]

    def get_queryset(self):
        return ComplianceDocument.objects.filter(hospital_id=self.kwargs['hospital_id'])

class ComplianceExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, hospital_id):
        standards = ComplianceStandard.objects.filter(hospital_id=hospital_id)
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="compliance_export_{hospital_id}.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Status', 'Progress', 'Last Audit', 'Next Audit'])
        for standard in standards:
            writer.writerow([
                standard.id,
                standard.name,
                standard.status,
                standard.progress,
                standard.last_audit_date or 'N/A',
                standard.next_audit_date or 'N/A'
            ])
        return response