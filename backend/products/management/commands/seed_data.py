"""
Management command to populate the database with sample Miller Mobility data.

Usage:
    python manage.py seed_data           # Add seed data (safe to re-run)
    python manage.py seed_data --clear   # Wipe and reseed
"""

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, Brand, Product, VehicleConversion
from deals.models import Deal


CATEGORIES = [
    {"name": "Wheelchair Accessible Vehicles", "slug": "wheelchair-accessible-vehicles", "icon": "car", "sort_order": 1, "description": "New and pre-owned wheelchair accessible vans and SUVs with ramp or lift conversions."},
    {"name": "Power Wheelchairs", "slug": "power-wheelchairs", "icon": "accessibility", "sort_order": 2, "description": "Electric powered wheelchairs for indoor and outdoor use."},
    {"name": "Mobility Scooters", "slug": "scooters", "icon": "motorcycle", "sort_order": 3, "description": "3 and 4 wheel mobility scooters for everyday independence."},
    {"name": "Vehicle Lifts", "slug": "lifts", "icon": "upgrade", "sort_order": 4, "description": "Platform, under-vehicle, and inside-vehicle lift systems."},
    {"name": "Ramps", "slug": "ramps", "icon": "trending_flat", "sort_order": 5, "description": "Portable and semi-permanent wheelchair ramps for home and vehicle."},
    {"name": "Accessories", "slug": "accessories", "icon": "category", "sort_order": 6, "description": "Hand controls, swivel seats, tie-downs, and more."},
]

BRANDS = [
    {"name": "BraunAbility", "website": "https://www.braunability.com"},
    {"name": "VMI (Vantage Mobility)", "website": "https://www.vantagemobility.com"},
    {"name": "Mobility Ventures", "website": "https://www.mobilityadventures.com"},
    {"name": "Pride Mobility", "website": "https://www.pridemobility.com"},
    {"name": "Permobil", "website": "https://www.permobil.com"},
    {"name": "Quantum (Pride)", "website": "https://www.pridemobility.com"},
    {"name": "Drive Medical", "website": "https://www.drivemedical.com"},
    {"name": "Bruno Independent Living Aids", "website": "https://www.bruno.com"},
]

