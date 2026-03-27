from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, BookIssue, Books, Student, Teacher
from django.utils.translation import gettext_lazy as _
import csv
from django.http import HttpResponse

def export_to_csv(modeladmin, request, queryset):
    """
    Custom admin action to export selected records to a CSV file.
    """
    # Get model fields dynamically
    field_names = [field.name for field in modeladmin.model._meta.fields]

    # Create the HTTP response for the CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename={modeladmin.model._meta.model_name}_export.csv'

    # Write the CSV
    writer = csv.writer(response)
    writer.writerow(field_names)  # Write header row
    for obj in queryset:
        row = [getattr(obj, field) for field in field_names]
        writer.writerow(row)

    return response

export_to_csv.short_description = "Export selected items to CSV"

# Register your models here.

class BookIssueAdmin(admin.ModelAdmin):
    # Specify the fields to include in the search
    search_fields = ['user__username', 'book__name', 'book__book_id']


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_student', 'is_teacher', 'books_taken','is_staff', 'date_joined')
    list_filter = ('is_student', 'is_teacher', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    actions = [export_to_csv]
    
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'USN', 'phone')
    list_filter = ('USN',)
    search_fields = ('user__username', 'USN', 'phone')
    actions = [export_to_csv]
    
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('user', 'teacher_id')
    list_filter = ('teacher_id',)
    search_fields = ('user__username', 'teacher_id')
    actions = [export_to_csv]

class BooksAdmin(admin.ModelAdmin):
    list_display = ('book_id', 'name', 'version', 'number_of_copies', 'copies_available')
    list_filter = ('version',)
    search_fields = ('book_id', 'name')
    actions = [export_to_csv] 
    

admin.site.register(BookIssue, BookIssueAdmin)
admin.site.register(Books, BooksAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(CustomUser, CustomUserAdmin)