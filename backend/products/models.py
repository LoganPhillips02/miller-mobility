from django.db import models


class Category(models.Model):
    """Top-level vehicle / product category (e.g. Power Wheelchairs, Scooters)."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name for mobile app")
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)
    logo_url = models.URLField(blank=True)
    website = models.URLField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    """A mobility product (vehicle, lift, ramp, accessory, etc.)."""

    CONDITION_CHOICES = [
        ("new", "New"),
        ("used", "Used"),
        ("certified", "Certified Pre-Owned"),
    ]

    STATUS_CHOICES = [
        ("available", "Available"),
        ("sold", "Sold"),
        ("on_hold", "On Hold"),
        ("coming_soon", "Coming Soon"),
    ]

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name="products")

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    model_number = models.CharField(max_length=100, blank=True)
    sku = models.CharField(max_length=100, blank=True, unique=True, null=True)

    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=300, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    msrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Manufacturer's suggested retail price")
    call_for_price = models.BooleanField(default=False)

    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default="new")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")
    # Specifications stored as JSON for flexibility
    specifications = models.JSONField(default=dict, blank=True)

    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]

    def __str__(self):
        return self.name

    @property
    def display_price(self):
        if self.call_for_price:
            return "Call for Price"
        if self.price:
            return f"${self.price:,.0f}"
        return "Contact Us"

    @property
    def savings(self):
        if self.msrp and self.price and self.msrp > self.price:
            return self.msrp - self.price
        return None


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-is_primary", "sort_order"]

    def __str__(self):
        return f"{self.product.name} - Image {self.sort_order}"


class VehicleConversion(models.Model):
    """Wheelchair-accessible vehicle conversion (WAV) — a specialised product type."""

    BODY_STYLE_CHOICES = [
        ("minivan", "Minivan"),
        ("full_size_van", "Full-Size Van"),
        ("suv", "SUV"),
        ("truck", "Truck"),
    ]

    ENTRY_CHOICES = [
        ("rear_entry", "Rear Entry"),
        ("side_entry", "Side Entry"),
        ("in_floor", "In-Floor Ramp"),
        ("fold_out", "Fold-Out Ramp"),
    ]

    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="conversion_details")

    year = models.PositiveSmallIntegerField()
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    trim = models.CharField(max_length=100, blank=True)
    mileage = models.PositiveIntegerField(null=True, blank=True)
    color = models.CharField(max_length=50, blank=True)
    vin = models.CharField(max_length=17, blank=True)

    body_style = models.CharField(max_length=30, choices=BODY_STYLE_CHOICES)
    entry_type = models.CharField(max_length=30, choices=ENTRY_CHOICES)

    # Key accessibility specs
    ramp_length_inches = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    lowered_floor_inches = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    door_opening_height_inches = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    door_opening_width_inches = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)

    # Seating
    driver_can_remain_in_wheelchair = models.BooleanField(default=False)
    passenger_positions = models.PositiveSmallIntegerField(default=1)

    # Conversion brand
    conversion_brand = models.CharField(max_length=100, blank=True, help_text="e.g. BraunAbility, VMI, Vantage")

    class Meta:
        ordering = ["-year", "make", "model"]

    def __str__(self):
        return f"{self.year} {self.make} {self.model} ({self.get_entry_type_display()})"