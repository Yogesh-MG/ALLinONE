from rest_framework import serializers
from .models import InventoryItem, Category, Unit
from django.utils import timezone

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        if len(value) > 50:
            raise serializers.ValidationError("Name must be 50 characters or less.")
        # Note: Global uniqueness is enforced by the model
        return value
        
class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name']
    
    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        if len(value) > 50:
            raise serializers.ValidationError("Name must be 50 characters or less.")
        # Note: Global uniqueness is enforced by the model
        return value
        
class InventoryItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, allow_null=True
    )
    unit = UnitSerializer(read_only=True)
    unit_id = serializers.PrimaryKeyRelatedField(
        queryset=Unit.objects.all(), source='unit', write_only=True, allow_null=True
    )
    stock_level = serializers.SerializerMethodField()
    expiry_status = serializers.SerializerMethodField()
    cost = serializers.FloatField()
    tax = serializers.FloatField(allow_null=True)
    
    def get_stock_level(self,  obj):
        if obj.quantity <= obj.reorder_level:
            return 'Low'
        elif obj.quantity <= obj.reorder_level * 2:
            return 'Medium'
        return 'High'
    
    def get_expiry_status(self, obj):
        if not obj.expiry_date:
            return 'N/A'
        days_until_expiry = (obj.expiry_date - timezone.now().date()).days
        if days_until_expiry <= 30:
            return 'Critical'
        elif days_until_expiry <=90:
            return 'Warning'
        return 'Safe'
    
    def validate(self, data):
        if data.get('expiry_date') and data['expiry_date'] < timezone.now().date():
            raise serializers.ValidationError({"expiry_date": "Expiry date must be in the future."})
        sku = data.get('sku')
        hospital_id = self.context['request'].parser_context['kwargs']['hospital_id']
        if sku and InventoryItem.objects.filter(hospital_id=hospital_id, sku=sku).exclude(
            id=self.instance.id if self.instance else None
        ).exists():
            raise serializers.ValidationError({"sku": "SKU must be unique for this hospital."})
        return data
    
    class Meta:
        model = InventoryItem
        fields = [
            'id', 'hospital', 'name', 'category', 'category_id', 'quantity', 'unit', 'unit_id',
            'reorder_level', 'last_updated', 'expiry_date', 'location', 'sku', 'barcode',
            'cost', 'tax', 'supplier', 'batch', 'description', 'qr_code',
            'stock_level', 'expiry_status'
        ]
        read_only_fields = ['hospital', 'id', 'last_updated', 'qr_code', 'stock_level', 'expiry_status']