PRODUCTS = [
    # ── WAVs ──────────────────────────────────────────────────────────────────
    {
        "name": "2023 Chrysler Pacifica BraunAbility Foldout Ramp",
        "category": "wheelchair-accessible-vehicles",
        "brand": "BraunAbility",
        "short_description": "In-stock Pacifica with BraunAbility fold-out ramp, 30\" door opening, 56\" interior height.",
        "description": "This certified pre-owned 2023 Chrysler Pacifica features the BraunAbility fold-out ramp conversion with a 56-inch lowered interior height and a 30-inch door opening width. The in-floor ramp deploys smoothly with a single button press. Driver or passenger can remain in their wheelchair. Only 18,400 miles.",
        "price": 54995,
        "msrp": 62000,
        "condition": "certified",
        "status": "available",
        "is_featured": True,
        "specifications": {
            "engine": "3.6L V6 Pentastar",
            "transmission": "9-Speed Automatic",
            "seating_capacity": 5,
            "fuel_type": "Gasoline",
        },
        "conversion": {
            "year": 2023, "make": "Chrysler", "model": "Pacifica", "trim": "Touring L",
            "mileage": 18400, "color": "Granite Crystal Metallic",
            "body_style": "minivan", "entry_type": "in_floor",
            "ramp_length_inches": 54, "lowered_floor_inches": 14,
            "door_opening_height_inches": 56, "door_opening_width_inches": 30,
            "driver_can_remain_in_wheelchair": True,
            "passenger_positions": 1, "conversion_brand": "BraunAbility",
        },
    },
    {
        "name": "2022 Toyota Sienna VMI Northstar In-Floor Ramp",
        "category": "wheelchair-accessible-vehicles",
        "brand": "VMI (Vantage Mobility)",
        "short_description": "Low-mileage Sienna hybrid WAV with VMI Northstar in-floor ramp system.",
        "description": "The 2022 Toyota Sienna Hybrid with VMI Northstar conversion offers outstanding fuel efficiency alongside full wheelchair accessibility. Features a 14-inch lowered floor, 57-inch interior height clearance, and VMI's industry-leading in-floor ramp.",
        "price": 61500,
        "msrp": 68000,
        "condition": "used",
        "status": "available",
        "is_featured": True,
        "specifications": {
            "engine": "2.5L Hybrid",
            "mpg": "35 city / 36 highway",
            "seating_capacity": 4,
            "fuel_type": "Hybrid",
        },
        "conversion": {
            "year": 2022, "make": "Toyota", "model": "Sienna", "trim": "XLE",
            "mileage": 24100, "color": "Blizzard Pearl White",
            "body_style": "minivan", "entry_type": "in_floor",
            "ramp_length_inches": 56, "lowered_floor_inches": 14,
            "door_opening_height_inches": 57, "door_opening_width_inches": 32,
            "driver_can_remain_in_wheelchair": True,
            "passenger_positions": 1, "conversion_brand": "VMI (Vantage Mobility)",
        },
    },
    {
        "name": "2024 Chrysler Pacifica Rear-Entry BraunAbility",
        "category": "wheelchair-accessible-vehicles",
        "brand": "BraunAbility",
        "short_description": "Brand new rear-entry Pacifica, ideal for passengers who remain in wheelchair.",
        "description": "New 2024 Chrysler Pacifica with BraunAbility rear-entry fold-out ramp. Rear entry design maximizes interior space and is ideal for passengers who stay in their wheelchair during travel. Includes remote-controlled ramp and tie-down system.",
        "price": 72900,
        "call_for_price": False,
        "condition": "new",
        "status": "available",
        "is_featured": True,
        "specifications": {
            "engine": "3.6L V6",
            "warranty": "3 years / 36,000 miles",
            "seating_capacity": 5,
        },
        "conversion": {
            "year": 2024, "make": "Chrysler", "model": "Pacifica", "trim": "Touring",
            "mileage": 8, "color": "Bright White",
            "body_style": "minivan", "entry_type": "rear_entry",
            "ramp_length_inches": 60, "lowered_floor_inches": 14,
            "door_opening_height_inches": 54, "door_opening_width_inches": 34,
            "driver_can_remain_in_wheelchair": False,
            "passenger_positions": 1, "conversion_brand": "BraunAbility",
        },
    },
    # ── Power Wheelchairs ────────────────────────────────────────────────────
    {
        "name": "Permobil M3 Corpus Power Wheelchair",
        "category": "power-wheelchairs",
        "brand": "Permobil",
        "short_description": "Mid-wheel drive power chair with advanced seating and tilt-in-space.",
        "description": "The Permobil M3 Corpus is a premium mid-wheel drive power wheelchair featuring power tilt, recline, and leg rest functions. With 6-wheel suspension and a tight turning radius, it excels in both indoor and outdoor environments.",
        "price": 8950,
        "msrp": 10200,
        "condition": "new",
        "status": "available",
        "is_featured": False,
        "specifications": {
            "drive_type": "Mid-Wheel Drive",
            "max_speed_mph": 6,
            "range_miles": 15,
            "weight_capacity_lbs": 300,
            "seat_width_inches": "16–22 (adjustable)",
            "turning_radius_inches": 20,
        },
    },
    {
        "name": "Quantum Q6 Edge 3 Power Chair",
        "category": "power-wheelchairs",
        "brand": "Quantum (Pride)",
        "short_description": "Front-wheel drive Q6 Edge with iLevel seat elevation — stand-height driving.",
        "description": "The Q6 Edge 3 features Pride's iLevel technology, allowing users to raise the seat up to 12 inches while driving at full speed. Active-Trac suspension handles uneven terrain with ease.",
        "price": 7400,
        "condition": "certified",
        "status": "available",
        "is_featured": False,
        "specifications": {
            "drive_type": "Front-Wheel Drive",
            "max_speed_mph": 6,
            "range_miles": 18,
            "weight_capacity_lbs": 300,
            "seat_elevation_inches": 12,
        },
    },
    # ── Scooters ─────────────────────────────────────────────────────────────
    {
        "name": "Pride Mobility Go-Go Elite Traveller 3-Wheel",
        "category": "scooters",
        "brand": "Pride Mobility",
        "short_description": "Ultra-portable travel scooter that disassembles into 5 lightweight pieces.",
        "description": "The Go-Go Elite Traveller is Pride's best-selling travel scooter. It breaks down into five pieces — the heaviest weighing just 13.6 lbs — making it perfect for air travel, cruises, and everyday errands.",
        "price": 1099,
        "msrp": 1299,
        "condition": "new",
        "status": "available",
        "is_featured": False,
        "specifications": {
            "weight_capacity_lbs": 300,
            "max_speed_mph": 4,
            "range_miles": 9,
            "heaviest_piece_lbs": 13.6,
            "turning_radius_inches": 33,
        },
    },
    {
        "name": "Drive Medical Scout Compact Travel Power Scooter",
        "category": "scooters",
        "brand": "Drive Medical",
        "short_description": "4-wheel scooter with flat-free tires, perfect for outdoor use.",
        "description": "The Drive Medical Scout 4 combines stability and portability. Flat-free tires mean no flats outdoors, and the delta tiller with wraparound armrests provides comfortable control.",
        "price": 849,
        "condition": "new",
        "status": "available",
        "is_featured": False,
        "specifications": {
            "weight_capacity_lbs": 300,
            "max_speed_mph": 5,
            "range_miles": 9,
            "turning_radius_inches": 52,
            "tire_type": "Flat-free",
        },
    },
    # ── Lifts ────────────────────────────────────────────────────────────────
    {
        "name": "Bruno Outside Scooter / Wheelchair Lift — Model ASL-250",
        "category": "lifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Outside platform lift for SUVs and minivans, 750 lb capacity.",
        "description": "Bruno's ASL-250 outside lift attaches to your vehicle's trailer hitch and raises your scooter or power wheelchair automatically. Works with most scooters and wheelchairs up to 750 lbs combined.",
        "price": 2995,
        "condition": "new",
        "status": "available",
        "is_featured": False,
        "specifications": {
            "capacity_lbs": 750,
            "platform_size_inches": "28 × 36",
            "compatible_with": "Trailer hitch 1.25\" or 2\"",
            "power": "12V DC vehicle power",
        },
    },
]

