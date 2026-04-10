from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Deal
from .serializers import DealSerializer


class DealViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DealSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = Deal.objects.filter(is_active=True)
        if deal_type := self.request.query_params.get("type"):
            qs = qs.filter(deal_type=deal_type)
        if self.request.query_params.get("featured") == "true":
            qs = qs.filter(is_featured=True)
        return qs

    @action(detail=False, methods=["get"])
    def active(self, request):
        deals = [d for d in self.get_queryset() if d.is_valid]
        return Response(self.get_serializer(deals, many=True).data)