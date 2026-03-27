from django.contrib import admin
from .models import Invoice, SalesDeal
# Register your models here.

admin.site.register(Invoice)
admin.site.register(SalesDeal)