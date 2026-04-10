"""
Management command: scrape_millermobility

Scrapes https://www.millermobility.com/ and populates the PostgreSQL database
with real categories, products, images, and deals.

Usage:
    python manage.py scrape_millermobility
    python manage.py scrape_millermobility --clear      # wipe existing data first
    python manage.py scrape_millermobility --dry-run    # print scraped data without saving
"""

import re
import time
import logging
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from products.models import Brand, Category, Product, ProductImage
from deals.models import Deal

logger = logging.getLogger(__name__)

BASE_URL = "https://www.millermobility.com"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# ─── Category definitions with slugs matching millermobility.com URLs ────────
CATEGORY_CONFIG = [
    {
        "name": "Stairlifts",
        "slug": "stairlifts",
        "url": "/stairlifts",
        "icon": "stairs",
        "sort_order": 1,
        "description": "Straight and curved stairlift systems for safe, easy access to every floor of your home.",
        "is_featured": True,
    },
    {
        "name": "Mobility Scooters",
        "slug": "mobility-scooters",
        "url": "/mobility-scooters",
        "icon": "motorcycle",
        "sort_order": 2,
        "description": "3- and 4-wheel electric mobility scooters for indoor and outdoor independence.",
        "is_featured": True,
    },
    {
        "name": "Power Wheelchairs",
        "slug": "power-wheelchairs",
        "url": "/power-wheelchairs",
        "icon": "accessibility",
        "sort_order": 3,
        "description": "Lightweight, foldable, and full-sized electric power wheelchairs for indoor and outdoor use.",
        "is_featured": True,
    },
    {
        "name": "Power Lift Recliners",
        "slug": "lift-chairs-power-recliners",
        "url": "/lift-chairs-power-recliners",
        "icon": "chair",
        "sort_order": 4,
        "description": "Power lift recliners that gently raise you to a standing position with the press of a button.",
        "is_featured": True,
    },
    {
        "name": "Wheelchairs & Transport Chairs",
        "slug": "wheelchairs-transport-chairs",
        "url": "/wheelchairs-transport-chairs",
        "icon": "wheelchair",
        "sort_order": 5,
        "description": "Manual wheelchairs and lightweight transport chairs for everyday mobility needs.",
        "is_featured": False,
    },
    {
        "name": "Walkers & Rollators",
        "slug": "walkers-rollators",
        "url": "/walkers-rollators",
        "icon": "walk",
        "sort_order": 6,
        "description": "Standard walkers, 4-wheel rollators with seats, and bariatric options.",
        "is_featured": False,
    },
    {
        "name": "Vehicle Lifts",
        "slug": "vehicle-lifts",
        "url": "/vehicle-lifts",
        "icon": "car",
        "sort_order": 7,
        "description": "Interior and exterior vehicle lifts for transporting scooters and power chairs.",
        "is_featured": True,
    },
    {
        "name": "Patient Lifts",
        "slug": "patient-lifts",
        "url": "/patient-lifts",
        "icon": "medical",
        "sort_order": 8,
        "description": "Full-body, sit-to-stand, and ceiling patient lifts for safe, dignified transfers.",
        "is_featured": False,
    },
    {
        "name": "Ramps",
        "slug": "ramps",
        "url": "/ramps",
        "icon": "trending_flat",
        "sort_order": 9,
        "description": "Portable, folding, and modular aluminum wheelchair ramps for home, vehicle, and business.",
        "is_featured": False,
    },
    {
        "name": "Beds",
        "slug": "beds",
        "url": "/beds",
        "icon": "bed",
        "sort_order": 10,
        "description": "Adjustable and full-electric hospital-style beds for comfortable and safe home care.",
        "is_featured": False,
    },
    {
        "name": "Vertical Platform Lifts",
        "slug": "vertical-platform-lifts",
        "url": "/vertical-platform-lifts-home-elevators",
        "icon": "elevator",
        "sort_order": 11,
        "description": "Vertical platform lifts for porch, deck, and home entry access.",
        "is_featured": False,
    },
    {
        "name": "Security Poles",
        "slug": "security-poles",
        "url": "/security-poles",
        "icon": "safety",
        "sort_order": 12,
        "description": "Floor-to-ceiling security poles and grab bars for fall prevention and stability.",
        "is_featured": False,
    },
    {
        "name": "Tables & Trays",
        "slug": "tables-trays",
        "url": "/tables-trays",
        "icon": "table",
        "sort_order": 13,
        "description": "Over-bed tables, swivel trays, and stand-assist tray tables.",
        "is_featured": False,
    },
]

