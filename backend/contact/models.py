from django.db import models


class ContactInquiry(models.Model):
    """General contact form submission from the mobile app."""

    INQUIRY_TYPE_CHOICES = [
        ("general", "General Question"),
        ("product", "Product Inquiry"),
        ("financing", "Financing Question"),
        ("service", "Service / Repair"),
        ("accessibility", "Accessibility Consultation"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("new", "New"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("archived", "Archived"),
    ]

    inquiry_type = models.CharField(
        max_length=30, choices=INQUIRY_TYPE_CHOICES, default="general"
    )

    # Contact details
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)

    # Message
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()

    # Optional product reference
    product_of_interest = models.CharField(
        max_length=200, blank=True,
        help_text="Product name or ID the customer is asking about"
    )

    # Preferred contact method
    preferred_contact = models.CharField(
        max_length=10,
        choices=[("email", "Email"), ("phone", "Phone"), ("either", "Either")],
        default="either",
    )
    best_time_to_call = models.CharField(max_length=100, blank=True)

    # Internal
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    internal_notes = models.TextField(blank=True)
    assigned_to = models.CharField(max_length=100, blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-submitted_at"]
        verbose_name = "Contact Inquiry"
        verbose_name_plural = "Contact Inquiries"

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.get_inquiry_type_display()} ({self.submitted_at.date()})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"