from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name for mobile app")
    # External image URL scraped from millermobility.com
    image_url = models.TextField(blank=True, help_text="Category image URL from millermobility.com")
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)
    logo_url = models.TextField(blank=True)
    website = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
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

    name = models.TextField()
    slug = models.TextField(unique=True)
    model_number = models.TextField(blank=True)
    sku = models.CharField(max_length=100, blank=True, null=True, unique=True)

    description = models.TextField(blank=True)
    short_description = models.TextField(blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    msrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    call_for_price = models.BooleanField(default=False)

    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default="new")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")
    specifications = models.JSONField(default=dict, blank=True)

    # Primary image URL scraped directly from millermobility.com
    primary_image_url = models.TextField(blank=True, help_text="Primary image URL from millermobility.com")
    # Source URL on millermobility.com for reference / re-scraping
    source_url = models.TextField(blank=True, help_text="Product page URL on millermobility.com")

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
    # Store the external CDN URL instead of uploading locally
    image_url = models.TextField(help_text="Image URL from millermobility.com CDN")
    alt_text = models.TextField(blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-is_primary", "sort_order"]

    def __str__(self):
        return f"{self.product.name} — image {self.sort_order}"