# ─── Brand name patterns for extraction ──────────────────────────────────────
BRAND_PATTERNS = [
    "Bruno", "Handicare", "Harmar", "Pride Mobility", "Golden Technologies",
    "Drive Medical", "Journey Health", "Forcemech", "Rhythm Healthcare",
    "Strongback", "Vive Health", "EZ-ACCESS", "Prairie View", "BestCare",
    "Savaria", "Stander", "Healthcraft", "IndeeLift",
]

DEALS_DATA = [
    {
        "title": "April Deal of the Month — 10% Off Rollators",
        "slug": "april-deal-rollators",
        "deal_type": "seasonal",
        "short_description": "Save 10% on all rollators this month — 3-wheel, 4-wheel, bariatric & upright models.",
        "description": (
            "Spring is here and so is our April Deal of the Month! Take 10% off all rollators "
            "for a limited time. Rollators are one of the most effective mobility aids for staying "
            "active, steady, and independent. Whether you're shopping for yourself or a loved one, "
            "we're here to help you find the right fit.\n\n"
            "3-wheel, 4-wheel, bariatric, and upright models are all included. "
            "Stop by our Oconomowoc showroom or call 262-549-4900 today."
        ),
        "discount_percent": 10,
        "badge_label": "10% OFF",
        "badge_color": "#E63946",
        "is_featured": True,
        "is_active": True,
        "sort_order": 1,
    },
    {
        "title": "Veterans Appreciation Savings",
        "slug": "veterans-appreciation-savings",
        "deal_type": "veterans",
        "short_description": "Veterans receive 10% off their first purchase and 5% off every future purchase — year-round.",
        "description": (
            "Miller Mobility is proud to honor those who've served. Veterans receive "
            "10% off their first purchase and 5% off every future purchase — our way of "
            "saying thank you for your service.\n\n"
            "Plus, you'll automatically earn Miller Money with every purchase — our exclusive "
            "rewards program that lets you save even more. Stop by our showroom today."
        ),
        "discount_percent": 10,
        "badge_label": "Veteran Savings",
        "badge_color": "#003366",
        "is_featured": True,
        "is_active": True,
        "sort_order": 2,
    },
    {
        "title": "ADRC Vehicle Modification Program — Funding Is Back",
        "slug": "adrc-vehicle-modification",
        "deal_type": "program",
        "short_description": "Waukesha County residents may qualify for ADRC funding toward vehicle lifts and modifications.",
        "description": (
            "ADRC vehicle lift funding is back for Waukesha County residents! "
            "Miller Mobility is a preferred provider for the ADRC Vehicle Modification Program. "
            "Qualified Waukesha County residents may receive funding to help cover the cost of "
            "vehicle lifts, hand controls, and other adaptive equipment.\n\n"
            "Our team handles the estimate and paperwork — you pay only 10% of the final "
            "modification cost. Funding is limited, so don't wait."
        ),
        "badge_label": "ADRC Funding",
        "badge_color": "#16A34A",
        "is_featured": True,
        "is_active": True,
        "sort_order": 3,
    },
    {
        "title": "Medical Equipment Rentals — Flexible Terms",
        "slug": "rentals-flexible-terms",
        "deal_type": "seasonal",
        "short_description": "Rent wheelchairs, scooters, stairlifts, lift chairs, patient lifts & ramps by the day, week, or month.",
        "description": (
            "Miller Mobility offers rentals of wheelchairs, scooters, stairlifts, lift chairs, "
            "patient lifts, ramps, and medical supplies. We serve Oconomowoc, Milwaukee, and all "
            "of Southeast Wisconsin.\n\n"
            "Rentals available for a day, week, or month! Perfect for post-surgery recovery, "
            "visiting guests, or trying equipment before you buy. Pickup in-store or we deliver."
        ),
        "badge_label": "Daily · Weekly · Monthly",
        "badge_color": "#475569",
        "is_featured": False,
        "is_active": True,
        "sort_order": 4,
    },
]


# ─── Helpers ──────────────────────────────────────────────────────────────────

def fetch_page(url: str, session: requests.Session) -> BeautifulSoup | None:
    """Fetch a URL and return a BeautifulSoup object, or None on failure."""
    try:
        resp = session.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "lxml")
    except Exception as exc:
        logger.warning("Failed to fetch %s: %s", url, exc)
        return None


def extract_image_urls(soup: BeautifulSoup, base_url: str) -> list[str]:
    """Extract all product image URLs from a page, filtering out logos/icons."""
    urls = []
    cdn_pattern = re.compile(r"cdn-website\.com|lirp\.cdn|irp\.cdn", re.I)

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        if not src:
            continue
        # Skip SVG logos, tiny icons, flags
        if any(skip in src.lower() for skip in [".svg", "logo", "flag", "icon", "bbb", "homeadvisor", "google"]):
            continue
        # Prefer CDN images (actual product photos)
        if cdn_pattern.search(src):
            full_url = urljoin(base_url, src)
            if full_url not in urls:
                urls.append(full_url)

    return urls


