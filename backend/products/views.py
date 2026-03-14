from django.db.models import Count
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as django_filters

from .models import Category, Brand, Product
from .serializers import (
    CategorySerializer,
    BrandSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
)


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")
    condition = django_filters.ChoiceFilter(choices=Product.CONDITION_CHOICES)
    status = django_filters.ChoiceFilter(choices=Product.STATUS_CHOICES)
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    featured = django_filters.BooleanFilter(field_name="is_featured")
    brand = django_filters.CharFilter(field_name="brand__name", lookup_expr="icontains")

    class Meta:
        model = Product
        fields = ["category", "condition", "status", "min_price", "max_price", "featured", "brand"]


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.annotate(product_count=Count("products")).filter(
        products__is_active=True
    ).distinct()
    serializer_class = CategorySerializer
    lookup_field = "slug"


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ProductFilter
    search_fields = ["name", "short_description", "description", "brand__name"]
    ordering_fields = ["price", "created_at", "name"]
    ordering = ["-is_featured", "-created_at"]

    def get_queryset(self):
        return (
            Product.objects.filter(is_active=True)
            .select_related("category", "brand")
            .prefetch_related("images", "conversion_details")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:10]
        serializer = ProductListSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def vehicles(self, request):
        qs = self.get_queryset().filter(
            category__slug="wheelchair-accessible-vehicles"
        ).select_related("conversion_details")
        serializer = ProductDetailSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)