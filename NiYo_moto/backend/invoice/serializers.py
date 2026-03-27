from rest_framework import serializers
from .models import IncomingGood, Quotation, QuotationItem, Invoice, Supplier, InvoiceItem, Motor


class IncomingGoodSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = IncomingGood
        fields = '__all__'

class QuotationItemSerializer(serializers.ModelSerializer):
    # Explicitly define 'id' as not read-only so it can be passed in validated_data for updates
    id = serializers.IntegerField(required=False)

    class Meta:
        model = QuotationItem
        fields = ['id', 'sl_no', 'description', 'price']

class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_address = serializers.CharField(source='customer.address', read_only=True)
    customer_mail = serializers.CharField(source='customer.email', read_only=True)
    customer_gst = serializers.CharField(source='customer.gstin', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone_number', read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Quotation
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        quotation = Quotation.objects.create(**validated_data)
        for item_data in items_data:
            QuotationItem.objects.create(quotation=quotation, **item_data)
        return quotation

    def update(self, instance, validated_data):
        # 1. Update main Quotation fields
        items_data = validated_data.pop('items')
        
        instance.quotation_id = validated_data.get('quotation_id', instance.quotation_id)
        instance.customer = validated_data.get('customer', instance.customer)
        instance.date = validated_data.get('date', instance.date)
        instance.gst_applied = validated_data.get('gst_applied', instance.gst_applied)
        instance.gst_rate = validated_data.get('gst_rate', instance.gst_rate)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        # 2. Handle Nested Items
        keep_ids = []
        for item_data in items_data:
            if 'id' in item_data:
                # Update existing item if it belongs to this quotation
                if QuotationItem.objects.filter(id=item_data['id'], quotation=instance).exists():
                    item = QuotationItem.objects.get(id=item_data['id'], quotation=instance)
                    item.sl_no = item_data.get('sl_no', item.sl_no)
                    item.description = item_data.get('description', item.description)
                    item.price = item_data.get('price', item.price)
                    item.save()
                    keep_ids.append(item.id)
                else:
                    # Ignore IDs that don't belong to this instance (security check)
                    continue
            else:
                # Create new item (no ID provided)
                item = QuotationItem.objects.create(quotation=instance, **item_data)
                keep_ids.append(item.id)

        # 3. Delete items that are no longer in the list
        # Any item belonging to this quotation that is NOT in 'keep_ids' should be deleted
        instance.items.exclude(id__in=keep_ids).delete()

        return instance

class InvoiceItemSerializer(serializers.ModelSerializer):
    # Allow ID to be writable for updates
    id = serializers.IntegerField(required=False)

    class Meta:
        model = InvoiceItem
        fields = ['id', 'sl_no', 'description', 'quantity', 'rate', 'price']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_address = serializers.CharField(source='customer.address', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    customer_gst = serializers.CharField(source='customer.gstin', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone_number', read_only=True)
    class Meta:
        model = Invoice
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items')
        
        # 1. Update main Invoice fields
        instance.customer = validated_data.get('customer', instance.customer)
        instance.date = validated_data.get('date', instance.date)
        instance.status = validated_data.get('status', instance.status)
        instance.final_amount = validated_data.get('final_amount', instance.final_amount)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.gst_applied = validated_data.get('gst_applied', instance.gst_applied)
        instance.gst_rate = validated_data.get('gst_rate', instance.gst_rate)
        instance.save()

        # 2. Handle Nested Items
        keep_ids = []
        for item_data in items_data:
            if 'id' in item_data:
                # Update existing item
                if InvoiceItem.objects.filter(id=item_data['id'], invoice=instance).exists():
                    item = InvoiceItem.objects.get(id=item_data['id'], invoice=instance)
                    item.sl_no = item_data.get('sl_no', item.sl_no)
                    item.description = item_data.get('description', item.description)
                    item.quantity = item_data.get('quantity', item.quantity)
                    item.rate = item_data.get('rate', item.rate)
                    item.price = item_data.get('price', item.price)
                    item.save()
                    keep_ids.append(item.id)
            else:
                # Create new item
                item = InvoiceItem.objects.create(invoice=instance, **item_data)
                keep_ids.append(item.id)

        # 3. Delete items that were removed in the frontend
        instance.items.exclude(id__in=keep_ids).delete()

        return instance

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class MotorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Motor
        fields = '__all__'