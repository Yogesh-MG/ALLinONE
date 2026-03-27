from django.contrib import admin
from .models import GymSettings, MembershipPlan, Class, Member
# Register your models here.
admin.site.register(GymSettings)
admin.site.register(MembershipPlan)
admin.site.register(Class)
admin.site.register(Member )