from django.contrib import admin
from .models import ContactInquiry


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "email", "inquiry_type", "status", "submitted_at"]
    list_filter = ["inquiry_type", "status", "preferred_contact"]
    search_fields = ["first_name", "last_name", "email", "message"]
    readonly_fields = ["submitted_at", "updated_at"]