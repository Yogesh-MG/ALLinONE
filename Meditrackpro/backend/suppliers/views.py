from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Supplier, PurchaseOrder, PurchaseOrderItem
from .serializers import SupplierSerializer, PurchaseOrderSerializer
from hospitals.models import Hospital
from hospitals.permissions import IsInventoryManager
from inventory.models import InventoryItem

class SupplierListView(generics.GenericAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        return Supplier.objects.filter(hospital__id=hospital_id)

    def get(self, request, hospital_id):
        suppliers = self.get_queryset()
        serializer = self.get_serializer(suppliers, many=True)
        return Response(serializer.data)

    def post(self, request, hospital_id):
        try:
            hospital = Hospital.objects.get(id=hospital_id)
        except Hospital.DoesNotExist:
            return Response({"detail": "Hospital not found or unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data, context={'hospital': hospital})
        serializer.is_valid(raise_exception=True)
        supplier = serializer.save()
        return Response(self.get_serializer(supplier).data, status=status.HTTP_201_CREATED)

class SupplierDetailView(generics.GenericAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated, IsInventoryManager]

    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        return Supplier.objects.filter(hospital__id=hospital_id)

    def get_object(self):
        return generics.get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])

    def get(self, request, hospital_id, pk):
        supplier = self.get_object()
        serializer = self.get_serializer(supplier)
        return Response(serializer.data)

    def put(self, request, hospital_id, pk):
        supplier = self.get_object()
        serializer = self.get_serializer(supplier, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        supplier = serializer.save()
        return Response(self.get_serializer(supplier).data)

    def patch(self, request, hospital_id, pk):
        supplier = self.get_object()
        serializer = self.get_serializer(supplier, data=request.data, partial=True)  # Partial update
        serializer.is_valid(raise_exception=True)
        supplier = serializer.save()
        return Response(self.get_serializer(supplier).data) 

    def delete(self, request, hospital_id, pk):
        supplier = self.get_object()
        supplier.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SupplierStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsInventoryManager]

    def get(self, request, hospital_id):
        try:
            hospital = Hospital.objects.get(id=hospital_id)
        except Hospital.DoesNotExist:
            return Response({"detail": "Hospital not found or unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        suppliers = Supplier.objects.filter(hospital=hospital)
        return Response({
            'total': suppliers.count(),
            'active': suppliers.filter(status='Active').count(),
            'on_hold': suppliers.filter(status='OnHold').count(),
            'inactive': suppliers.filter(status='Inactive').count(),
        })

class PurchaseOrderListCreateView(generics.GenericAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        return PurchaseOrder.objects.filter(hospital_id=hospital_id)

    def get(self, request, hospital_id):
        purchase_orders = self.get_queryset()
        serializer = self.get_serializer(purchase_orders, many=True)
        return Response(serializer.data)

    def post(self, request, hospital_id):
        try:
            hospital = Hospital.objects.get(id=hospital_id)
        except Hospital.DoesNotExist:
            return Response({"detail": "Hospital not found or unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['hospital_id'] = hospital_id
        serializer = self.get_serializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        purchase_order = serializer.save()
        return Response(self.get_serializer(purchase_order).data, status=status.HTTP_201_CREATED)

class PurchaseOrderDetailView(generics.GenericAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated, IsInventoryManager]

    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        return PurchaseOrder.objects.filter(hospital_id=hospital_id)

    def get_object(self):
        return generics.get_object_or_404(self.get_queryset(), pk=self.kwargs['id'])

    def get(self, request, hospital_id, id):
        purchase_order = self.get_object()
        serializer = self.get_serializer(purchase_order)
        return Response(serializer.data)

    def patch(self, request, hospital_id, id):
        purchase_order = self.get_object()
        if purchase_order.status == 'RECEIVED':
            return Response(
                {"detail": "Cannot update a received purchase order."},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = request.data.copy()
        data['hospital_id'] = hospital_id
        serializer = self.get_serializer(purchase_order, data=data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        purchase_order = serializer.save()
        return Response(self.get_serializer(purchase_order).data)

    def delete(self, request, hospital_id, id):
        purchase_order = self.get_object()
        if purchase_order.status == 'RECEIVED':
            return Response(
                {"detail": "Cannot delete a received purchase order."},
                status=status.HTTP_400_BAD_REQUEST
            )
        purchase_order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PurchaseOrderStatusChoicesView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, hospital_id):
        try:
            Hospital.objects.get(id=hospital_id)
        except Hospital.DoesNotExist:
            return Response({"detail": "Hospital not found or unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        return Response(dict(PurchaseOrder.STATUS_CHOICES))

class InventoryItemPurchaseHistoryView(generics.GenericAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hospital_id = self.kwargs['hospital_id']
        inventory_item_id = self.kwargs['inventory_item_id']
        return PurchaseOrder.objects.filter(
            hospital_id=hospital_id,
            items__inventory_item_id=inventory_item_id
        ).distinct()

    def get(self, request, hospital_id, inventory_item_id):
        try:
            InventoryItem.objects.get(hospital_id=hospital_id, id=inventory_item_id)
        except InventoryItem.DoesNotExist:
            return Response({"detail": "Inventory item not found"}, status=status.HTTP_404_NOT_FOUND)
        purchase_orders = self.get_queryset()
        serializer = self.get_serializer(purchase_orders, many=True)
        return Response(serializer.data)