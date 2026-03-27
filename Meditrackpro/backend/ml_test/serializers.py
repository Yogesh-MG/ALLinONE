from rest_framework import serializers

class XrayUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
