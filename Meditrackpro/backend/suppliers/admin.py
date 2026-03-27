from django.contrib import admin
from .models import PurchaseOrder, PurchaseOrderItem, Supplier
# Register your models here.

admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderItem)
admin.site.register(Supplier)