from django.urls import path
from .views import InvoiceListCreateView, SalesDealListCreateView, FinancialSummaryView

urlpatterns = [
    path('invoices/', InvoiceListCreateView.as_view(), name='invoice_list_create'),
    path('deals/', SalesDealListCreateView.as_view(), name='sales_deal_list_create'),
    path('financial-summary/', FinancialSummaryView.as_view(), name='financial_summary'),
]