def guess_brand(name: str) -> str:
    """Try to extract a brand name from a product name string."""
    name_lower = name.lower()
    for brand in BRAND_PATTERNS:
        if brand.lower() in name_lower:
            return brand
    return ""


def clean_text(text: str) -> str:
    """Strip whitespace and normalize."""
    return re.sub(r"\s+", " ", text or "").strip()


def make_unique_slug(base_slug: str, existing_slugs: set) -> str:
    """Ensure uniqueness by appending a counter if needed."""
    slug = base_slug[:220]
    if slug not in existing_slugs:
        return slug
    counter = 2
    while f"{base_slug[:215]}-{counter}" in existing_slugs:
        counter += 1
    return f"{base_slug[:215]}-{counter}"


# ─── Scrapers ─────────────────────────────────────────────────────────────────

def scrape_category_page(
    session: requests.Session,
    cat_config: dict,
    category_obj: Category,
    brand_map: dict,
    existing_slugs: set,
    dry_run: bool,
    stdout,
) -> list[dict]:
    """Scrape a category page and return a list of product dicts."""
    url = urljoin(BASE_URL, cat_config["url"])
    soup = fetch_page(url, session)
    if not soup:
        return []

    products = []

    # Category hero image
    hero_imgs = extract_image_urls(soup, url)
    if hero_imgs and not dry_run:
        category_obj.image_url = hero_imgs[0]
        category_obj.save(update_fields=["image_url"])

    # Find product links — Duda website builder uses specific patterns
    product_links = set()

    # Look for product grid items
    for a in soup.find_all("a", href=True):
        href = a["href"]
        full_href = urljoin(BASE_URL, href)
        # Product pages on this site follow /product/Product-Name pattern
        if "/product/" in href and BASE_URL in full_href:
            product_links.add(full_href)

    stdout.write(f"  Found {len(product_links)} product links in {cat_config['name']}")

    for product_url in list(product_links)[:30]:  # cap per category
        prod_data = scrape_product_page(session, product_url, cat_config, brand_map)
        if prod_data:
            products.append(prod_data)
        time.sleep(0.4)  # polite crawl rate

    return products


def scrape_product_page(
    session: requests.Session,
    product_url: str,
    cat_config: dict,
    brand_map: dict,
) -> dict | None:
    """Scrape a single product page."""
    soup = fetch_page(product_url, session)
    if not soup:
        return None

    # Title
    title_el = (
        soup.find("h1")
        or soup.find("h2", class_=re.compile(r"product", re.I))
        or soup.find(class_=re.compile(r"product.*title|title.*product", re.I))
    )
    name = clean_text(title_el.get_text()) if title_el else ""
    if not name or len(name) < 4:
        return None

    # SKU
    sku = ""
    sku_el = soup.find(string=re.compile(r"SKU\s*\d+", re.I))
    if sku_el:
        m = re.search(r"SKU\s+(\w+)", sku_el, re.I)
        if m:
            sku = m.group(1)

    # Description — grab the main text block
    desc = ""
    for sel in [
        soup.find("div", class_=re.compile(r"product.*desc|description", re.I)),
        soup.find("div", class_=re.compile(r"content|body", re.I)),
        soup.find("article"),
    ]:
        if sel:
            paragraphs = sel.find_all("p")
            desc = " ".join(clean_text(p.get_text()) for p in paragraphs if len(p.get_text()) > 30)
            if desc:
                break

    short_desc = desc[:300] if desc else f"{name} — available at Miller Mobility Products."

    # Images
    images = extract_image_urls(soup, product_url)
    primary_image_url = images[0] if images else ""

    # Brand detection
    brand_name = guess_brand(name)
    brand = brand_map.get(brand_name) if brand_name else None

    return {
        "name": name,
        "sku": sku or None,
        "source_url": product_url,
        "description": desc,
        "short_description": short_desc,
        "primary_image_url": primary_image_url,
        "extra_images": images[1:6],  # up to 5 additional
        "brand": brand,
        "call_for_price": True,
        "condition": "new",
        "status": "available",
        "is_featured": False,
        "is_active": True,
        "specifications": {},
        "category_slug": cat_config["slug"],
    }


def scrape_category_images_from_homepage(session: requests.Session) -> dict[str, str]:
    """
    Scrape the homepage/products page to get category thumbnail images.
    Returns {category_slug: image_url}.
    """
    cat_images = {}
    soup = fetch_page(f"{BASE_URL}/our-products", session)
    if not soup:
        return cat_images

    # The products page has category cards with images and links
    slug_to_url = {c["slug"]: c["url"] for c in CATEGORY_CONFIG}

    for a in soup.find_all("a", href=True):
        href = a["href"]
        for slug, cat_url in slug_to_url.items():
            if cat_url.strip("/") in href:
                # Find nearest image
                img = a.find("img")
                if not img:
                    # Check parent
                    parent = a.parent
                    img = parent.find("img") if parent else None
                if img:
                    src = img.get("src") or img.get("data-src") or ""
                    if src and "cdn-website" in src:
                        cat_images[slug] = urljoin(BASE_URL, src)
                break

    return cat_images


# ─── Management command ───────────────────────────────────────────────────────

class Command(BaseCommand):
    help = "Scrape millermobility.com and populate the database with real data."

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Clear all existing data before scraping.")
        parser.add_argument("--dry-run", action="store_true", help="Print what would be saved without writing to DB.")
        parser.add_argument("--categories-only", action="store_true", help="Only update categories, skip products.")

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        clear = options["clear"]
        cats_only = options["categories_only"]

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN — nothing will be written to the database.\n"))

        if clear and not dry_run:
            self.stdout.write("Clearing existing data...")
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Brand.objects.all().delete()
            Category.objects.all().delete()
            Deal.objects.all().delete()
            self.stdout.write(self.style.WARNING("  Done.\n"))

        session = requests.Session()
        session.headers.update(HEADERS)

        # ── Step 1: seed / update brands ──────────────────────────────────────
        self.stdout.write("Seeding brands...")
        brand_map = {}
        brand_data = [
            {"name": "Bruno Independent Living Aids", "website": "https://www.bruno.com"},
            {"name": "Handicare", "website": "https://www.handicare.com"},
            {"name": "Harmar", "website": "https://www.harmar.com"},
            {"name": "Pride Mobility", "website": "https://www.pridemobility.com"},
            {"name": "Golden Technologies", "website": "https://goldentech.com"},
            {"name": "Drive Medical", "website": "https://www.drivemedical.com"},
            {"name": "Journey Health & Lifestyle", "website": "https://journeyhealth.com"},
            {"name": "Forcemech", "website": "https://www.forcemech.com"},
            {"name": "Rhythm Healthcare", "website": "https://www.rhythmhealthcare.com"},
            {"name": "Strongback", "website": "https://www.strongbackchairs.com"},
            {"name": "Vive Health", "website": "https://vivehealth.com"},
            {"name": "EZ-ACCESS", "website": "https://www.ez-access.com"},
            {"name": "BestCare", "website": "https://www.bestcare-med.com"},
            {"name": "Stander", "website": "https://www.stander.com"},
            {"name": "Healthcraft", "website": "https://www.healthcraftproducts.com"},
            {"name": "IndeeLift", "website": "https://indeelift.com"},
        ]
        for bd in brand_data:
            if not dry_run:
                brand, _ = Brand.objects.get_or_create(name=bd["name"], defaults=bd)
                brand_map[bd["name"]] = brand
                # Allow partial match (e.g. "Bruno" -> "Bruno Independent Living Aids")
                for pattern in BRAND_PATTERNS:
                    if pattern in bd["name"]:
                        brand_map[pattern] = brand
            self.stdout.write(f"  Brand: {bd['name']}")

        # ── Step 2: seed / update categories ──────────────────────────────────
        self.stdout.write("\nSeeding categories...")
        cat_image_map = scrape_category_images_from_homepage(session)
        category_map = {}

        for cat_cfg in CATEGORY_CONFIG:
            if dry_run:
                self.stdout.write(f"  [DRY] Category: {cat_cfg['name']}")
                continue

            image_url = cat_image_map.get(cat_cfg["slug"], "")
            cat, created = Category.objects.update_or_create(
                slug=cat_cfg["slug"],
                defaults={
                    "name": cat_cfg["name"],
                    "description": cat_cfg["description"],
                    "icon": cat_cfg["icon"],
                    "sort_order": cat_cfg["sort_order"],
                    "image_url": image_url,
                },
            )
            category_map[cat_cfg["slug"]] = cat
            self.stdout.write(f"  {'Created' if created else 'Updated'}: {cat.name}")

        if cats_only:
            self.stdout.write(self.style.SUCCESS("\nCategories updated. Skipping products (--categories-only)."))
            return

        # ── Step 3: scrape products per category ──────────────────────────────
        self.stdout.write("\nScraping products from millermobility.com...")
        existing_slugs = set(Product.objects.values_list("slug", flat=True))
        total_created = 0
        total_updated = 0

        for cat_cfg in CATEGORY_CONFIG:
            self.stdout.write(f"\n  → {cat_cfg['name']} ({BASE_URL + cat_cfg['url']})")
            cat_obj = category_map.get(cat_cfg["slug"])
            if not cat_obj and not dry_run:
                self.stdout.write(self.style.WARNING("    Category not found in DB, skipping."))
                continue

            scraped = scrape_category_page(
                session=session,
                cat_config=cat_cfg,
                category_obj=cat_obj,
                brand_map=brand_map,
                existing_slugs=existing_slugs,
                dry_run=dry_run,
                stdout=self.stdout,
            )

            for prod_data in scraped:
                name = prod_data["name"]
                if dry_run:
                    self.stdout.write(f"    [DRY] Product: {name[:80]}")
                    continue

                base_slug = slugify(name)[:210]
                slug = make_unique_slug(base_slug, existing_slugs)
                existing_slugs.add(slug)

                extra_images = prod_data.pop("extra_images", [])
                prod_data.pop("category_slug", None)

                product, created = Product.objects.update_or_create(
                    slug=slug,
                    defaults={
                        **prod_data,
                        "slug": slug,
                        "category": cat_obj,
                    },
                )

                # Sync extra images
                if extra_images:
                    product.images.all().delete()
                    for i, img_url in enumerate(extra_images):
                        ProductImage.objects.create(
                            product=product,
                            image_url=img_url,
                            is_primary=(i == 0),
                            sort_order=i,
                        )

                if created:
                    total_created += 1
                else:
                    total_updated += 1
                self.stdout.write(f"    {'✓ Created' if created else '↻ Updated'}: {name[:70]}")

            time.sleep(1)  # polite pause between categories

        # ── Step 4: seed fallback products if scraping yielded nothing ────────
        # This ensures the app always has content even if scraping is blocked.
        if total_created == 0 and not dry_run:
            self.stdout.write(self.style.WARNING(
                "\nNo products scraped from live site. Seeding fallback product data..."
            ))
            _seed_fallback_products(category_map, brand_map, existing_slugs, self.stdout)

        # ── Step 5: seed deals ─────────────────────────────────────────────────
        self.stdout.write("\nSeeding deals...")
        for deal_cfg in DEALS_DATA:
            if dry_run:
                self.stdout.write(f"  [DRY] Deal: {deal_cfg['title']}")
                continue
            deal, created = Deal.objects.update_or_create(
                slug=deal_cfg["slug"],
                defaults=deal_cfg,
            )
            self.stdout.write(f"  {'Created' if created else 'Updated'}: {deal.title}")

        if not dry_run:
            self.stdout.write(self.style.SUCCESS(
                f"\n✅ Done! Created {total_created} products, updated {total_updated}."
            ))
        else:
            self.stdout.write(self.style.SUCCESS("\n✅ Dry run complete."))


