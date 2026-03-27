from rest_framework import serializers
from .models import Invoice, SalesDeal
from gymnast.models import Member

class InvoiceSerializer(serializers.ModelSerializer):
    member = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all())
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_id', 'member', 'amount', 'status', 'plan', 'issue_date']

    def get_member(self, obj):
        return f"{obj.member.user.name}"

class SalesDealSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesDeal
        fields = ['id', 'deal_id', 'prospect', 'value', 'stage', 'probability', 'close_date']