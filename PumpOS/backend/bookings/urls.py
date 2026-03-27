from django.urls import path
from .views import ClassInstanceListCreateView, BookingListCreateView, WeeklyScheduleView

urlpatterns = [
    path('classes/', ClassInstanceListCreateView.as_view(), name='class_instance_list_create'),
    path('bookings/', BookingListCreateView.as_view(), name='booking_list_create'),
    path('weekly-schedule/', WeeklyScheduleView.as_view(), name='weekly_schedule'),
]