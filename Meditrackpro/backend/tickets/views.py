from rest_framework import generics, permissions, status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Ticket, TicketComment
from .serializers import TicketSerializer, TicketCommentSerializer
from hospitals.models import Hospital
from employees.models import Employee
from hospitals.permissions import IsTechnicianOrTicketCreator
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.shortcuts import get_object_or_404

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 50
    
class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['category', 'status', 'priority', 'location']
    ordering_fields = ['created_at', 'updated_at', 'priority', 'status']
    ordering = ['-created_at']
    search_fields = ['title', 'ticket_id', 'description', 'location']
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        queryset = Ticket.objects.filter(hospital_id=hospital_id)
        status = self.request.query_params.get('status')
        
        if status:
            queryset = queryset.filter(status=status)
        return queryset
    
    def perform_create(self, serializer):
        hospital = Hospital.objects.get(id=self.kwargs['hospital_id'])
        created_by = serializer.validated_data.get('created_by')
        try:
            employee = Employee.objects.get(user=self.request.user)
            if created_by and created_by != employee:
                raise serializers.ValidationError({"created_by": "Cannot create ticket as another user."})
        except Employee.DoesNotExist:
            raise serializers.ValidationError({"created_by": "No Employee record found for this user."})
        serializer.save(hospital=hospital)
        
class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsTechnicianOrTicketCreator]
    lookup_field = 'ticket_id'
    
    def get_queryset(self):
        return Ticket.objects.filter(hospital_id=self.kwargs['hospital_id'])
    
    def perform_update(self, serializer):
        assigned_to = serializer.validated_data.get('assigned_to')
        if assigned_to and not assigned_to.groups.filter(name='Engineer').exists():
            return serializer.ValidationError({"assigned_to": "assignee must be engineer. "})
        serializer.save(updated_at=timezone.now())\
            
class TicketCommentCreateView(generics.CreateAPIView):
    serializer_class = TicketCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        ticket = get_object_or_404(Ticket, ticket_id=self.kwargs['ticket_id'], hospital_id=self.kwargs['hospital_id'])
        serializer.save(ticket=ticket)