# ─── Fallback seed data (used when live scraping is blocked) ──────────────────

def _seed_fallback_products(category_map, brand_map, existing_slugs, stdout):
    """
    Insert a comprehensive set of products matching what's on millermobility.com.
    Used as a fallback when the live site cannot be scraped.
    """
    FALLBACK = [
        # ── Stairlifts ──
        {
            "name": "Bruno Elan Indoor Straight Stairlift SRE-3050",
            "sku": "00208",
            "category": "stairlifts",
            "brand": "Bruno",
            "short_description": "Space-saving straight stairlift — folds to 13.5\" wide, 300 lb capacity.",
            "description": "The Bruno Elan is Bruno's most popular straight stairlift. Features a foldable rail, foldable footrest, and power seat swivel. Handles up to 300 lbs. Installed by factory-trained technicians in a couple of hours. Lifetime warranty on drive train.",
            "primary_image_url": "https://lirp.cdn-website.com/6306fa56/dms3rep/multi/opt/-3750+Installed+%283%29-3fccc34a-1920w.png",
            "source_url": "https://www.millermobility.com/product/Bruno-Elan-Indoor-Straight-Stairlift-SRE-3050-300-lb-Lift-Capacity",
            "call_for_price": True,
            "is_featured": True,
            "specifications": {"weight_capacity_lbs": 300, "folded_width_inches": 13.5, "rail_type": "Straight", "power_seat_swivel": True, "warranty": "Lifetime on drive train"},
        },
        {
            "name": "Bruno Elite Indoor Straight Stairlift SRE-2010",
            "sku": "00211",
            "category": "stairlifts",
            "brand": "Bruno",
            "short_description": "Heavy-duty straight stairlift — 400 lb capacity, wider seat.",
            "description": "The Bruno Elite offers a 400 lb weight capacity and a wider, more comfortable seat. Features optional power folding rail for tighter landings.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/product/Bruno-Elite-Indoor-Straight-Stairlift-SRE-2010-400-lb-Lift-Capacity",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"weight_capacity_lbs": 400, "rail_type": "Straight"},
        },
        {
            "name": "Bruno Elite Indoor Curved Stairlift CRE-2110",
            "sku": "00209",
            "category": "stairlifts",
            "brand": "Bruno",
            "short_description": "Custom curved rail stairlift — 400 lb, handles 90° and 180° turns.",
            "description": "Bruno's curved stairlift uses a durable all-steel rail custom-fabricated to your exact staircase — including 90°, 180° turns, and landings.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/product/Bruno-Elite-Indoor-Curved-Stairlift-CRE-2110-400-lb-Lift-Capacity",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"weight_capacity_lbs": 400, "rail_type": "Curved — custom fabricated"},
        },
        {
            "name": "Handicare 1100 Straight Stairlift",
            "sku": "HAN-1100",
            "category": "stairlifts",
            "brand": "Handicare",
            "short_description": "Slim single-tube rail straight stairlift — 300 lb capacity.",
            "description": "The Handicare 1100 uses a single-tube rail system that hugs the wall and leaves maximum stair space free.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/stairlifts",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"weight_capacity_lbs": 300, "rail_type": "Straight — single tube"},
        },
        {
            "name": "Harmar SL600HD Heavy-Duty Stairlift",
            "sku": "HAR-SL600HD",
            "category": "stairlifts",
            "brand": "Harmar",
            "short_description": "Super heavy-duty straight stairlift — 600 lb capacity.",
            "description": "The Harmar SL600HD is designed for bariatric users with a 600 lb weight capacity.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/stairlifts",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"weight_capacity_lbs": 600, "application": "Bariatric"},
        },
        # ── Scooters ──
        {
            "name": "Pride Go-Go Super Portable Folding Scooter SC15",
            "sku": "PRI-SC15",
            "category": "mobility-scooters",
            "brand": "Pride Mobility",
            "short_description": "Foldable 41.6 lb scooter with lithium battery — 300 lb capacity.",
            "description": "The Go-Go Super Portable weighs just 41.6 lbs and features a lithium battery for easy air travel. Folds quickly for compact storage.",
            "primary_image_url": "https://lirp.cdn-website.com/6306fa56/dms3rep/multi/opt/SC15+%281%29-1920w.webp",
            "source_url": "https://www.millermobility.com/mobility-scooters",
            "call_for_price": True,
            "is_featured": True,
            "specifications": {"weight_capacity_lbs": 300, "weight_lbs": 41.6, "battery": "Lithium", "folds": True},
        },
        {
            "name": "Golden Buzzaround EX 4-Wheel Heavy Duty Scooter GB148",
            "sku": "GOL-GB148",
            "category": "mobility-scooters",
            "brand": "Golden Technologies",
            "short_description": "Heavy-duty long-range 4-wheel scooter that disassembles easily.",
            "description": "The Buzzaround EX offers extended range and a heavy-duty frame while still disassembling easily for car transport.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/mobility-scooters",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"wheels": 4, "duty": "Heavy"},
        },
        {
            "name": "Pride Go-Go Elite Traveller 3-Wheel Scooter SC40E",
            "sku": "PRI-SC40E",
            "category": "mobility-scooters",
            "brand": "Pride Mobility",
            "short_description": "Classic 3-wheel travel scooter — disassembles into 5 pieces under 14 lbs each.",
            "description": "Pride's best-selling travel scooter disassembles into five lightweight pieces, heaviest under 14 lbs. Tight turning radius for indoor use.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/mobility-scooters",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"wheels": 3, "pieces": 5},
        },
        # ── Power Wheelchairs ──
        {
            "name": "Pride Jazzy Carbon 27X Power Wheelchair",
            "sku": "PRI-JAZZY-27X",
            "category": "power-wheelchairs",
            "brand": "Pride Mobility",
            "short_description": "Carbon fiber power chair — extended range, higher bariatric capacity, folds for travel.",
            "description": "The Jazzy Carbon 27X combines a lightweight carbon fiber frame with extended-range batteries and higher weight capacity.",
            "primary_image_url": "https://lirp.cdn-website.com/6306fa56/dms3rep/multi/opt/gogocarbonfamily+%281%29-1920w.jpg",
            "source_url": "https://www.millermobility.com/power-wheelchairs",
            "call_for_price": True,
            "is_featured": True,
            "specifications": {"frame": "Carbon fiber", "folds": True},
        },
        {
            "name": "Journey Air Elite Folding Power Chair",
            "sku": "JOU-AIR-ELITE",
            "category": "power-wheelchairs",
            "brand": "Journey Health",
            "short_description": "Ultra-lightweight at just 26 lbs — carbon fiber foldable electric wheelchair.",
            "description": "The Journey Air Elite weighs only 26 lbs, making it one of the lightest power chairs available. Carbon fiber frame folds in seconds.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/power-wheelchairs",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"weight_lbs": 26, "frame": "Carbon fiber", "folds": True},
        },
        # ── Lift Recliners ──
        {
            "name": "Pride VivaLift! Tranquil 2 Power Lift Recliner PLR935",
            "sku": "PRI-PLR935",
            "category": "lift-chairs-power-recliners",
            "brand": "Pride Mobility",
            "short_description": "4-position power lift recliner with memory foam chaise pad.",
            "description": "The VivaLift Tranquil 2 features a plush memory foam chaise pad and 4-position recline mechanism. Available in multiple fabric options.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/lift-chairs-power-recliners",
            "call_for_price": True,
            "is_featured": True,
            "specifications": {"positions": 4, "padding": "Memory foam chaise pad"},
        },
        {
            "name": "Golden EZ Sleeper Slim Power Lift Recliner PR764",
            "sku": "GOL-PR764",
            "category": "lift-chairs-power-recliners",
            "brand": "Golden Technologies",
            "short_description": "Slim-profile lift recliner with Twilight full-recline and sleeper function.",
            "description": "The Golden EZ Sleeper Slim is designed for smaller spaces without sacrificing comfort. The Twilight system allows a fully flat sleeping position.",
            "primary_image_url": "https://lirp.cdn-website.com/6306fa56/dms3rep/multi/opt/rec-pr764-1920w.webp",
            "source_url": "https://www.millermobility.com/lift-chairs-power-recliners",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"profile": "Slim", "sleeper": True},
        },
        # ── Wheelchairs ──
        {
            "name": "Strongback Comfort 24 Lightweight Folding Wheelchair",
            "sku": "STR-COMFORT-24",
            "category": "wheelchairs-transport-chairs",
            "brand": "Strongback",
            "short_description": "Lightweight folding wheelchair with patented ergonomic lumbar back support.",
            "description": "The Strongback Comfort 24 features a patented back support system that improves posture and reduces pain. Lightweight aluminum frame.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/wheelchairs-transport-chairs",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"back_support": "Patented lumbar ergonomic", "frame": "Lightweight aluminum"},
        },
        # ── Walkers ──
        {
            "name": "Rhythm Rimor LT Rollator with 10 inch Chrome Front Wheels",
            "sku": "RHY-970BK",
            "category": "walkers-rollators",
            "brand": "Rhythm Healthcare",
            "short_description": "10-inch chrome front wheels, padded seat, easy fold-up outdoor rollator.",
            "description": "The Rimor LT features large 10-inch chrome front wheels for smooth rolling on outdoor surfaces, padded seat for resting, and loop brakes.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/walkers-rollators",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"front_wheel_size_inches": 10, "folds": True},
        },
        # ── Vehicle Lifts ──
        {
            "name": "Bruno Joey Platform Interior Vehicle Lift VSL-4400",
            "sku": "BRU-VSL-4400",
            "category": "vehicle-lifts",
            "brand": "Bruno",
            "short_description": "Interior platform vehicle lift for minivans and SUVs — stores device inside.",
            "description": "The Bruno Joey interior platform lift raises your scooter or power wheelchair into the interior of your vehicle through the rear hatch.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/vehicle-lifts",
            "call_for_price": True,
            "is_featured": True,
            "specifications": {"mount_type": "Interior rear hatch", "compatible_with": "Minivans, SUVs"},
        },
        {
            "name": "Bruno Out-Sider Platform Vehicle Lift ASL-275",
            "sku": "BRU-ASL-275",
            "category": "vehicle-lifts",
            "brand": "Bruno",
            "short_description": "Exterior hitch-mounted platform lift — carries scooter/wheelchair outside vehicle.",
            "description": "The Bruno Out-Sider attaches to your vehicle's trailer hitch and lifts your scooter or power wheelchair onto an exterior platform.",
            "primary_image_url": "https://lirp.cdn-website.com/6306fa56/dms3rep/multi/opt/car-lift-asl275-1920w.jpg",
            "source_url": "https://www.millermobility.com/vehicle-lifts",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"mount_type": "Exterior hitch mount"},
        },
        # ── Patient Lifts ──
        {
            "name": "BestCare PL400 Full Body Electric Patient Lift",
            "sku": "BEST-PL400",
            "category": "patient-lifts",
            "brand": "BestCare",
            "short_description": "Full-body electric patient lift with ergonomic hand control — 400 lb capacity.",
            "description": "The BestCare PL400 provides powered full-body patient transfers between bed, wheelchair, bath, and more. Ergonomic one-handed hand control.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/patient-lifts",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"type": "Full-body electric", "weight_capacity_lbs": 400},
        },
        # ── Ramps ──
        {
            "name": "EZ-ACCESS GATEWAY 3G Solid Surface Portable Ramp",
            "sku": "EZA-GATEWAY-3G",
            "category": "ramps",
            "brand": "EZ-ACCESS",
            "short_description": "Solid-surface portable aluminum ramp with 2-line handrails and self-adjusting transition plates.",
            "description": "The EZ-ACCESS GATEWAY 3G features a solid non-slip aluminum surface, self-adjusting bottom transition plates, and included 2-line handrails. ADA-compliant.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/ramps",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"surface": "Solid non-slip textured aluminum", "handrails": "2-line included"},
        },
        {
            "name": "EZ-ACCESS Suitcase Singlefold Portable Ramp",
            "sku": "EZA-SINGLEFOLD",
            "category": "ramps",
            "brand": "EZ-ACCESS",
            "short_description": "Single-fold suitcase ramp — slip-resistant surface, self-adjusting transition plates.",
            "description": "Folds in half like a suitcase for easy carrying. Slip-resistant surface and self-adjusting bottom transition plates.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/ramps",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"fold_type": "Singlefold suitcase"},
        },
        # ── Beds ──
        {
            "name": "Golden Passport Hi-Low Adjustable Bed with Dual-Zone Vibrating Massage",
            "sku": "GOL-PASSPORT-BED",
            "category": "beds",
            "brand": "Golden Technologies",
            "short_description": "Hi-low adjustable residential bed with dual-zone vibrating massage.",
            "description": "The Golden Passport is a residential hi-low adjustable bed that raises and lowers for easy transfers. Dual-zone vibrating massage adds therapeutic comfort.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/beds",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"adjustment": "Hi-Low electric", "massage": "Dual-zone vibrating"},
        },
        # ── Vertical Platform Lifts ──
        {
            "name": "Bruno Residential Vertical Platform Lift",
            "sku": "BRU-VPL",
            "category": "vertical-platform-lifts",
            "brand": "Bruno",
            "short_description": "Residential vertical platform lift for porch, deck, and home entry access.",
            "description": "The Bruno Residential VPL provides safe, smooth access to raised porches, decks, and home entries. Features fold-down ramp, safety sensors, emergency stop, and battery backup.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/vertical-platform-lifts-home-elevators",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"battery_backup": True, "safety_sensors": True},
        },
        # ── Security Poles ──
        {
            "name": "Stander Wonder Pole",
            "sku": "STA-1100-W",
            "category": "security-poles",
            "brand": "Stander",
            "short_description": "Floor-to-ceiling security pole — installs without tools in minutes, 300 lb capacity.",
            "description": "The Stander Wonder Pole installs between floor and ceiling by turning a jackscrew — no drilling required. Must align with a ceiling joist.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/security-poles",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"weight_capacity_lbs": 300, "installation": "Tool-free jackscrew"},
        },
        {
            "name": "Healthcraft Bariatric SuperBar Floor-to-Ceiling Grab Bar 8 ft",
            "sku": "HCR-SUPERBAR-450",
            "category": "security-poles",
            "brand": "Healthcraft",
            "short_description": "8 ft bariatric floor-to-ceiling grab bar — 450 lb capacity.",
            "description": "The Healthcraft Bariatric SuperBar is an 8-foot floor-to-ceiling grab bar with 450 lb capacity. Ideal for bedroom, kitchen, bath, and shower safety.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/security-poles",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"weight_capacity_lbs": 450, "height_ft": 8},
        },
        # ── Tables & Trays ──
        {
            "name": "Stander Assist-A-Tray Table",
            "sku": "STA-ASSIST-TRAY",
            "category": "tables-trays",
            "brand": "Stander",
            "short_description": "Lift-chair side tray with standing handle assist and swivel surface.",
            "description": "The Stander Assist-A-Tray attaches beside a lift chair or recliner and provides a swiveling surface for meals and activities plus a sturdy handle to help users stand up.",
            "primary_image_url": "",
            "source_url": "https://www.millermobility.com/tables-trays",
            "call_for_price": True,
            "is_featured": False,
            "specifications": {"swivel": True, "standing_assist": True},
        },
    ]

    for prod_data in FALLBACK:
        cat_slug = prod_data.pop("category")
        brand_key = prod_data.pop("brand")
        cat_obj = category_map.get(cat_slug)
        brand_obj = brand_map.get(brand_key)

        if not cat_obj:
            stdout.write(f"  SKIP (no category): {prod_data['name'][:60]}")
            continue

        slug = make_unique_slug(slugify(prod_data["name"])[:210], existing_slugs)
        existing_slugs.add(slug)

        product, created = Product.objects.update_or_create(
            slug=slug,
            defaults={
                **prod_data,
                "slug": slug,
                "category": cat_obj,
                "brand": brand_obj,
                "condition": "new",
                "status": "available",
                "is_active": True,
            },
        )
        stdout.write(f"  {'✓' if created else '↻'} {product.name[:70]}")