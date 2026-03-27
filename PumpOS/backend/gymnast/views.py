from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from django.db.models import Count
from .models import GymSettings, MembershipPlan, Member, Class, Activity, Booking, Achievement, Message
from .serializers import (
    GymSettingsSerializer, MembershipPlanSerializer, MemberSerializer,
    ClassSerializer,
    ActivitySerializer, BookingSerializer, AchievementSerializer, MessageSerializer
)
from facenet_pytorch import MTCNN, InceptionResnetV1
from django.db.models.functions import Cast
from django.db.models import FloatField
from django.db.models import Count, Avg, Max, Min
from django.utils import timezone
from datetime import timedelta
from django.utils.dateparse import parse_date
import datetime
import cv2
import numpy as np
import random
import base64
import json
from io import BytesIO
from PIL import Image
import torch
from ultralytics import YOLO
from django.contrib.auth import get_user_model

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })

class GymSettingsView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GymSettingsSerializer

    def get_object(self):
        obj, created = GymSettings.objects.get_or_create(id=1)
        return obj

class MembershipPlanListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer

class MembershipPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer

class ClassListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

class MemberListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

class MemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

class SaveFaceEmbeddingView(APIView):
    permission_classes = [IsAuthenticated]

    def __init__(self):
        super().__init__()
        self.mtcnn = MTCNN(image_size=160, margin=0)  # Face detection
        self.resnet = InceptionResnetV1(pretrained='vggface2').eval()  # Embedding model

    def post(self, request):
        try:
            member_id = request.data.get('member_id')
            image_data = request.data.get('image', '')

            if not member_id or not image_data:
                return Response({'error': 'Member ID and image required'}, status=400)

            # Decode base64 image
            image_bytes = base64.b64decode(image_data.split(',')[1])
            image = Image.open(BytesIO(image_bytes))
            img_rgb = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

            # Detect face with MTCNN
            face = self.mtcnn.detect(img_rgb)
            if face is None:
                return Response({'error': 'No face detected in image'}, status=400)

            # Extract embedding with InceptionResNetV1
            embedding = self.resnet(face[0])  # Returns tensor; convert to list
            embedding_list = embedding.detach().numpy().flatten().tolist()

            # Save to Member model
            member = Member.objects.get(id=member_id)
            member.face_embedding = embedding_list
            member.save()

            serializer = MemberSerializer(member)
            return Response({
                'message': 'Face embedding saved successfully',
                'member': serializer.data
            })
        except Member.DoesNotExist:
            return Response({'error': 'Member not found'}, status=404)
        except Exception as e:
            return Response({'error': f'Failed to extract embedding: {str(e)}'}, status=500)

class MembershipStatsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        stats = Member.objects.values('membership_plan__name').annotate(count=Count('id'))
        result = [
            {
                'type': stat['membership_plan__name'] or 'None',
                'count': stat['count'],
                'color': 'bg-primary' if stat['membership_plan__name'] == 'Premium' else
                         'bg-accent' if stat['membership_plan__name'] == 'Basic' else
                         'bg-success' if stat['membership_plan__name'] == 'Student' else
                         'bg-warning'
            }
            for stat in stats
        ]
        return Response(result)

class ActivityListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        member_id = self.request.query_params.get('member_id')
        if member_id:
            return Activity.objects.filter(member_id=member_id)
        return Activity.objects.all()

class BookingListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        member_id = self.request.query_params.get('member_id')
        if member_id:
            return Booking.objects.filter(member_id=member_id)
        return Booking.objects.all()

class AchievementListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AchievementSerializer

    def get_queryset(self):
        member_id = self.request.query_params.get('member_id')
        if member_id:
            return Achievement.objects.filter(member_id=member_id)
        return Achievement.objects.all()

class MessageListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        print(f"-----------------------{self.request}")
        member_id = self.request.query_params.get('member_id')
        if member_id:
            return Message.objects.filter(member_id=member_id)
        return Message.objects.all()
    
class AttendanceSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get date filter from query params (default to today)
        date_str = request.query_params.get('date', timezone.now().date().isoformat())
        try:
            selected_date = parse_date(date_str)
            if not selected_date:
                raise ValueError("Invalid date format")
        except ValueError:
            return Response({"error": "Invalid date format"}, status=400)

        # Live Check-ins (most recent activities)
        live_checkins = Activity.objects.filter(
            timestamp__date=selected_date,
            type__in=['check-in', 'check-out']
        ).order_by('-timestamp')[:5]  # Limit to 5 for display

        # Attendance History (daily summaries for the past 7 days)
        end_date = selected_date
        start_date = end_date - timedelta(days=7)
        history = Activity.objects.filter(
            timestamp__date__range=[start_date, end_date],
            type='check-in'
        ).values('timestamp__date').annotate(
            total_visits=Count('id'),
            peak_hour=Max('timestamp'),
            avg_duration=Avg(Cast('duration', FloatField()))
        ).order_by('-timestamp__date')

        # Currently In Gym (members with check-in but no check-out today)
        checkins = Activity.objects.filter(
            timestamp__date=selected_date,
            type='check-in'
        ).select_related('member')
        checkouts = Activity.objects.filter(
            timestamp__date=selected_date,
            type='check-out'
        ).values('member_id')
        currently_in_gym = checkins.exclude(member_id__in=checkouts).order_by('-timestamp')[:4]

        # Format data
        live_checkins_data = ActivitySerializer(live_checkins, many=True).data
        history_data = [
            {
                'date': item['timestamp__date'].isoformat(),
                'totalVisits': item['total_visits'],
                'peakHour': item['peak_hour'].strftime('%I:%M %p') if item['peak_hour'] else 'N/A',
                'avgDuration': f"{int(float(item['avg_duration'] or 0) // 60)}h {int(float(item['avg_duration'] or 0) % 60)}m"
            }
            for item in history
        ]
        currently_in_gym_data = [
            {
                'member': f"{activity.member.user.first_name} {activity.member.user.last_name}",
                'checkinTime': activity.timestamp.strftime('%I:%M %p'),
                'duration': calculate_duration(activity.timestamp),
                'avatar': activity.member.avatar.url if activity.member.avatar else '/placeholder.svg'
            }
            for activity in currently_in_gym
        ]

        return Response({
            'liveCheckins': live_checkins_data,
            'attendanceHistory': history_data,
            'currentlyInGym': currently_in_gym_data,
            'kpi': {
                'todaysCheckins': Activity.objects.filter(timestamp__date=selected_date, type='check-in').count(),
                'currentlyInGym': len(currently_in_gym),
                'peakHour': history.filter(timestamp__date=selected_date).first()['peak_hour'].strftime('%I:%M %p') if history.filter(timestamp__date=selected_date).exists() else 'N/A',
                'avgDuration': history.filter(timestamp__date=selected_date).first()['avg_duration'] if history.filter(timestamp__date=selected_date).exists() else '0m'
            }
        })

