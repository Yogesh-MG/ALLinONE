from rest_framework import serializers
from django.contrib.auth.models import User
from .models import GymSettings, MembershipPlan, Member, Class, Activity, Booking, Achievement, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

class GymSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymSettings
        fields = [
            'gym_name', 'email', 'phone', 'address', 'website', 'timezone',
            'currency', 'date_format', 'language', 'email_notifications',
            'sms_notifications', 'push_notifications', 'two_factor', 'auto_backup',
            'primary_color', 'secondary_color', 'logo'
        ]

class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = ['id', 'name', 'description', 'price', 'features', 'is_active', 'created_at', 'updated_at']

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'description', 'instructor', 'schedule', 'duration_minutes', 'capacity', 'created_at']

class ActivitySerializer(serializers.ModelSerializer):
    member = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all())
    member_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = ['id', 'member', 'member_name', 'type', 'title', 'timestamp', 'location', 'duration', 'confidence']
    
    def get_member_name(self, obj):
        return obj.member.user.username

class BookingSerializer(serializers.ModelSerializer):
    class_instance = ClassSerializer(read_only=True)
    class_instance_id = serializers.PrimaryKeyRelatedField(
        queryset=Class.objects.all(), source='class_instance', write_only=True
    )

    class Meta:
        model = Booking
        fields = ['id', 'class_instance', 'class_instance_id', 'status', 'booked_at']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'earned_date']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'member', 'message_type', 'subject', 'content', 'sent_at']

class MemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    email = serializers.EmailField(source='user.email', required=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    membership = serializers.CharField(source='membership_plan.name', allow_null=True, read_only=True)
    membership_plan = serializers.PrimaryKeyRelatedField(queryset=MembershipPlan.objects.all(), allow_null=True)
    classes = serializers.PrimaryKeyRelatedField(many=True, queryset=Class.objects.all(), required=False)
    activities = ActivitySerializer(many=True, read_only=True)
    bookings = BookingSerializer(many=True, read_only=True)
    achievements = AchievementSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Member
        fields = [
            'id', 'name', 'email', 'first_name', 'last_name', 'phone', 'membership', 'membership_plan',
            'classes', 'join_date', 'last_visit', 'status', 'address', 'emergency_contact',
            'emergency_phone', 'date_of_birth', 'gender', 'activities', 'bookings', 'achievements', 'messages'
        ]

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    def create(self, validated_data):
        user_data = validated_data.pop('user', {})  # this contains email, first_name, last_name
        email = user_data.get('email')
        first_name = user_data.get('first_name', '')
        last_name = user_data.get('last_name', '')

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password='default_password'
        )
        validated_data['user'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        user_data = {
            'first_name': validated_data.pop('user', {}).get('first_name', instance.user.first_name),
            'last_name': validated_data.pop('user', {}).get('last_name', instance.user.last_name),
        }
        instance.user.first_name = user_data['first_name']
        instance.user.last_name = user_data['last_name']
        instance.user.save()
        return super().update(instance, validated_data)