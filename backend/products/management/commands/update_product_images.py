"""
Management command: update_product_images

Re-scrapes each product's source_url to fetch and store all product images.
Safe to run repeatedly — skips products that already have images unless --force is passed.

Usage:
    python manage.py update_product_images
    python manage.py update_product_images --force     # re-fetch even if images exist
    python manage.py update_product_images --limit 20  # only process N products
"""

import re
import time
import logging

import requests
from django.core.management.base import BaseCommand

from products.models import Product, ProductImage

logger = logging.getLogger(__name__)

# Macintosh UA avoids 403s from millermobility.com's CDN WAF
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "max-age=0",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
}

# Only product photos — in Duda's CDN these live under /images/{siteId}/products/
PRODUCT_IMG_PATTERN = re.compile(
    r"https://d2j6dbq0eux0bg\.cloudfront\.net/images/\d+/products/\d+/(\d+)\.(gif|jpg|jpeg|png|webp)",
    re.I,
)

SKIP_FILENAME_PATTERNS = [
    "logo", "flag", "icon", "bbb", "homeadvisor", "google",
    "button", "_logo", "brochure", "spec_sheet", "soap", "border",
    "review", "testimonial", "banner", "background", "divider",
    "footer", "header", "rating", "trust", "award", "cert", "ribbon",
]


def fetch_html(url: str, session: requests.Session) -> str | None:
    try:
        resp = session.get(url, headers=HEADERS, timeout=20)
        resp.raise_for_status()
        return resp.text
    except Exception as exc:
        logger.warning("Failed to fetch %s: %s", url, exc)
        return None


def extract_product_images(html: str) -> list[str]:
    """
    Extract product image URLs from raw HTML.

    Miller Mobility uses Duda CMS which embeds product images as inline
    background-image styles and img src attributes. Images live at:
      cloudfront.net/images/{siteId}/products/{productId}/{imageId}.ext

    Duda stores each image in two variants with consecutive IDs (e.g. 123 and 125),
    a full-size and a thumbnail. We deduplicate by skipping any URL whose numeric
    image ID is within 2 of a previously seen ID (keeping only the first of each pair).
    """
    matches = PRODUCT_IMG_PATTERN.finditer(html)
    seen_ids = []
    urls = []

    for m in matches:
        url = m.group(0)
        img_id = int(m.group(1))
        filename = url.split("/")[-1].lower()

        if any(skip in filename for skip in SKIP_FILENAME_PATTERNS):
            continue

        # Deduplicate Duda's thumbnail+full pairs (IDs differ by exactly 2)
        if any(abs(img_id - seen) <= 2 for seen in seen_ids):
            continue

        seen_ids.append(img_id)
        if url not in urls:
            urls.append(url)

    return urls


class Command(BaseCommand):
    help = "Re-scrape product pages to fetch and store all product images."

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true", help="Re-fetch images even if they already exist.")
        parser.add_argument("--limit", type=int, default=0, help="Max number of products to process (0 = all).")

    def handle(self, *args, **options):
        force = options["force"]
        limit = options["limit"]

        qs = Product.objects.filter(
            source_url__startswith="https://www.millermobility.com/product/"
        ).order_by("id")

        if not force:
            products_with_images = set(
                ProductImage.objects.values_list("product_id", flat=True).distinct()
            )
            qs = qs.exclude(id__in=products_with_images)

        if limit:
            qs = qs[:limit]

        total = qs.count()
        self.stdout.write(f"Processing {total} products{'  (force mode)' if force else ''}...\n")

        session = requests.Session()
        session.headers.update(HEADERS)

        updated = 0
        skipped = 0

        for product in qs:
            self.stdout.write(f"  → {product.name[:70]}")
            html = fetch_html(product.source_url, session)
            if not html:
                self.stdout.write(self.style.WARNING("    ✗ Could not fetch page"))
                skipped += 1
                time.sleep(0.5)
                continue

            images = extract_product_images(html)
            if not images:
                self.stdout.write("    ✗ No images found")
                skipped += 1
                time.sleep(0.4)
                continue

            if not product.primary_image_url:
                product.primary_image_url = images[0]
                product.save(update_fields=["primary_image_url"])

            if force:
                product.images.all().delete()

            if force or not product.images.exists():
                for i, img_url in enumerate(images[:10]):
                    ProductImage.objects.create(
                        product=product,
                        image_url=img_url,
                        is_primary=(i == 0),
                        sort_order=i,
                    )
                self.stdout.write(self.style.SUCCESS(f"    ✓ Saved {len(images[:10])} image(s)"))
                updated += 1
            else:
                self.stdout.write("    – Already has images, skipping")
                skipped += 1

            time.sleep(0.5)

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Done. Updated: {updated}  Skipped/failed: {skipped}"
        ))
