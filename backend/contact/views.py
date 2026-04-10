from rest_framework import mixins, viewsets, status
from rest_framework.response import Response
from .models import ContactInquiry
from .serializers import ContactInquirySerializer


class ContactInquiryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactInquiry.objects.none()
    serializer_class = ContactInquirySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Thanks for reaching out! We'll get back to you within 1 business day.", "id": serializer.data["id"]},
            status=status.HTTP_201_CREATED,
        )