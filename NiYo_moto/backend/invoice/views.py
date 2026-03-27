from rest_framework import status, viewsets, filters
from .models import IncomingGood, Quotation, Invoice, Supplier, Motor
from rest_framework.permissions import AllowAny
from .serializers import IncomingGoodSerializer, QuotationSerializer, InvoiceSerializer, SupplierSerializer, MotorSerializer
from django.core.mail import EmailMessage
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings



class IncomingGoodViewSet(viewsets.ModelViewSet):
    queryset = IncomingGood.objects.all()
    serializer_class = IncomingGoodSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['item_name', 'supplier__name']

class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['quotation_id', 'customer__name']

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['invoice_id', 'customer__name']

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [AllowAny]
    
class MotorViewSet(viewsets.ModelViewSet):
    queryset = Motor.objects.all().order_by('-created_at')
    serializer_class = MotorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'power_rating', 'motor_type']

class SendEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')
        file = request.FILES.get('file')
        
        if not email or not file:
            return Response({'error': 'Email and file are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            email_msg = EmailMessage(subject, message, to=[email])
            email_msg.attach(file.name, file.read(), file.content_type)
            email_msg.send()
            return Response({'status': 'sent'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)