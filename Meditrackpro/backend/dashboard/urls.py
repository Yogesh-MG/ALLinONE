from django.urls import path
from .views import DashboardStatsView

urlpatterns = [
    # The main dashboard endpoint
    path('dashboard/hospitals/<int:hospital_id>/dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
]