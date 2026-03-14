from django.contrib import admin
from .models import ContactInquiry


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = [
        "full_name", "email", "phone", "inquiry_type",
        "status", "assigned_to", "submitted_at",
    ]
    list_filter = ["inquiry_type", "status", "preferred_contact"]
    search_fields = ["first_name", "last_name", "email", "message", "subject"]
    readonly_fields = ["submitted_at", "updated_at"]

    fieldsets = (
        ("Contact", {
            "fields": ("first_name", "last_name", "email", "phone")
        }),
        ("Inquiry", {
            "fields": ("inquiry_type", "subject", "message", "product_of_interest")
        }),
        ("Preferences", {
            "fields": ("preferred_contact", "best_time_to_call")
        }),
        ("Internal", {
            "fields": ("status", "assigned_to", "internal_notes", "submitted_at", "updated_at")
        }),
    )