from django.contrib import admin
from .models import Category, Brand, Product, ProductImage, VehicleConversion


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class VehicleConversionInline(admin.StackedInline):
    model = VehicleConversion
    extra = 0


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "sort_order"]
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["sort_order", "name"]


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ["name", "website"]
    search_fields = ["name"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "brand", "condition", "status", "price", "is_featured", "is_active"]
    list_filter = ["category", "brand", "condition", "status", "is_featured", "is_active"]
    search_fields = ["name", "model_number", "sku", "description"]
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ProductImageInline, VehicleConversionInline]

    fieldsets = (
        ("Basic Info", {
            "fields": ("name", "slug", "category", "brand", "model_number", "sku")
        }),
        ("Description", {
            "fields": ("short_description", "description")
        }),
        ("Pricing", {
            "fields": ("price", "msrp", "call_for_price")
        }),
        ("Status", {
            "fields": ("condition", "status", "is_featured", "is_active")
        }),
        ("Specifications", {
            "fields": ("specifications",),
            "classes": ("collapse",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )