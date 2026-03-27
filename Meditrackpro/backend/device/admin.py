from django.contrib import admin
from .models import Device, ServiceLog, Calibration, IncidentReport, Specification
# Register your models here.

models = [Device, ServiceLog, Specification, Calibration, IncidentReport]
for i in range(len(models)):
    admin.site.register(models[i])
