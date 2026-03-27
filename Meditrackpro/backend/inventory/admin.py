from django.contrib import admin
from .models import Category, Unit, InventoryItem
# Register your models here.

admin.site.register(Category)
admin.site.register(Unit)
admin.site.register(InventoryItem)