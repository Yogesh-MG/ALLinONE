from django.urls import path
from .views import (
    TicketListCreateView,
    TicketDetailView,
    TicketCommentCreateView,
)

urlpatterns = [
    path('<int:hospital_id>/tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('<int:hospital_id>/tickets/<str:ticket_id>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('<int:hospital_id>/tickets/<str:ticket_id>/comments/', TicketCommentCreateView.as_view(), name='ticket-comment-create'),
]