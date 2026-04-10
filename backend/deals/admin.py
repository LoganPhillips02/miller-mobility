from django.contrib import admin
from .models import Deal


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ["title", "deal_type", "badge_label", "is_active", "is_featured", "start_date", "end_date"]
    list_filter = ["deal_type", "is_active", "is_featured"]
    search_fields = ["title", "description", "promo_code"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["products", "categories"]
    readonly_fields = ["created_at", "updated_at"]