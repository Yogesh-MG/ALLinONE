from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response  # Import Response
from django.utils import timezone
from django.db.models import Count
from datetime import timedelta
from .models import ClassInstance, Booking
from .serializers import ClassInstanceSerializer, BookingSerializer

class ClassInstanceListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ClassInstance.objects.all()
    serializer_class = ClassInstanceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                date = timezone.datetime.strptime(date_str, '%Y-%m-%d').date()
                start = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.min.time()))
                end = start + timedelta(days=1)
                queryset = queryset.filter(schedule__range=[start, end])
            except ValueError:
                # Log error or handle invalid date gracefully
                pass
        return queryset

class BookingListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related('member', 'class_instance')
        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                date = timezone.datetime.strptime(date_str, '%Y-%m-%d').date()
                start = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.min.time()))
                end = start + timedelta(days=1)
                queryset = queryset.filter(class_instance__schedule__range=[start, end])
            except ValueError:
                pass
        return queryset.order_by('-booked_at')[:5]  # Limit to 5 recent bookings

class WeeklyScheduleView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClassInstanceSerializer

    def get_queryset(self):
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())  # Monday of the current week
        end_of_week = start_of_week + timedelta(days=7)  # Sunday of the current week
        return ClassInstance.objects.filter(schedule__range=[start_of_week, end_of_week])

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        weekly_schedule = []
        start_of_week = timezone.now().date() - timedelta(days=timezone.now().date().weekday())

        for i, day in enumerate(days):
            day_date = start_of_week + timedelta(days=i)
            class_count = queryset.filter(schedule__date=day_date).count()
            weekly_schedule.append({'day': day, 'classes': class_count})

        return Response(weekly_schedule)