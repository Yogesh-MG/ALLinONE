from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Hospital


class HospitalSerializer(serializers.ModelSerializer):
    admin = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Hospital
        fields = ['name', 'hospital_type', 'address', 'city', 'state', 
                  'zipcode', 'phone_number', 'email', 'admin', 'gstin']
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password':{'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        
        return user