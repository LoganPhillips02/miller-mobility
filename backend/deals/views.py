from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Deal, TradeInRequest
from .serializers import DealSerializer, TradeInRequestSerializer


class DealViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DealSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = Deal.objects.filter(is_active=True).prefetch_related("products", "categories")

        deal_type = self.request.query_params.get("type")
        if deal_type:
            qs = qs.filter(deal_type=deal_type)

        featured = self.request.query_params.get("featured")
        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs

    @action(detail=False, methods=["get"])
    def active(self, request):
        """Return only currently valid (not expired) deals."""
        deals = [d for d in self.get_queryset() if d.is_valid]
        serializer = self.get_serializer(deals, many=True)
        return Response(serializer.data)


class TradeInRequestViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Customers submit trade-in requests; staff view them in admin."""
    queryset = TradeInRequest.objects.none()
    serializer_class = TradeInRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Trade-in request submitted. We'll be in touch shortly!", "id": serializer.data["id"]},
            status=status.HTTP_201_CREATED,
        )