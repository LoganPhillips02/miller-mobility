from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, VehicleConversion


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "icon", "sort_order", "product_count"]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "logo_url", "website"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "is_primary", "sort_order"]


class VehicleConversionSerializer(serializers.ModelSerializer):
    body_style_display = serializers.CharField(source="get_body_style_display", read_only=True)
    entry_type_display = serializers.CharField(source="get_entry_type_display", read_only=True)

    class Meta:
        model = VehicleConversion
        fields = [
            "year", "make", "model", "trim", "mileage", "color", "vin",
            "body_style", "body_style_display",
            "entry_type", "entry_type_display",
            "ramp_length_inches", "lowered_floor_inches",
            "door_opening_height_inches", "door_opening_width_inches",
            "driver_can_remain_in_wheelchair", "passenger_positions",
            "conversion_brand",
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    category_name = serializers.CharField(source="category.name", read_only=True)
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    primary_image = serializers.SerializerMethodField()
    display_price = serializers.CharField(read_only=True)
    condition_display = serializers.CharField(source="get_condition_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "short_description",
            "category_name", "brand_name",
            "price", "msrp", "display_price", "call_for_price",
            "condition", "condition_display",
            "status", "status_display",
            "is_featured", "primary_image",
            "created_at",
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get("request")
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


class ProductDetailSerializer(ProductListSerializer):
    """Full serializer for detail view."""
    images = ProductImageSerializer(many=True, read_only=True)
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    conversion_details = VehicleConversionSerializer(read_only=True)
    savings = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + [
            "description", "model_number", "sku",
            "specifications", "savings",
            "images", "brand", "category", "conversion_details",
            "updated_at",
        ]