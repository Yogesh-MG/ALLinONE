from django.urls import path
from .views import DeviceListView, DeviceDetailView, ServiceLogCreateView, CalibrationCreateView,SpecificationCreateView, DocumentationCreateView,IncidentReportCreateView
from .views import ServiceLogUpdateView, CalibrationUpdateView, DeviceByNFCView

urlpatterns = [
    # Multi-tenant
    path('<int:hospital_id>/devices/', DeviceListView.as_view(), name='device-list'),
    path('<int:hospital_id>/devices/<int:pk>/', DeviceDetailView.as_view(), name='device-detail'),
    path('<int:hospital_id>/devices/<int:device_id>/service-logs/', ServiceLogCreateView.as_view(), name='service-log-create'),
    path('<int:hospital_id>/devices/<int:device_id>/calibrations/', CalibrationCreateView.as_view(), name='calibration-create'),
    path('<int:hospital_id>/devices/<int:device_id>/specifications/', SpecificationCreateView.as_view(), name='specification-create'),
    path('<int:hospital_id>/devices/<int:device_id>/documentation/', DocumentationCreateView.as_view(), name='documentation-create'),
    path('<int:hospital_id>/devices/<int:device_id>/incident-reports/', IncidentReportCreateView.as_view(), name='incident-report-create'),
    path('<int:hospital_id>/devices/<int:device_id>/service-logs/<int:pk>/', ServiceLogUpdateView.as_view(), name='service-log-update'),
    path('<int:hospital_id>/devices/<int:device_id>/calibrations/<int:pk>/', CalibrationUpdateView.as_view(), name='calibration-update'),
    path('<int:hospital_id>/devices/nfc/<str:nfc_uuid>/', DeviceByNFCView.as_view(), name='device-by-nfc'),
]
