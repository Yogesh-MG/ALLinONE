# python manage.py shell
from inventory.models import Category, Unit, InventoryItem
from hospitals.models import Hospital
from django.utils import timezone
from datetime import date

hospital = Hospital.objects.get(id=1)  # Adjust ID
# Categories
categories = ['Disposables', 'Pharmaceuticals', 'Devices', 'Wound Care', 'Respiratory']
for name in categories:
    Category.objects.get_or_create(hospital=hospital, name=name)
# Units
units = ['pieces', 'pairs', 'tablets', 'units', 'packs']
for name in units:
    Unit.objects.get_or_create(hospital=hospital, name=name)
# Sample items
items = [
    {
        'name': 'Surgical Masks', 'category': 'Disposables', 'quantity': 2350, 'unit': 'pieces',
        'reorder_level': 500, 'expiry_date': date(2024, 6, 1), 'location': 'Main Storage A3',
        'sku': 'INV001', 'cost': 0.10, 'selling': 0.20
    },
    {
        'name': 'Ibuprofen 400mg', 'category': 'Pharmaceuticals', 'quantity': 520, 'unit': 'tablets',
        'reorder_level': 200, 'expiry_date': date(2023, 12, 20), 'location': 'Pharmacy Storage B2',
        'sku': 'INV003', 'cost': 0.05, 'selling': 0.15
    },
]
for item in items:
    category = Category.objects.get(hospital=hospital, name=item['category'])
    unit = Unit.objects.get(hospital=hospital, name=item['unit'])
    InventoryItem.objects.create(
        hospital=hospital, name=item['name'], category=category, quantity=item['quantity'],
        unit=unit, reorder_level=item['reorder_level'], expiry_date=item['expiry_date'],
        location=item['location'], sku=item['sku'], cost=item['cost'], selling=item['selling']
    )