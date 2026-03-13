from django.db import models
from django.utils import timezone
from products.models import Product, Category


class Deal(models.Model):
    """A special offer, promotion, or financing deal."""

    DEAL_TYPE_CHOICES = [
        ("clearance", "Clearance Sale"),
        ("financing", "Special Financing"),
        ("trade_in", "Trade-In Offer"),
        ("bundle", "Bundle Deal"),
        ("seasonal", "Seasonal Promotion"),
        ("new_arrival", "New Arrival"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    deal_type = models.CharField(max_length=30, choices=DEAL_TYPE_CHOICES)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)

    # Products this deal applies to (optional — can be site-wide)
    products = models.ManyToManyField(Product, blank=True, related_name="deals")
    categories = models.ManyToManyField(Category, blank=True, related_name="deals")

    # Discount details
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    promo_code = models.CharField(max_length=50, blank=True)

    # Financing details
    financing_apr = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, help_text="APR %")
    financing_months = models.PositiveSmallIntegerField(null=True, blank=True, help_text="Term in months")

    # Badge / call-to-action label shown in the app
    badge_label = models.CharField(max_length=30, blank=True, help_text='e.g. "Save $2,000", "0% APR"')
    badge_color = models.CharField(max_length=7, default="#E63946", help_text="Hex color for the badge")

    # Validity
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)

    image = models.ImageField(upload_to="deals/", null=True, blank=True)

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
            delta = self.end_date - timezone.now()
            return max(0, delta.days)
        return None


class TradeInRequest(models.Model):
    """Customer trade-in inquiry submitted through the app."""

    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("reviewed", "Reviewed"),
        ("quoted", "Quote Sent"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
    ]

    # Vehicle info
    year = models.PositiveSmallIntegerField()
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    mileage = models.PositiveIntegerField()
    condition_notes = models.TextField(blank=True)

    # Contact info
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    zip_code = models.CharField(max_length=10)

    # What they're interested in getting
    interested_in = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=True, related_name="trade_in_requests"
    )
    notes = models.TextField(blank=True)

    # Internal
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    offered_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    internal_notes = models.TextField(blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.year} {self.make} {self.model}"