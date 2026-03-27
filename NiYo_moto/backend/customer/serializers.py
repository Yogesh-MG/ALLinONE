from rest_framework import serializers
from .models import CustomerModel

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerModel
        fields = ['id', 'name', 'phone_number','gstin', 'email','address','company_name', 'created_at']
        read_only_fields = ['id', 'created_at']