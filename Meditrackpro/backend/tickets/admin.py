from django.contrib import admin
from .models import Ticket, TicketComment

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'title', 'hospital', 'category', 'status', 'priority', 'created_at','created_by')
    list_filter = ('hospital', 'category', 'status', 'priority')
    search_fields = ('ticket_id', 'title', 'description', )
    readonly_fields = ('ticket_id', 'created_at', 'updated_at')

@admin.register(TicketComment)
class TicketCommentAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'author', 'created_at')
    list_filter = ('ticket__hospital',)
    search_fields = ('content',)