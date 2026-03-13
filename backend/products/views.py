from django.db.models import Count
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Brand, Product
from .serializers import (
    CategorySerializer,
    BrandSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.annotate(product_count=Count("products")).filter(
        products__is_active=True
    )
    serializer_class = CategorySerializer
    lookup_field = "slug"


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "short_description", "description", "brand__name"]
    ordering_fields = ["price", "created_at", "name"]
    ordering = ["-is_featured", "-created_at"]

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related(
            "category", "brand"
        ).prefetch_related("images")

        # Filter by category slug
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)

        # Filter by condition
        condition = self.request.query_params.get("condition")
        if condition:
            qs = qs.filter(condition=condition)

        # Filter by status
        status = self.request.query_params.get("status")
        if status:
            qs = qs.filter(status=status)

        # Price range
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)

        # Featured only
        featured = self.request.query_params.get("featured")
        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=False, methods=["get"])
    def featured(self, request):
        """Shortcut endpoint for featured products."""
        qs = self.get_queryset().filter(is_featured=True)[:10]
        serializer = ProductListSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def vehicles(self, request):
        """Wheelchair-accessible vehicles only."""
        qs = self.get_queryset().filter(
            category__slug__in=["wheelchair-accessible-vehicles", "wav", "vehicles"]
        ).select_related("conversion_details")
        serializer = ProductDetailSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)