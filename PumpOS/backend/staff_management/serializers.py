from rest_framework import serializers
from .models import StaffMember, Schedule, Resource, User

class StaffMemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email')
    certifications = serializers.JSONField()

    class Meta:
        model = StaffMember
        fields = ['id', 'staff_id', 'name', 'role', 'department', 'status', 'hours_week', 'phone', 'email', 'join_date', 'certifications', 'avatar']

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def create(self, validated_data):
        user_data = {
            'username': validated_data['user']['email'],  # Use email as username
            'email': validated_data['user']['email'],
            'first_name': validated_data.get('first_name', ''),
            'last_name': validated_data.get('last_name', ''),
        }
        user = User.objects.create_user(**user_data)
        validated_data['user'] = user
        return super().create(validated_data)

class ScheduleSerializer(serializers.ModelSerializer):
    staff = serializers.SlugRelatedField(slug_field='staff_id', queryset=StaffMember.objects.all())

    class Meta:
        model = Schedule
        fields = ['id', 'staff', 'day', 'time', 'type']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'name', 'type', 'status', 'location', 'capacity', 'maintenance']