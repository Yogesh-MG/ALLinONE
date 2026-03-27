from django.urls import path
from .views import (
    InventoryItemListCreateView,
    InventoryItemDetailView,
    InventoryBulkActionView,
    InventoryExportView,
    CategoryListView,
    UnitListView,
    InventoryCheckView,
)

urlpatterns = [
    path('<int:hospital_id>/inventory/', InventoryItemListCreateView.as_view(), name='inventory-list-create'),
    path('<int:hospital_id>/inventory/<int:id>/', InventoryItemDetailView.as_view(), name='inventory-detail'),
    path('<int:hospital_id>/inventory/bulk/', InventoryBulkActionView.as_view(), name='inventory-bulk'),
    path('<int:hospital_id>/inventory/export/', InventoryExportView.as_view(), name='inventory-export'),
    path('<int:hospital_id>/categories/', CategoryListView.as_view(), name='category-list'),
    path('<int:hospital_id>/units/', UnitListView.as_view(), name='unit-list'),
    path('<int:hospital_id>/inventory/check/', InventoryCheckView.as_view(), name='inventory-check'),
]