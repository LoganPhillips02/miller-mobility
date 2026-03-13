from rest_framework import serializers
from .models import Deal, TradeInRequest


class DealSerializer(serializers.ModelSerializer):
    deal_type_display = serializers.CharField(source="get_deal_type_display", read_only=True)
    is_valid = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    product_count = serializers.SerializerMethodField()

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
            "image", "is_featured", "sort_order",
            "product_count",
        ]

    def get_product_count(self, obj):
        return obj.products.count()


class TradeInRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeInRequest
        fields = [
            "id",
            "year", "make", "model", "mileage", "condition_notes",
            "first_name", "last_name", "email", "phone", "zip_code",
            "interested_in", "notes",
            "submitted_at",
        ]
        read_only_fields = ["id", "submitted_at"]

    def validate_year(self, value):
        import datetime
        current_year = datetime.date.today().year
        if value < 1980 or value > current_year + 1:
            raise serializers.ValidationError(f"Year must be between 1980 and {current_year + 1}.")
        return value