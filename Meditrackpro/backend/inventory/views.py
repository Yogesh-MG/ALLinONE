from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from hospitals.models import Hospital
from .models import InventoryItem, Category, Unit
from .serializers import InventoryItemSerializer, CategorySerializer, UnitSerializer
from hospitals.permissions import IsInventoryManager
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from django.db.models import Q, F
import csv
from django.http import HttpResponse
from datetime import datetime, timedelta
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 50
    
class InventoryItemListCreateView(generics.ListCreateAPIView):
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['category__id', 'location']
    ordering_fields = ['id', 'name', 'quantity', 'expiry_date', 'location']
    ordering = ['id']
    search_fields = ['name', 'sku', 'location']
    pagination_class =StandardResultsSetPagination
    
    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        queryset = InventoryItem.objects.filter(hospital_id=hospital_id)
        stock_level = self.request.query_params.get('stock_level')
        expiry_soon = self.request.query_params.get('expiry_soon')
        if stock_level:
            if stock_level == 'Low':
                queryset = queryset.filter(quantity__lte=F('reorder_level'))
            elif stock_level == 'Medium':
                queryset = queryset.filter(quantity__lte=F('reorder_level') * 2, quantity__gt=F('reorder_level'))
            elif stock_level == 'High':
                queryset = queryset.filter(quantity__gt=F('reorder_level') * 2)
        if expiry_soon:
            cutoff = datetime.now().date() + timedelta(days=int(expiry_soon))
            queryset = queryset.filter(expiry_date__lte=cutoff, expiry_date__isnull=False)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(hospital_id=self.kwargs['hospital_id'])
        
        
class InventoryItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        return InventoryItem.objects.filter(hospital_id=self.kwargs['hospital_id'])
    
class InventoryBulkActionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInventoryManager]
    
    def patch(self, request, hospital_id):
        items_ids = request.data.get('item_ids', [])
        action = request.data.get('action')
        items = InventoryItem.objects.filter(hospital_id=hospital_id, id__in=items_ids)
        if not items:
            return Response({"error": "No items selected"}, status=status.HTTP_400_BAD_REQUEST)
        if action == 'delete':
            items.delete()
            return Response({"message": "Items deleted"}, status=status.HTTP_200_OK)
        elif action == 'update_quantity':
            quantity_changes = request.data.get('quantity_changes', {})
            for item in items:
                new_quantity = quantity_changes.get(str(item.id))
                if new_quantity is not None and int(new_quantity) >= 0:
                    item.quantity = int(new_quantity)
                    item.save()
            return Response({"message": "Quantities updated"}, status=status.HTTP_200_OK)
        elif action == 'generate_qr':
            for item in items:
                if item.qr_code:
                    item.qr_code.delete()
                item.generate_qr_code()
                item.save()
            return Response({"message": "QR codes generated"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
    
class InventoryExportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, hospital_id):
        items = InventoryItem.objects.filter(hospital_id=hospital_id)
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="inventory_export_{hospital_id}.csv"'
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Name', 'Category', 'Quantity', 'Unit', 'Stock Level', 'Expiry Date',
            'Location', 'SKU', 'Barcode', 'Cost', 'Tax', 'Supplier', 'Batch'
        ])
        for item in items:
            stock_level = (
                'Low' if item.quantity <= item.reorder_level else
                'Medium' if item.quantity <= item.reorder_level * 2 else 'High'
            )
            writer.writerow([
                item.id,
                item.name,
                item.category.name if item.category else '',
                item.quantity,
                item.unit.name if item.unit else '',
                stock_level,
                item.expiry_date or 'N/A',
                item.location,
                item.sku,
                item.barcode,
                item.cost,
                item.tax,
                item.supplier,
                item.batch
            ])
        return response

class CategoryListView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(hospital_id=self.kwargs['hospital_id'])

    def perform_create(self, serializer):
        hospital = Hospital.objects.get(id=self.kwargs['hospital_id'])
        serializer.save(hospital=hospital)

class UnitListView(generics.ListCreateAPIView):
    serializer_class = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Unit.objects.filter(hospital_id=self.kwargs['hospital_id'])
    
    def perform_create(self, serializer):
        hospital = Hospital.objects.get(id=self.kwargs['hospital_id'])
        serializer.save(hospital=hospital)

class InventoryCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, hospital_id):
        sku = request.query_params.get('sku')
        if not sku:
            return Response({"error": "SKU required"}, status=status.HTTP_400_BAD_REQUEST)
        exists = InventoryItem.objects.filter(hospital_id=hospital_id, sku=sku).exists()
        return Response({"exists": exists}, status=status.HTTP_200_OK)