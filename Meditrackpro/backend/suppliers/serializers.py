from rest_framework import serializers
from .models import Supplier, PurchaseOrder, PurchaseOrderItem
from inventory.models import Category, InventoryItem
from inventory.serializers import InventoryItemSerializer
from hospitals.models import Hospital
from django.utils import timezone
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class SupplierSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Supplier
        fields = [
            'id', 'name', 'contact_name', 'contact_email', 'contact_phone', 'address',
            'categories', 'category_ids', 'reliability_score', 'status', 'tax_id',
            'website', 'supplier_type', 'payment_terms', 'currency', 'approved',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        hospital = self.context['hospital']  # Passed from view
        supplier = Supplier.objects.create(hospital=hospital, **validated_data)
        if category_ids:
            supplier.categories.set(category_ids)
        return supplier

    def update(self, instance, validated_data):
        category_ids = validated_data.pop('category_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if category_ids is not None:
            instance.categories.set(category_ids)
        return instance

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    inventory_item = serializers.PrimaryKeyRelatedField(queryset=InventoryItem.objects.all())
    inventory_item_details = InventoryItemSerializer(source='inventory_item', read_only=True)

    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'inventory_item', 'inventory_item_details', 'quantity', 'unit_price', 'received_quantity']

    def validate(self, data):
        if data.get('received_quantity', 0) > data.get('quantity', 0):
            raise serializers.ValidationError({"received_quantity": "Cannot exceed ordered quantity."})
        return data

class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer(read_only=True)
    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(), source='supplier', write_only=True, allow_null=True
    )
    items = PurchaseOrderItemSerializer(many=True)
    hospital_id = serializers.CharField(write_only=True, required=False)
    total_cost = serializers.FloatField(allow_null=True)
    
    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'hospital', 'po_number', 'supplier', 'supplier_id', 'status', 'order_date',
            'expected_delivery', 'total_cost', 'notes', 'items', 'hospital_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['hospital', 'po_number', 'total_cost', 'created_at', 'updated_at']

    def validate(self, data):
        hospital_id = data.get('hospital_id') or self.context['request'].parser_context['kwargs']['hospital_id']
        if not Hospital.objects.get(id=hospital_id):
            raise serializers.ValidationError({"hospital_id": "Invalid hospital ID."})

        if data.get('status') == 'RECEIVED' and not all(
            item.get('received_quantity', 0) == item.get('quantity', 0) for item in data.get('items', [])
        ):
            raise serializers.ValidationError({"status": "All items must be fully received to mark as RECEIVED."})

        items = data.get('items', [])
        if not items:
            raise serializers.ValidationError({"items": "At least one item is required."})

        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        hospital_id = validated_data.pop('hospital_id', self.context['request'].parser_context['kwargs']['hospital_id'])
        hospital = Hospital.objects.get(id=hospital_id)
        purchase_order = PurchaseOrder.objects.create(hospital=hospital, **validated_data)
        for item_data in items_data:
            PurchaseOrderItem.objects.create(purchase_order=purchase_order, **item_data)
        purchase_order.update_total_cost()
        return purchase_order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        hospital_id = validated_data.pop('hospital_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data:
            existing_item_ids = {item.id: item for item in instance.items.all()}
            for item_data in items_data:
                item_id = item_data.get('id')
                if item_id and item_id in existing_item_ids:
                    item = existing_item_ids.pop(item_id)
                    for attr, value in item_data.items():
                        setattr(item, attr, value)
                    item.save()
                else:
                    PurchaseOrderItem.objects.create(purchase_order=instance, **item_data)
            for item in existing_item_ids.values():
                item.delete()

        if instance.status == 'RECEIVED':
            for item in instance.items.all():
                inventory_item = item.inventory_item
                inventory_item.quantity += item.received_quantity
                inventory_item.supplier = instance.supplier
                inventory_item.save()

        instance.update_total_cost()
        return instance