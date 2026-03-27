from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from hospitals.models import Hospital
from inventory.models import InventoryItem, Category
from device.models import Device, ServiceLog, Calibration
from suppliers.models import Supplier
from tickets.models import Ticket
from django.db.models import Count, F, Q
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncMonth

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, hospital_id):
        # Ensure the hospital exists
        try:
            hospital = Hospital.objects.get(id=hospital_id)
        except Hospital.DoesNotExist:
            return Response({"error": "Hospital not found"}, status=404)

        # --- 1. Metric Cards Data ---
        
        # Calculate start of the "previous month" for trend comparison
        today = timezone.now().date()
        first_day_current_month = today.replace(day=1)
        last_day_prev_month = first_day_current_month - timedelta(days=1)
        first_day_prev_month = last_day_prev_month.replace(day=1)

        total_inventory = InventoryItem.objects.filter(hospital=hospital).count()
        devices_maint = Device.objects.filter(hospital=hospital, is_active='Under_Maintenance').count()
        low_stock = InventoryItem.objects.filter(hospital=hospital, quantity__lte=F('reorder_level')).count()
        active_suppliers = Supplier.objects.filter(hospital=hospital, status='Active').count()

        # Bonus: Calculate % change (this is a simple way)
        # We compare current count vs. count at the start of the month
        # A more robust way involves data warehousing or daily snapshots
        prev_low_stock = InventoryItem.objects.filter(
            hospital=hospital, 
            quantity__lte=F('reorder_level'),
            last_updated__lt=first_day_current_month
        ).count()

        metrics = {
            "total_inventory_items": total_inventory,
            "devices_under_maintenance": devices_maint,
            "low_stock_alerts": low_stock,
            "active_suppliers": active_suppliers,
            "trends": {
                # Trend logic is simplified here. You can expand this.
                "low_stock_change": low_stock - prev_low_stock 
            }
        }

        # --- 2. Alerts & Notifications ---
        alerts = []
        
        # Low Stock Alerts
        low_stock_items = InventoryItem.objects.filter(
            hospital=hospital, 
            quantity__lte=F('reorder_level')
        ).order_by('-last_updated')[:3]
        for item in low_stock_items:
            alerts.append({
                "id": f"inv-{item.id}", "type": "inventory", "priority": "high",
                "title": "Low stock alert",
                "description": f"{item.name} is running low ({item.quantity} remaining)",
                "time": item.last_updated.isoformat()
            })

        # Calibration Due Alerts
        calibration_due = Device.objects.filter(
            hospital=hospital,
            next_calibration__lte=today + timedelta(days=30), # Due in next 30 days
            next_calibration__gte=today
        ).order_by('next_calibration')[:3]
        for device in calibration_due:
            alerts.append({
                "id": f"dev-{device.id}", "type": "device", "priority": "medium",
                "title": "Calibration due",
                "description": f"{device.make_model} (SN: {device.serial_number}) requires calibration",
                "time": device.next_calibration.isoformat()
            })

        # --- 3. Upcoming Maintenance ---
        upcoming_maintenance = []
        upcoming_cal = Calibration.objects.filter(
            device__hospital=hospital, status='scheduled', calibration_date__gte=today
        ).select_related('device').order_by('calibration_date')[:3]
        
        for cal in upcoming_cal:
            upcoming_maintenance.append({
                "id": f"cal-{cal.id}",
                "device": cal.device.make_model,
                "type": "Calibration",
                "date": cal.calibration_date.isoformat(),
                "status": "scheduled"
            })
        
        # You can merge ServiceLog query here too
        # ...

        # --- 4. Inventory Categories ---
        category_data = []
        total_item_count = InventoryItem.objects.filter(hospital=hospital).count()
        if total_item_count > 0:
            categories = Category.objects.filter(hospital=hospital).annotate(
                item_count=Count('items')
            ).filter(item_count__gt=0).order_by('-item_count')
            
            for cat in categories:
                category_data.append({
                    "name": cat.name,
                    "percentage": round((cat.item_count / total_item_count) * 100, 1)
                })

        # --- 5. Charts (Inventory & Maintenance) ---
        # We group by month. This is a powerful Django query!
        inventory_chart = InventoryItem.objects.filter(hospital=hospital) \
            .annotate(month=TruncMonth('last_updated')) \
            .values('month') \
            .annotate(value=Count('id')) \
            .order_by('month')
            
        maintenance_chart = ServiceLog.objects.filter(device__hospital=hospital, status='completed') \
            .annotate(month=TruncMonth('service_date')) \
            .values('month') \
            .annotate(value=Count('id')) \
            .order_by('month')

        charts = {
            "inventory_overview": [
                {"name": item['month'].strftime('%b'), "value": item['value']} for item in inventory_chart
            ],
            "maintenance_overview": [
                {"name": item['month'].strftime('%b'), "value": item['value']} for item in maintenance_chart
            ]
        }

        # --- 6. Recent Activity ---
        # Let's combine completed Service Logs and new Tickets
        recent_activity = []
        completed_logs = ServiceLog.objects.filter(
            device__hospital=hospital, status='completed'
        ).select_related('engineer__user', 'device').order_by('-service_date')[:5]

        for log in completed_logs:
            recent_activity.append({
                "id": f"log-{log.id}",
                "user": log.engineer.user.get_full_name() if log.engineer else "System",
                "action": "completed maintenance on",
                "item": log.device.make_model,
                "time": log.service_date.isoformat()
            })
        
        # Sort by time (if you combine multiple sources)
        recent_activity.sort(key=lambda x: x['time'], reverse=True)


        # --- Final JSON Response ---
        payload = {
            "metrics": metrics,
            "alerts": sorted(alerts, key=lambda x: x['time'], reverse=True),
            "upcoming_maintenance": upcoming_maintenance,
            "inventory_categories": category_data,
            "charts": charts,
            "recent_activity": recent_activity,
        }
        
        return Response(payload)