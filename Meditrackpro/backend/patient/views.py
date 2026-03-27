# patients/views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer
from hospitals.models import Hospital
from hospitals.permissions import IsTechnicianOrAdmin
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 50

class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['gender', 'status']
    ordering_fields = ['created_at', 'last_name', 'last_visit']
    ordering = ['-created_at']
    search_fields = ['first_name', 'last_name', 'patient_id', 'email', 'phone_number']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        return Patient.objects.filter(hospital_id=hospital_id)

    def perform_create(self, serializer):
        hospital = Hospital.objects.get(id=self.kwargs['hospital_id'])
        serializer.save(hospital=hospital)

class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'patient_id'

    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        return Patient.objects.filter(hospital_id=hospital_id)