from django.urls import path
from .views import PneumoniaTestView, BrainTumorTestView, CloudAnalysis

urlpatterns = [
    path("ml/pneumonia/", PneumoniaTestView.as_view(), name="pneumonia-test"),
    path("ml/braintumor/", BrainTumorTestView.as_view(), name="brian-tumor"),
    path("ml/cloud/", CloudAnalysis.as_view(), name="cloud-analysis"),
] 