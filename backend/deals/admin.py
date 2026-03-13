from django.contrib import admin
from .models import Deal, TradeInRequest


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ["title", "deal_type", "badge_label", "is_active", "is_featured", "start_date", "end_date"]
    list_filter = ["deal_type", "is_active", "is_featured"]
    search_fields = ["title", "description", "promo_code"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["products", "categories"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(TradeInRequest)
class TradeInRequestAdmin(admin.ModelAdmin):
    list_display = ["__str__", "email", "phone", "status", "offered_value", "submitted_at"]
    list_filter = ["status"]
    search_fields = ["first_name", "last_name", "email", "make", "model"]
    readonly_fields = ["submitted_at", "updated_at"]

    fieldsets = (
        ("Vehicle", {"fields": ("year", "make", "model", "mileage", "condition_notes")}),
        ("Contact", {"fields": ("first_name", "last_name", "email", "phone", "zip_code")}),
        ("Interest", {"fields": ("interested_in", "notes")}),
        ("Internal", {"fields": ("status", "offered_value", "internal_notes", "submitted_at", "updated_at")}),
    )