def calculate_duration(checkin_time):
    now = timezone.now()
    delta = now - checkin_time
    minutes = delta.total_seconds() // 60
    hours = int(minutes // 60)
    minutes = int(minutes % 60)
    return f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m"

User = get_user_model()
class FaceRecognitionView(APIView):
    permission_classes = [AllowAny]

    def __init__(self):
        super().__init__()
        # Initialize MTCNN (Face Detection) and Resnet (Embedding) just like app1
        self.mtcnn = MTCNN(keep_all=True, device='cpu') 
        self.resnet = InceptionResnetV1(pretrained='vggface2').eval()
        self.threshold = 0.6  # Match the threshold from app1

    def get_known_faces(self):
        """
        Loads embeddings directly from the Gymnast Member database.
        Efficiently converts stored JSON lists back to numpy arrays.
        """
        known_encodings = []
        known_ids = []
        
        # specific to Gymnast: We use the stored face_embedding field
        members = Member.objects.exclude(face_embedding__isnull=True).exclude(face_embedding=[])
        
        for member in members:
            if member.face_embedding:
                # Convert the stored JSON list back to a numpy array
                encoding = np.array(member.face_embedding, dtype=np.float32)
                known_encodings.append(encoding)
                known_ids.append(member.id)
                
        return known_encodings, known_ids

    def post(self, request):
        try:
            # 1. Image Handling (Base64 or File)
            image_file = request.FILES.get('image')
            image_data = request.data.get('image')
            img_rgb = None

            if image_file:
                image = Image.open(image_file)
                img_rgb = np.array(image)
            elif image_data:
                if ',' in image_data:
                    image_data = image_data.split(',')[1]
                image_bytes = base64.b64decode(image_data)
                image = Image.open(BytesIO(image_bytes))
                img_rgb = np.array(image)
            else:
                return Response({'error': 'No image provided'}, status=400)

            # Ensure image is RGB (OpenCV usually reads BGR, PIL reads RGB)
            # If using cv2.imdecode above it might be BGR, so be careful. 
            # Since we used PIL.Image.open above, it is likely RGB.

            # 2. Detect and Encode Face (Logic from app1 adapted)
            # Detect faces
            boxes, _ = self.mtcnn.detect(img_rgb)
            
            if boxes is None:
                return Response({'message': 'No faces detected', 'attendance_updated': False})

            # Process the largest face found
            box = boxes[0]
            face_img = img_rgb[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
            
            if face_img.size == 0:
                return Response({'message': 'Face too small or invalid', 'attendance_updated': False})

            # Resize and normalize for Resnet (standard 160x160)
            face_img = cv2.resize(face_img, (160, 160))
            face_img = np.transpose(face_img, (2, 0, 1)).astype(np.float32) / 255.0
            face_tensor = torch.tensor(face_img).unsqueeze(0)

            # Generate embedding
            with torch.no_grad():
                current_encoding = self.resnet(face_tensor).detach().numpy().flatten()

            # 3. Compare with Known Members
            known_encodings, known_ids = self.get_known_faces()
            
            if not known_encodings:
                return Response({'error': 'No members with face data found'}, status=404)

            # Vectorized distance calculation (Euclidean distance)
            # Calculate distance between current face and ALL known faces at once
            distances = np.linalg.norm(known_encodings - current_encoding, axis=1)
            min_distance_idx = np.argmin(distances)
            min_distance = distances[min_distance_idx]

            # 4. Update Database (Gymnast Activity Model)
            if min_distance < self.threshold:
                matched_member_id = known_ids[min_distance_idx]
                member = Member.objects.get(id=matched_member_id)

                # Logic: Create a Check-in Activity
                # Optional: Check if they already checked in recently to prevent spamming
                last_activity = Activity.objects.filter(member=member).order_by('-timestamp').first()
                
                # Simple spam prevention (e.g., 1 minute)
                if last_activity and (timezone.now() - last_activity.timestamp).total_seconds() < 60:
                     return Response({
                        'message': f'Already updated for {member.user.first_name}',
                        'attendance_updated': False,
                        'member_name': f"{member.user.first_name} {member.user.last_name}"
                    })

                # Create the Activity Entry
                activity = Activity.objects.create(
                    member=member,
                    type='check-in', 
                    title=f"Face Recognition Check-in",
                    timestamp=timezone.now(),
                    location="Main Entrance", # Default location
                    confidence=float(1 - min_distance), # Rough confidence score
                    duration="0m"
                )
                
                # Update member last visit
                member.last_visit = timezone.now().date()
                member.save()

                serializer = ActivitySerializer(activity)
                return Response({
                    'message': f'Welcome back, {member.user.first_name}!',
                    'attendance_updated': True,
                    'data': serializer.data,
                    'member_name': f"{member.user.first_name} {member.user.last_name}"
                })
            else:
                return Response({'message': 'Face not recognized', 'attendance_updated': False})

        except Exception as e:
            print(f"Error processing face: {e}")
            return Response({'error': str(e)}, status=500)