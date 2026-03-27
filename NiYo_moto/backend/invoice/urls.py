from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SupplierViewSet,
    IncomingGoodViewSet, 
    QuotationViewSet, 
    InvoiceViewSet,
    MotorViewSet,
    SendEmailView
)

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)
router.register(r'incoming-goods', IncomingGoodViewSet)
router.register(r'quotations', QuotationViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'motors', MotorViewSet)

# Since CustomerViewset was a generic ListCreateAPIView in your code, 
# you might need to adapt it to router or keep it separate.
# Ideally, convert CustomerViewset to a ModelViewSet for full CRUD.

urlpatterns = [
    path('', include(router.urls)),
    path('send-email/', SendEmailView.as_view(), name='send-email'),
]