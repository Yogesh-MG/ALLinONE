from django.contrib import admin
from .models import Employee
# Register your models here.

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'hospital', 'role', 'department', 'phone_number', 'access_level', 'status', 'date_of_birth', 'employee_id')
    search_fields = ('user__username', 'hospital__name', 'role', 'department', 'employee_id')
    list_filter = ('hospital', 'role', 'department', 'access_level', 'status')