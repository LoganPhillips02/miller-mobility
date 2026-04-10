from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ContactInquiry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("inquiry_type", models.CharField(choices=[("general","General Question"),("product","Product Inquiry"),("financing","Financing Question"),("service","Service / Repair"),("accessibility","Accessibility Consultation"),("other","Other")], default="general", max_length=30)),
                ("first_name", models.CharField(max_length=100)),
                ("last_name", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(blank=True, max_length=20)),
                ("subject", models.CharField(blank=True, max_length=200)),
                ("message", models.TextField()),
                ("product_of_interest", models.CharField(blank=True, max_length=200)),
                ("preferred_contact", models.CharField(choices=[("email","Email"),("phone","Phone"),("either","Either")], default="either", max_length=10)),
                ("best_time_to_call", models.CharField(blank=True, max_length=100)),
                ("status", models.CharField(choices=[("new","New"),("in_progress","In Progress"),("resolved","Resolved"),("archived","Archived")], default="new", max_length=20)),
                ("internal_notes", models.TextField(blank=True)),
                ("assigned_to", models.CharField(blank=True, max_length=100)),
                ("submitted_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"verbose_name": "Contact Inquiry", "verbose_name_plural": "Contact Inquiries", "ordering": ["-submitted_at"]},
        ),
    ]