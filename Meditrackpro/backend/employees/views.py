from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Employee
from .serializers import EmployeeSerializer, UserSerializer
from hospitals.models import Hospital
from hospitals.permissions import IsTechnician
# Create your views here.
class EmployeeListView(APIView):
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, hospital_id):
        permission = IsTechnician()
        if not permission.has_permission(request, self): # <-- Correct way to call it
            print('1')
            return Response({'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        
        if hospital_id:
            try:
                hospital = Hospital.objects.get(id=hospital_id)
                if hospital.is_active:
                    if not IsTechnician:
                        return Response({'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
                    employees = Employee.objects.filter(hospital=hospital)
                else:
                    return Response({'message': 'Please renew your account'}, status=status.HTTP_403_FORBIDDEN)
            except Hospital.DoesNotExist:
                return Response({'message': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)
            
        else:
            employees = Employee.objects.all(hospital_isnull=True)
            
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class EmployeeCreateList(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, hospital_id=None):
        if not request.user.is_authenticated or not hasattr(request.user, 'hospitals'):
            return Response({'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        hospital = None
        if hospital_id:
            try:
                hospital = Hospital.objects.get(id=hospital_id)
                if hospital.admin != request.user:
                    return Response({'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
            except Hospital.DoesNotExist:
                return Response({'message': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)
            
        data = request.data
        user_data = {
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'email': data.get('email'),
            'username': data.get('username'),
            'password': data.get('password')
        }

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
        else:
            print(user_serializer.errors)  # Debugging
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
        employee_data = {
            'user': user.id,
            'hospital': hospital.id if hospital else None,
            'role': data.get('role'),
            'department': data.get('department'),
            'phone_number': data.get('phone_number'),
            'access_level': data.get('access_level'),
            'date_of_birth': data.get('date_of_birth'),  # New field
            'employee_id': data.get('employee_id'),  
        }
        
        employee_serializer = EmployeeSerializer(data=employee_data)
        if employee_serializer.is_valid():
            employee = employee_serializer.save()
            return Response(
                {
                    "message": "Employee created successfully",
                    "employee_id": employee.id
                }
                , status=status.HTTP_201_CREATED)
        else:
            user.delete()
            return Response(employee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class EmployeeUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        employee = Employee.objects.get(id=pk)
        if employee.hospital.admin != request.user:
            return Response({'message':'Unauthorized'}, status=403)
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class EmployeeDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk):
        try:
            print("1")
            employee = Employee.objects.get(id=pk,)  # Looking for id=6
            if employee.hospital.admin != request.user:
                return Response({'message': 'Unauthorized'}, status=403)
            employee.delete()
            return Response(status=204)
        except Employee.DoesNotExist:
            return Response({'message': 'Employee not found'}, status=404)