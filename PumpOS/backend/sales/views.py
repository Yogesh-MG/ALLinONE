from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count, Q  # Import Q
from datetime import timedelta
from .models import Invoice, SalesDeal
from .serializers import InvoiceSerializer, SalesDealSerializer

class InvoiceListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related('member')
        search = self.request.query_params.get('search', '')
        status = self.request.query_params.get('status', 'all')
        if search:
            queryset = queryset.filter(
                Q(invoice_id__icontains=search) |
                Q(member__user__first_name__icontains=search) |
                Q(member__user__last_name__icontains=search)
            )
        if status != 'all':
            queryset = queryset.filter(status=status)
        return queryset.order_by('-issue_date')[:10]  # Limit to 10 recent invoices

class SalesDealListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SalesDeal.objects.all()
    serializer_class = SalesDealSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.order_by('-close_date')[:10]  # Limit to 10 recent deals

class FinancialSummaryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvoiceSerializer  # Not directly used, but required by ListAPIView

    def list(self, request, *args, **kwargs):
        today = timezone.now().date()
        last_month = today - timedelta(days=30)
        invoices = Invoice.objects.filter(issue_date__gte=last_month)
        paid_invoices = invoices.filter(status='paid')
        total_revenue = paid_invoices.aggregate(total=Sum('amount'))['total'] or 0
        outstanding_invoices = invoices.exclude(status='paid').aggregate(total=Sum('amount'))['total'] or 0
        payment_success_rate = (paid_invoices.count() / invoices.count() * 100) if invoices.count() > 0 else 0

        # Placeholder for average deal size (based on closed-won deals)
        closed_deals = SalesDeal.objects.filter(stage='closed-won', close_date__gte=last_month)
        avg_deal_size = closed_deals.aggregate(avg=Sum('value'))['avg'] / closed_deals.count() if closed_deals.count() > 0 else 0

        kpi_data = [
            {
                'title': 'Monthly Revenue',
                'value': f"${total_revenue:,.2f}",
                'change': '+12.5%',  # Placeholder, calculate dynamically if needed
                'icon': 'DollarSign',
                'trend': 'up'
            },
            {
                'title': 'Outstanding Invoices',
                'value': f"${outstanding_invoices:,.2f}",
                'change': '-3.2%',  # Placeholder
                'icon': 'FileText',
                'trend': 'down'
            },
            {
                'title': 'Payment Success Rate',
                'value': f"{payment_success_rate:.1f}%",
                'change': '+2.1%',  # Placeholder
                'icon': 'CreditCard',
                'trend': 'up'
            },
            {
                'title': 'Average Deal Size',
                'value': f"${avg_deal_size:,.2f}",
                'change': '+8.7%',  # Placeholder
                'icon': 'TrendingUp',
                'trend': 'up'
            }
        ]
        return Response(kpi_data)