from django.db import models

# Create your models here.

class CustomerModel(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False)
    phone_number = models.CharField(max_length=15, unique=True, blank=False)
    gstin = models.CharField(max_length=15, unique=True, blank=True)
    address = models.TextField(blank=True)
    email = models.EmailField(max_length=255, unique=True, blank=True)
    company_name = models.CharField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name 