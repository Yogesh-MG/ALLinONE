from django.urls import path
from .views import (
    GymSettingsView,
    MembershipPlanListCreateView,
    MembershipPlanDetailView,
    MemberListCreateView,
    MemberDetailView,
    MembershipStatsView,
    ClassListCreateView,
    ProfileView,
    ActivityListCreateView,
    BookingListCreateView,
    AchievementListCreateView,
    MessageListCreateView,
    AttendanceSummaryView,
    FaceRecognitionView,
    SaveFaceEmbeddingView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("profile/", ProfileView.as_view(), name='profile'),
    path('settings/', GymSettingsView.as_view(), name='gym_settings'),
    path('membership-plans/', MembershipPlanListCreateView.as_view(), name='membership_plan_list_create'),
    path('membership-plans/<int:pk>/', MembershipPlanDetailView.as_view(), name='membership_plan_detail'),
    path('members/', MemberListCreateView.as_view(), name='member_list_create'),
    path('members/<int:pk>/', MemberDetailView.as_view(), name='member_detail'),
    path('membership-stats/', MembershipStatsView.as_view(), name='membership_stats'),
    path('classes/', ClassListCreateView.as_view(), name='class_list_create'),
    path('activities/', ActivityListCreateView.as_view(), name='activity_list_create'),
    path('bookings/', BookingListCreateView.as_view(), name='booking_list_create'),
    path('achievements/', AchievementListCreateView.as_view(), name='achievement_list_create'),
    path('messages/', MessageListCreateView.as_view(), name='message_list_create'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('attendance-summary/', AttendanceSummaryView.as_view(), name='attendance_summary'),
    path('face-recognition/', FaceRecognitionView.as_view(), name='face_recognition'),
    path('save-face-embedding/', SaveFaceEmbeddingView.as_view(), name='save_face_embedding'),
]