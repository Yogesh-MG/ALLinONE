from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Employee

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class EmployeeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = ['id', 'user', 'name', 'hospital','role', 'department', 'phone_number', 'status', 'access_level','date_of_birth', 'employee_id']
    
    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['email'] = instance.user.email
        rep['phone'] = instance.phone_number
        rep['access'] = instance.access_level
        rep['dateOfBirth'] = instance.date_of_birth.isoformat() if instance.date_of_birth else None
        rep['employeeId'] = instance.employee_id
        return rep