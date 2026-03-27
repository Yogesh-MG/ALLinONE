from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count, Q
from datetime import timedelta
from .models import StaffMember, Schedule, Resource
from .serializers import StaffMemberSerializer, ScheduleSerializer, ResourceSerializer

class StaffMemberListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StaffMember.objects.all()
    serializer_class = StaffMemberSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related('user')
        search = self.request.query_params.get('search', '')
        department = self.request.query_params.get('department', 'all')
        if search:
            queryset = queryset.filter(
                Q(staff_id__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(role__icontains=search) |
                Q(user__email__icontains=search)
            )
        if department != 'all':
            queryset = queryset.filter(department__icontains=department)
        return queryset.order_by('user__first_name')

class ScheduleListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related('staff')
        return queryset.order_by('day', 'time')

class ResourceListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.order_by('name')

class StaffKPISummaryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StaffMemberSerializer  # Not directly used, but required

    def list(self, request, *args, **kwargs):
        today = timezone.now().date()
        last_month = today - timedelta(days=30)
        total_staff = StaffMember.objects.count()
        hours_this_week = Schedule.objects.filter(
            created_at__gte=last_month
        ).aggregate(total=Sum('staff__hours_week'))['total'] or 0
        classes_scheduled = Schedule.objects.filter(
            created_at__gte=last_month
        ).count()
        payroll_estimate = total_staff * 1185.42  # Placeholder: avg monthly salary

        kpi_data = [
            {
                'title': 'Total Staff',
                'value': str(total_staff),
                'change': '+2',  # Placeholder
                'icon': 'Users',
                'trend': 'up'
            },
            {
                'title': 'Hours This Week',
                'value': str(hours_this_week),
                'change': '+45',  # Placeholder
                'icon': 'Clock',
                'trend': 'up'
            },
            {
                'title': 'Classes Scheduled',
                'value': str(classes_scheduled),
                'change': '+12',  # Placeholder
                'icon': 'Calendar',
                'trend': 'up'
            },
            {
                'title': 'Payroll This Month',
                'value': f"${payroll_estimate:,.2f}",
                'change': '+8.5%',  # Placeholder
                'icon': 'DollarSign',
                'trend': 'up'
            }
        ]
        return Response(kpi_data)