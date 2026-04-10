import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True
    dependencies = [("products", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="Deal",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("slug", models.SlugField(unique=True)),
                ("deal_type", models.CharField(
                    choices=[
                        ("clearance","Clearance Sale"),("financing","Special Financing"),
                        ("trade_in","Trade-In Offer"),("bundle","Bundle Deal"),
                        ("seasonal","Seasonal Promotion"),("new_arrival","New Arrival"),
                        ("veterans","Veterans Appreciation"),("program","Assistance Program"),
                    ],
                    max_length=30,
                )),
                ("description", models.TextField()),
                ("short_description", models.CharField(blank=True, max_length=400)),
                ("discount_percent", models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ("discount_amount", models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ("promo_code", models.CharField(blank=True, max_length=50)),
                ("financing_apr", models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ("financing_months", models.PositiveSmallIntegerField(blank=True, null=True)),
                ("badge_label", models.CharField(blank=True, max_length=40)),
                ("badge_color", models.CharField(default="#E63946", max_length=7)),
                ("is_active", models.BooleanField(default=True)),
                ("start_date", models.DateTimeField(default=django.utils.timezone.now)),
                ("end_date", models.DateTimeField(blank=True, null=True)),
                ("image_url", models.URLField(blank=True)),
                ("is_featured", models.BooleanField(default=False)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("categories", models.ManyToManyField(blank=True, related_name="deals", to="products.category")),
                ("products", models.ManyToManyField(blank=True, related_name="deals", to="products.product")),
            ],
            options={"ordering": ["sort_order", "-created_at"]},
        ),
    ]