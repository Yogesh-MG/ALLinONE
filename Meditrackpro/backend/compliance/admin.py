from django.contrib import admin
from .models import ComplianceDocument, ComplianceStandard, Audit

# Register your models here.
admin.site.register(ComplianceDocument)
admin.site.register(ComplianceStandard)
admin.site.register(Audit)