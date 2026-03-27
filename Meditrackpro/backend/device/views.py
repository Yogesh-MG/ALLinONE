from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from hospitals.permissions import IsTechnicianOrAdmin
from hospitals.models import Hospital
from django.shortcuts import get_object_or_404
from .models import Device, ServiceLog, Specification, Documentation, IncidentReport, Calibration
from .serializers import DeviceSerializer, CalibrationSerializer, ServiceLogSerializer, SpecificationSerializer, DocumentationSerializer, IncidentReportSerializer
from rest_framework.views import APIView

class DeviceByNFCView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, hospital_id, nfc_uuid):
        try:
            device = Device.objects.get(hospital_id=hospital_id, nfc_uuid=nfc_uuid)
            serializer = DeviceSerializer(device)
            return Response({'id': device.id, 'device_id':device.device_id}, status=status.HTTP_200_OK)
        except Device.DoesNotExist:
            return Response(
                {'error': "Device not found for this NFC UUID."},
                status=status.HTTP_404_NOT_FOUND
            )

class DeviceListView(generics.ListCreateAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hospital_id = self.kwargs.get('hospital_id')
        if hospital_id:
            return Device.objects.filter(hospital__id=hospital_id).prefetch_related('calibrations')
        return Device.objects.none()  # Safety fallback
    
    def perform_create(self, serializer):
        hospital_id = self.kwargs.get('hospital_id')
        if hospital_id:
            hospital = Hospital.objects.get(id=hospital_id)
            serializer.save(hospital=hospital)

class DeviceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [IsTechnicianOrAdmin]
    
    def get_queryset(self):
        hospital_id = self.kwargs.get('hospital_id')
        if hospital_id:
            return Device.objects.filter(hospital__id=hospital_id).prefetch_related('calibrations')
        return Device.objects.none()

    def get_object(self):
        obj = super().get_object()
        obj.calibrations.all()  # Force load
        return obj

class ServiceLogCreateView(generics.CreateAPIView):
    serializer_class = ServiceLogSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        device = get_object_or_404(Device, id=self.kwargs['device_id'], hospital__id=self.kwargs['hospital_id'])
        serializer.save(device=device)

class SpecificationCreateView(generics.CreateAPIView):
    serializer_class = SpecificationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        device = get_object_or_404(Device, id=self.kwargs['device_id'], hospital__id=self.kwargs['hospital_id'])
        serializer.save(device=device)

class DocumentationCreateView(generics.CreateAPIView):
    serializer_class = DocumentationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        device = get_object_or_404(Device, id=self.kwargs['device_id'], hospital__id=self.kwargs['hospital_id'])
        serializer.save(device=device)

class IncidentReportCreateView(generics.CreateAPIView):
    serializer_class = IncidentReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        device = get_object_or_404(Device, id=self.kwargs['device_id'], hospital__id=self.kwargs['hospital_id'])
        serializer.save(device=device)
        
class CalibrationCreateView(generics.CreateAPIView):
    serializer_class = CalibrationSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        device = get_object_or_404(Device, id=self.kwargs['device_id'], hospital__id=self.kwargs['hospital_id'])
        serializer.save(device=device)
        
class ServiceLogUpdateView(generics.UpdateAPIView):
    serializer_class = ServiceLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ServiceLog.objects.filter(device__hospital__id=self.kwargs['hospital_id'], device__id=self.kwargs['device_id'])

class CalibrationUpdateView(generics.UpdateAPIView):
    serializer_class = CalibrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Calibration.objects.filter(device__hospital__id=self.kwargs['hospital_id'], device__id=self.kwargs['device_id'])