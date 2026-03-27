from django.urls import path
from .views import StaffMemberListCreateView, ScheduleListCreateView, ResourceListCreateView, StaffKPISummaryView

urlpatterns = [
    path('staff/', StaffMemberListCreateView.as_view(), name='staff_list_create'),
    path('schedules/', ScheduleListCreateView.as_view(), name='schedule_list_create'),
    path('resources/', ResourceListCreateView.as_view(), name='resource_list_create'),
    path('kpi-summary/', StaffKPISummaryView.as_view(), name='staff_kpi_summary'),
]