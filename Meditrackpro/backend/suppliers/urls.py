from django.urls import path
from .views import (
    SupplierListView, SupplierDetailView, SupplierStatsView,
    PurchaseOrderListCreateView, PurchaseOrderDetailView, PurchaseOrderStatusChoicesView, InventoryItemPurchaseHistoryView,
)

urlpatterns = [
    path('<int:hospital_id>/purchase-orders/', PurchaseOrderListCreateView.as_view(), name='purchase-order-list-create'),
    path('<int:hospital_id>/purchase-orders/<int:id>/', PurchaseOrderDetailView.as_view(), name='purchase-order-detail'),
    path('<int:hospital_id>/purchase-orders/status_choices/', PurchaseOrderStatusChoicesView.as_view(), name='status-choices'),
    path('<int:hospital_id>/suppliers/', SupplierListView.as_view(), name='supplier-list-create'),
    path('<int:hospital_id>/inventory/<int:inventory_item_id>/purchase-history/', InventoryItemPurchaseHistoryView.as_view(), name='inventory-purchase-history'),
    path('<int:hospital_id>/suppliers/<int:pk>/', SupplierDetailView.as_view(), name='supplier-detail'),
    path('<int:hospital_id>/suppliers/stats/', SupplierStatsView.as_view(), name='supplier-stats'),
]