from django.urls import path
from .views import RegisterHospitalView, PaymentView, VerifyPaymentView, UserProfileView

urlpatterns = [
    path('register/', RegisterHospitalView.as_view(), name='register_hospital'),
    path('payment/', PaymentView.as_view(), name='payment'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('me/', UserProfileView.as_view(), name='user-profile')
]
