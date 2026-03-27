from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('hospitals.urls')),
    path('api/', include('employees.urls')),
    path('api/', include('device.urls')),
    path('api/', include('inventory.urls')),
    path('api/', include('suppliers.urls')),
    path('api/', include('tickets.urls')),
    path('api/', include('compliance.urls')),
    path('api/', include('patient.urls')),
    path('api/', include('ml_test.urls')),
    path('api/', include('dashboard.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]   + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
