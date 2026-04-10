from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Brand",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("logo_url", models.URLField(blank=True)),
                ("website", models.URLField(blank=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("slug", models.SlugField(unique=True)),
                ("description", models.TextField(blank=True)),
                ("icon", models.CharField(blank=True, help_text="Icon name for mobile app", max_length=50)),
                ("image_url", models.URLField(blank=True, help_text="Category image URL from millermobility.com")),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
            ],
            options={"verbose_name_plural": "categories", "ordering": ["sort_order", "name"]},
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("slug", models.SlugField(max_length=220, unique=True)),
                ("model_number", models.CharField(blank=True, max_length=100)),
                ("sku", models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ("description", models.TextField(blank=True)),
                ("short_description", models.CharField(blank=True, max_length=400)),
                ("price", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("msrp", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("call_for_price", models.BooleanField(default=False)),
                ("condition", models.CharField(choices=[("new","New"),("used","Used"),("certified","Certified Pre-Owned")], default="new", max_length=20)),
                ("status", models.CharField(choices=[("available","Available"),("sold","Sold"),("on_hold","On Hold"),("coming_soon","Coming Soon")], default="available", max_length=20)),
                ("specifications", models.JSONField(blank=True, default=dict)),
                ("primary_image_url", models.URLField(blank=True, help_text="Primary image URL from millermobility.com")),
                ("source_url", models.URLField(blank=True, help_text="Product page URL on millermobility.com")),
                ("is_featured", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("brand", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="products", to="products.brand")),
                ("category", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="products", to="products.category")),
            ],
            options={"ordering": ["-is_featured", "-created_at"]},
        ),
        migrations.CreateModel(
            name="ProductImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image_url", models.URLField(help_text="Image URL from millermobility.com CDN")),
                ("alt_text", models.CharField(blank=True, max_length=200)),
                ("is_primary", models.BooleanField(default=False)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="images", to="products.product")),
            ],
            options={"ordering": ["-is_primary", "sort_order"]},
        ),
    ]