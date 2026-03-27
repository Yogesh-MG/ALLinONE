from django.contrib import admin
from .models import Resource, Schedule, StaffMember
# Register your models here.

admin.site.register(Resource)
admin.site.register(Schedule)
admin.site.register(StaffMember)
