from rest_framework import serializers
from .models import ClassInstance, Booking
from gymnast.models import Member
from gymnast.serializers import MemberSerializer  # Import MemberSerializer if exists

class ClassInstanceSerializer(serializers.ModelSerializer):
    booked = serializers.SerializerMethodField()
    waitlist = serializers.SerializerMethodField()

    class Meta:
        model = ClassInstance
        fields = ['id', 'name', 'schedule', 'duration', 'instructor', 'room', 'capacity', 'booked', 'waitlist', 'status']

    def get_booked(self, obj):
        return obj.bookings.filter(status='confirmed').count()

    def get_waitlist(self, obj):
        return obj.bookings.filter(status='waitlist').count()

class BookingSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField()
    class_instance = ClassInstanceSerializer()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'member', 'class_instance', 'status', 'booked_at', 'avatar']

    def get_member(self, obj):
        return f"{obj.member.user.first_name} {obj.member.user.last_name}"

    def get_avatar(self, obj):
        return obj.member.avatar.url if obj.member.avatar else '/placeholder.svg'