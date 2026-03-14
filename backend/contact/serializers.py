from rest_framework import serializers
from .models import ContactInquiry


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = [
            "id",
            "inquiry_type",
            "first_name",
            "last_name",
            "email",
            "phone",
            "subject",
            "message",
            "product_of_interest",
            "preferred_contact",
            "best_time_to_call",
            "submitted_at",
        ]
        read_only_fields = ["id", "submitted_at"]

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Please provide a bit more detail (at least 10 characters)."
            )
        return value