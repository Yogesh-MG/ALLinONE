# patients/urls.py
from django.urls import path
from .views import PatientListCreateView, PatientDetailView

urlpatterns = [
    path('hospitals/<int:hospital_id>/patients/', PatientListCreateView.as_view(), name='patient-list-create'),
    path('hospitals/<int:hospital_id>/patients/<str:patient_id>/', PatientDetailView.as_view(), name='patient-detail'),
]