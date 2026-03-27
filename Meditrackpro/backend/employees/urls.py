from django.urls import path
from .views import EmployeeListView, EmployeeCreateList, EmployeeDeleteView, EmployeeUpdateView


urlpatterns = [
    path('hospitals/<int:hospital_id>/employees/', EmployeeListView.as_view(), name='employee-list'),
    path('hospitals/<int:hospital_id>/employees/create/', EmployeeCreateList.as_view(), name='employee-create'),
    path('employees/<int:pk>/update/', EmployeeUpdateView.as_view(), name='employee_update'),
    path('employees/<int:pk>/delete/', EmployeeDeleteView.as_view(), name='employee_delete'),
]
