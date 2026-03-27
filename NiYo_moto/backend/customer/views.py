from rest_framework import viewsets, filters
from .models import CustomerModel
from .serializers import CustomerSerializer


class CustomerViewset(viewsets.ModelViewSet):
    queryset = CustomerModel.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'phone_number', 'gstin', 'company_name']