DEALS = [
    {
        "title": "Spring WAV Clearance — Save Up to $5,000",
        "slug": "spring-wav-clearance",
        "deal_type": "clearance",
        "short_description": "Limited-time savings on select certified pre-owned WAVs in stock now.",
        "description": "Take advantage of our biggest sale of the year. Select certified pre-owned wheelchair accessible vehicles are reduced by up to $5,000 while supplies last. All vehicles include our 90-day limited warranty.",
        "discount_amount": 5000,
        "badge_label": "Save $5,000",
        "badge_color": "#E63946",
        "is_featured": True,
        "is_active": True,
    },
    {
        "title": "0% APR for 36 Months on New WAVs",
        "slug": "zero-apr-new-wavs",
        "deal_type": "financing",
        "short_description": "Qualified buyers can finance any new WAV at 0% APR for 36 months.",
        "description": "We've partnered with our preferred lenders to offer 0% APR financing for 36 months on all new wheelchair accessible vehicles. Subject to credit approval. Ask our team for details.",
        "financing_apr": 0,
        "financing_months": 36,
        "badge_label": "0% APR",
        "badge_color": "#003366",
        "is_featured": True,
        "is_active": True,
    },
    {
        "title": "Trade-In Bonus — Extra $1,000 Toward Your Next Vehicle",
        "slug": "trade-in-bonus",
        "deal_type": "trade_in",
        "short_description": "Trade in your current WAV and receive an extra $1,000 bonus on top of appraised value.",
        "description": "When you trade in any wheelchair accessible vehicle toward the purchase of a new or certified pre-owned WAV, Miller Mobility will add an extra $1,000 on top of your vehicle's appraised trade-in value.",
        "discount_amount": 1000,
        "badge_label": "+$1,000 Trade Bonus",
        "badge_color": "#16A34A",
        "is_featured": False,
        "is_active": True,
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample Miller Mobility products, categories, brands, and deals."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing seed data before re-seeding.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data…")
            VehicleConversion.objects.all().delete()
            Product.objects.all().delete()
            Brand.objects.all().delete()
            Category.objects.all().delete()
            Deal.objects.all().delete()
            self.stdout.write(self.style.WARNING("  Cleared."))

        # ── Categories ────────────────────────────────────────────────────────
        self.stdout.write("Seeding categories…")
        category_map = {}
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(
                slug=cat_data["slug"],
                defaults=cat_data,
            )
            category_map[cat_data["slug"]] = cat
            verb = "Created" if created else "Exists"
            self.stdout.write(f"  {verb}: {cat.name}")

        # ── Brands ────────────────────────────────────────────────────────────
        self.stdout.write("Seeding brands…")
        brand_map = {}
        for brand_data in BRANDS:
            brand, created = Brand.objects.get_or_create(
                name=brand_data["name"],
                defaults=brand_data,
            )
            brand_map[brand_data["name"]] = brand
            verb = "Created" if created else "Exists"
            self.stdout.write(f"  {verb}: {brand.name}")

        # ── Products ──────────────────────────────────────────────────────────
        self.stdout.write("Seeding products…")
        for p_data in PRODUCTS:
            conversion_data = p_data.pop("conversion", None)
            category_slug = p_data.pop("category")
            brand_name = p_data.pop("brand")

            slug = slugify(p_data["name"])[:50]
            product, created = Product.objects.get_or_create(
                slug=slug,
                defaults={
                    **p_data,
                    "category": category_map[category_slug],
                    "brand": brand_map.get(brand_name),
                    "slug": slug,
                },
            )

            if created and conversion_data:
                VehicleConversion.objects.create(product=product, **conversion_data)

            verb = "Created" if created else "Exists"
            self.stdout.write(f"  {verb}: {product.name}")

        # ── Deals ─────────────────────────────────────────────────────────────
        self.stdout.write("Seeding deals…")
        for deal_data in DEALS:
            deal, created = Deal.objects.get_or_create(
                slug=deal_data["slug"],
                defaults=deal_data,
            )
            verb = "Created" if created else "Exists"
            self.stdout.write(f"  {verb}: {deal.title}")

        self.stdout.write(self.style.SUCCESS("\nSeed complete! Run the server and visit /api/products/ to verify."))