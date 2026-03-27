from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from .models import Hospital, Subscription
from .serializers import HospitalSerializer, UserSerializer
from employees.models import Employee
import razorpay


# Create your views here.
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class RegisterHospitalView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        hospital_data = request.data.get('hospital')
        admin_data = request.data.get('admin')
        
        admin_serializer = UserSerializer(data=admin_data)
        if admin_serializer.is_valid():
            admin_user = admin_serializer.save()
        else:
            return Response(admin_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
        hospital_serializer = HospitalSerializer(data=hospital_data)
        if hospital_serializer.is_valid():
            hospital = hospital_serializer.save(admin=admin_user)
            print(hospital.id)
            return Response(
                {
                "message": "Hospital and Admin registered successfully",
                "hospital": hospital.id,
                "admin": admin_user.id,
                "hospital_name": hospital.name,  # Pass hospital name for billing
                "admin_email": admin_user.email,  # Pass admin email for billing
                "admin_first_name": admin_user.first_name,
                "admin_last_name": admin_user.last_name,
                "gstin": hospital.gstin or ""
                },
                status=status.HTTP_201_CREATED
            )
        else:
            admin_user.delete()
            return Response(hospital_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
class PaymentView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        hospital_id = request.data.get('hospital_id')
        plan = request.data.get('plan')
        payment_method = request.data.get('payment_method')
        hospital_name = request.data.get('hospital_name')
        admin_email = request.data.get('admin_email')
        billing_cycle = request.data.get('billing_cycle')
        amount = request.data.get('amount')
        gstin = request.data.get('gstin')
        
        try:
            hospital = Hospital.objects.get(id=hospital_id)
            hospital.plan = plan
            hospital.payment_method = payment_method
            if gstin:
                hospital.gstin = gstin  # Update GSTIN if provided

            # Base amounts based on billing cycle
            plan_amounts_monthly = {'basic': 4999, 'pro': 9999, 'premium': 19999}
            plan_amounts_yearly = {'basic': 47990, 'pro': 95990, 'premium': 191990}
            base_amount = (
                plan_amounts_monthly[plan] if billing_cycle == 'monthly' 
                else plan_amounts_yearly[plan]
            )
            gst_rate = 0.18  # 18% GST
            gst_amount = base_amount * gst_rate
            total_amount = base_amount + gst_amount

            # Subscription with tax breakdown
            duration = timedelta(days=30) if billing_cycle == 'monthly' else timedelta(days=365)
            subscription = Subscription(
                hospital=hospital,
                plan=plan,
                start_date=timezone.now(),
                end_date=timezone.now() + duration,
                base_amount=base_amount,
                gst_amount=gst_amount,
                total_amount=total_amount,
                payment_status='pending'
            )

            if payment_method == 'prepaid':
                order_data = {
                    'amount': int(total_amount * 100),  # Total incl. GST in paise
                    'currency': 'INR',
                    'receipt': f'hospital_{hospital_id}',
                    'payment_capture': 1,
                    'notes': {
                        'hospital_name': hospital_name,
                        'admin_email': admin_email,
                        'gstin': gstin or hospital.gstin or 'N/A'
                    }
                }
                order = razorpay_client.order.create(data=order_data)
                hospital.save()
                subscription.save()
                return Response({
                    'order_id': order['id'],
                    'amount': order['amount'],
                    'currency': order['currency'],
                    'key_id': settings.RAZORPAY_KEY_ID,
                    'subscription_id': subscription.id,
                    'hospital_name': hospital_name,
                    'admin_email': admin_email,
                    'base_amount': float(base_amount),
                    'gst_amount': float(gst_amount),
                    'total_amount': float(total_amount),
                    'gstin': gstin or hospital.gstin or 'N/A'
                }, status=status.HTTP_200_OK)
            elif payment_method == 'cod':
                hospital.save()
                subscription.save()
                return Response({
                    'message': 'COD selected, payment due on delivery',
                    'hospital_id': hospital_id,
                    'subscription_id': subscription.id,
                    'hospital_name': hospital_name,
                    'admin_email': admin_email,
                    'base_amount': float(base_amount),
                    'gst_amount': float(gst_amount),
                    'total_amount': float(total_amount),
                    'gstin': gstin or hospital.gstin or 'N/A'
                }, status=status.HTTP_200_OK)
            else:  # Direct
                hospital.payment_method = 'direct'
                hospital.save()
                subscription.save()
                return Response({
                    'message': 'Direct payment selected, please pay within 7 days',
                    'hospital_id': hospital_id,
                    'subscription_id': subscription.id,
                    'base_amount': float(base_amount),
                    'gst_amount': float(gst_amount),
                    'total_amount': float(total_amount),
                    'hospital_name': hospital_name,
                    'admin_email': admin_email,
                    'gstin': gstin or hospital.gstin or 'N/A'
                }, status=status.HTTP_200_OK)
        except Hospital.DoesNotExist:
            return Response({'error': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)
        
class VerifyPaymentView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        subscription_id = request.data.get('subscription_id')
        payment_status = request.data.get('payment_status')

        try:
            subscription = Subscription.objects.get(id=subscription_id)
            subscription.payment_status = payment_status
            if payment_status == 'paid':
                subscription.hospital.is_active = True
            subscription.save()
            return Response({'message': 'Payment status updated'}, status=status.HTTP_200_OK)
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found'}, status=status.HTTP_404_NOT_FOUND)
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "full_name": user.get_full_name() or user.username,
            "role": None,
            "type": None,
            "hospital": None,  # Match UserData interface
            "hospital_name": None,
            "subscription": None,
            "emp_id": None,
        }

        # Check if user is an admin (linked to a Hospital)
        try:
            hospital = Hospital.objects.get(admin=user)
            data["type"] = "admin"
            data["role"] = "Admin"
            data["hospital_name"] = hospital.name
            data["hospital"] = hospital.id  # Use "hospital" key
            subscription = Subscription.objects.filter(hospital=hospital).first()
            if subscription:
                data["subscription"] = {
                    "plan": subscription.plan,
                    "end_date": subscription.end_date.isoformat(),
                    "payment_status": subscription.payment_status,
                }
            print(f"Admin user: hospital={hospital.id}")  # Debug
        except Hospital.DoesNotExist:
            # Check if user is an employee
            try:
                employee = Employee.objects.get(user=user)
                data["type"] = "employee"
                data["role"] = employee.role
                data["hospital_name"] = employee.hospital.name if employee.hospital else None
                data["hospital"] = employee.hospital.id if employee.hospital else None  # Fix: Use employee.hospital
                data["employee_id"] = employee.employee_id
                subscription = Subscription.objects.filter(hospital=employee.hospital).first()
                if subscription:
                    data["subscription"] = {
                        "plan": subscription.plan,
                        "end_date": subscription.end_date.isoformat(),
                        "payment_status": subscription.payment_status,
                    }
                print(f"Employee user: hospital={employee.hospital_id}")  # Debug
            except Employee.DoesNotExist:
                # Default to basic user
                data["type"] = "user"
                data["role"] = "User"
                print("Basic user: no hospital")  # Debug

        return Response(data, status=status.HTTP_200_OK)