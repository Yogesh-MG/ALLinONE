from django.urls import path, include
from .views import CustomerViewset
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'customer', CustomerViewset)

urlpatterns = [
    path('', include(router.urls)),
]
