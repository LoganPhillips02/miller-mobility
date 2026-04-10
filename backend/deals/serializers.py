from rest_framework import serializers
from .models import Deal


class DealSerializer(serializers.ModelSerializer):
    deal_type_display = serializers.CharField(source="get_deal_type_display", read_only=True)
    is_valid = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)

    class Meta:
        model = Deal
        fields = [
            "id", "title", "slug", "deal_type", "deal_type_display",
            "description", "short_description",
            "discount_percent", "discount_amount", "promo_code",
            "financing_apr", "financing_months",
            "badge_label", "badge_color",
            "is_active", "is_valid",
            "start_date", "end_date", "days_remaining",
            "image_url", "is_featured", "sort_order",
        ]