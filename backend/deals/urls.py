from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DealViewSet, TradeInRequestViewSet

router = DefaultRouter()
router.register("trade-in", TradeInRequestViewSet, basename="trade-in")
router.register("", DealViewSet, basename="deal")

urlpatterns = [
    path("", include(router.urls)),
]