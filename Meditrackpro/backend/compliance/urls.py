from django.urls import path
from . import views

urlpatterns = [
    path('hospitals/<int:hospital_id>/compliance/standards/', views.ComplianceStandardListCreateView.as_view(), name='compliance-standard-list'),
    path('hospitals/<int:hospital_id>/compliance/standards/<int:pk>/', views.ComplianceStandardDetailView.as_view(), name='compliance-standard-detail'),
    path('hospitals/<int:hospital_id>/compliance/audits/', views.AuditListCreateView.as_view(), name='audit-list'),
    path('hospitals/<int:hospital_id>/compliance/audits/<int:pk>/', views.AuditDetailView.as_view(), name='audit-detail'),
    path('hospitals/<int:hospital_id>/compliance/documents/', views.ComplianceDocumentListCreateView.as_view(), name='compliance-document-list'),
    path('hospitals/<int:hospital_id>/compliance/documents/<int:pk>/', views.ComplianceDocumentDetailView.as_view(), name='compliance-document-detail'),
    path('hospitals/<int:hospital_id>/compliance/export/', views.ComplianceExportView.as_view(), name='compliance-export'),
]