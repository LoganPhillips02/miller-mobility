from django.db import models
from django.utils import timezone
from products.models import Product, Category


class Deal(models.Model):
    DEAL_TYPE_CHOICES = [
        ("clearance", "Clearance Sale"),
        ("financing", "Special Financing"),
        ("trade_in", "Trade-In Offer"),
        ("bundle", "Bundle Deal"),
        ("seasonal", "Seasonal Promotion"),
        ("new_arrival", "New Arrival"),
        ("veterans", "Veterans Appreciation"),
        ("program", "Assistance Program"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    deal_type = models.CharField(max_length=30, choices=DEAL_TYPE_CHOICES)
    description = models.TextField()
    short_description = models.CharField(max_length=400, blank=True)

    products = models.ManyToManyField(Product, blank=True, related_name="deals")
    categories = models.ManyToManyField(Category, blank=True, related_name="deals")

    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    promo_code = models.CharField(max_length=50, blank=True)

    financing_apr = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    financing_months = models.PositiveSmallIntegerField(null=True, blank=True)

    badge_label = models.CharField(max_length=40, blank=True)
    badge_color = models.CharField(max_length=7, default="#E63946")

    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)

    image_url = models.URLField(blank=True, help_text="Deal image URL")

    is_featured = models.BooleanField(default=False)
    sort_order = models.PositiveSmallIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-created_at"]

    def __str__(self):
        return self.title

    @property
    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if self.start_date and self.start_date > now:
            return False
        if self.end_date and self.end_date < now:
            return False
        return True

    @property
    def days_remaining(self):
        if self.end_date:
            return max(0, (self.end_date - timezone.now()).days)
        return None