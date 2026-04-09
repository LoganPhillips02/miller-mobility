"""
Management command to populate the database with Miller Mobility product data
scraped from https://www.millermobility.com/our-products

Usage:
    python manage.py seed_data           # Add seed data (safe to re-run)
    python manage.py seed_data --clear   # Wipe and reseed
"""

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, Brand, Product, VehicleConversion
from deals.models import Deal


# ---------------------------------------------------------------------------
# CATEGORIES  (13 categories matching millermobility.com/our-products)
# ---------------------------------------------------------------------------
CATEGORIES = [
    {"name": "Stairlifts",                       "slug": "stairlifts",                  "icon": "stairs",        "sort_order": 1,  "description": "Straight and curved stairlift systems for safe, easy access to every floor of your home."},
    {"name": "Mobility Scooters",                "slug": "mobility-scooters",            "icon": "motorcycle",    "sort_order": 2,  "description": "3- and 4-wheel electric mobility scooters for indoor and outdoor independence."},
    {"name": "Power Wheelchairs",                "slug": "power-wheelchairs",            "icon": "accessibility", "sort_order": 3,  "description": "Lightweight, foldable, and full-sized electric power wheelchairs for indoor and outdoor use."},
    {"name": "Power Lift Recliners",             "slug": "lift-chairs-power-recliners",  "icon": "chair",         "sort_order": 4,  "description": "Power lift recliners that gently raise you to a standing position with the press of a button."},
    {"name": "Wheelchairs & Transport Chairs",   "slug": "wheelchairs-transport-chairs", "icon": "wheelchair",    "sort_order": 5,  "description": "Manual wheelchairs and lightweight transport chairs for everyday mobility needs."},
    {"name": "Walkers & Rollators",              "slug": "walkers-rollators",            "icon": "walk",          "sort_order": 6,  "description": "Standard walkers, 4-wheel rollators with seats, and bariatric options."},
    {"name": "Vehicle Lifts",                    "slug": "vehicle-lifts",                "icon": "car",           "sort_order": 7,  "description": "Interior and exterior vehicle lifts for transporting scooters and power chairs."},
    {"name": "Patient Lifts",                    "slug": "patient-lifts",                "icon": "medical",       "sort_order": 8,  "description": "Full-body, sit-to-stand, and ceiling patient lifts for safe, dignified transfers."},
    {"name": "Ramps",                            "slug": "ramps",                        "icon": "trending_flat", "sort_order": 9,  "description": "Portable, folding, and modular aluminum wheelchair ramps for home, vehicle, and business."},
    {"name": "Beds",                             "slug": "beds",                         "icon": "bed",           "sort_order": 10, "description": "Adjustable and full-electric hospital-style beds for comfortable and safe home care."},
    {"name": "Vertical Platform Lifts",          "slug": "vertical-platform-lifts",      "icon": "elevator",      "sort_order": 11, "description": "Vertical platform lifts for porch, deck, and home entry access."},
    {"name": "Security Poles",                   "slug": "security-poles",               "icon": "safety",        "sort_order": 12, "description": "Floor-to-ceiling security poles and grab bars for fall prevention and stability."},
    {"name": "Tables & Trays",                   "slug": "tables-trays",                 "icon": "table",         "sort_order": 13, "description": "Over-bed tables, swivel trays, and stand-assist tray tables."},
]


# ---------------------------------------------------------------------------
# BRANDS
# ---------------------------------------------------------------------------
BRANDS = [
    {"name": "Bruno Independent Living Aids", "website": "https://www.bruno.com"},
    {"name": "Handicare",                     "website": "https://www.handicare.com"},
    {"name": "Harmar",                        "website": "https://www.harmar.com"},
    {"name": "Pride Mobility",                "website": "https://www.pridemobility.com"},
    {"name": "Golden Technologies",           "website": "https://goldentech.com"},
    {"name": "Drive Medical",                 "website": "https://www.drivemedical.com"},
    {"name": "Journey Health & Lifestyle",    "website": "https://journeyhealth.com"},
    {"name": "Forcemech",                     "website": "https://www.forcemech.com"},
    {"name": "Rhythm Healthcare",             "website": "https://www.rhythmhealthcare.com"},
    {"name": "Strongback",                    "website": "https://www.strongbackchairs.com"},
    {"name": "Vive Health",                   "website": "https://vivehealth.com"},
    {"name": "EZ-ACCESS",                     "website": "https://www.ez-access.com"},
    {"name": "Prairie View Industries",       "website": "https://www.pviramps.com"},
    {"name": "BestCare",                      "website": "https://www.bestcare-med.com"},
    {"name": "Savaria",                       "website": "https://www.savaria.com"},
    {"name": "Stander",                       "website": "https://www.stander.com"},
    {"name": "Healthcraft",                   "website": "https://www.healthcraftproducts.com"},
]


# ---------------------------------------------------------------------------
# PRODUCTS — every product listed on millermobility.com as of March 2026
# Prices are "call for price" because the site shows $0.00 for all items.
# ---------------------------------------------------------------------------
PRODUCTS = [

    # =========================================================================
    # STAIRLIFTS
    # =========================================================================
    {
        "name": "Bruno Elan Straight Stairlift",
        "sku": "BRU-ELAN",
        "category": "stairlifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Space-saving straight stairlift — folds to just 11.5\" wide, 300 lb capacity.",
        "description": "The Bruno Elan is Bruno's most popular straight stairlift. Features a foldable rail, foldable footrest, and power seat swivel. Handles up to 300 lbs and takes only 13.5 inches on your stairs when folded. Installed by factory-trained technicians in a couple of hours. Lifetime warranty on drive train.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 300, "folded_width_inches": 11.5, "rail_type": "Straight", "power_seat_swivel": "Yes", "warranty": "Lifetime on drive train"},
    },
    {
        "name": "Bruno Elite Straight Stairlift",
        "sku": "BRU-ELITE",
        "category": "stairlifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Heavy-duty straight stairlift with 400 lb capacity and extra-wide seat.",
        "description": "The Bruno Elite offers a 400 lb weight capacity and a wider, more comfortable seat than the Elan. Features an optional power folding rail for tighter landings.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 400, "rail_type": "Straight", "power_seat_swivel": "Yes"},
    },
    {
        "name": "Bruno Curved Stairlift",
        "sku": "BRU-CURVED",
        "category": "stairlifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Custom-fit curved stairlift for staircases with landings, 90 or 180 degree turns.",
        "description": "Bruno's curved stairlift uses a durable all-steel rail custom-fabricated to your exact staircase — including 90, 180 degree, and intermediate landings. Standard 400 lb capacity. Installation typically takes 3–4 hours.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 400, "rail_type": "Curved — custom fabricated", "fits": "90-degree, 180-degree, landings", "install_time": "3–4 hours"},
    },
    {
        "name": "Handicare 1100 Straight Stairlift",
        "sku": "HAN-1100",
        "category": "stairlifts",
        "brand": "Handicare",
        "short_description": "Slim single-tube rail straight stairlift — 300 lb capacity.",
        "description": "The Handicare 1100 uses a single-tube rail system that hugs the wall and leaves maximum stair space free. Available in a range of upholstery colors.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 300, "rail_type": "Straight — single tube"},
    },
    {
        "name": "Handicare Curved Stairlift",
        "sku": "HAN-CURVED",
        "category": "stairlifts",
        "brand": "Handicare",
        "short_description": "Handicare single-tube curved rail stairlift — 275 lb capacity.",
        "description": "Handicare's curved stairlift wraps a single-tube rail elegantly around the staircase. With a 275 lb capacity it suits most residential curved stairs.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 275, "rail_type": "Curved — single tube"},
    },
    {
        "name": "Harmar SL600HD Heavy-Duty Stairlift",
        "sku": "HAR-SL600HD",
        "category": "stairlifts",
        "brand": "Harmar",
        "short_description": "Super heavy-duty straight stairlift — 600 lb weight capacity.",
        "description": "The Harmar SL600HD is designed for users requiring maximum weight support. At 600 lbs it is one of the highest-rated residential stairlifts available, ideal for bariatric applications.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 600, "rail_type": "Straight", "application": "Bariatric"},
    },

    # =========================================================================
    # MOBILITY SCOOTERS
    # =========================================================================
    {
        "name": "Golden Buzzaround XL+ 4-Wheel Scooter (GB152-XL+)",
        "sku": "GOL-GB152-XLP",
        "category": "mobility-scooters",
        "brand": "Golden Technologies",
        "short_description": "Full-size 4-wheel travel scooter with long range and easy disassembly.",
        "description": "The Buzzaround XL+ is a full-featured 4-wheel scooter that disassembles easily for vehicle transport. Excellent range and comfortable captain's seat make it ideal for longer outings.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"wheels": 4, "disassembles": "Yes"},
    },
    {
        "name": "Golden Buzzaround EX 4-Wheel Heavy Duty Scooter (GB148)",
        "sku": "GOL-GB148",
        "category": "mobility-scooters",
        "brand": "Golden Technologies",
        "short_description": "Heavy-duty long-range 4-wheel scooter that disassembles easily.",
        "description": "The Buzzaround EX offers extended range and a heavy-duty frame while still disassembling easily for car transport.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"wheels": 4, "disassembles": "Yes", "duty": "Heavy"},
    },
    {
        "name": "Golden Buzzaround EX Extreme 3-Wheel Scooter (GB118)",
        "sku": "GOL-GB118",
        "category": "mobility-scooters",
        "brand": "Golden Technologies",
        "short_description": "Heavy-duty 3-wheel travel scooter with long range — disassembles easily.",
        "description": "The 3-wheel Buzzaround EX Extreme delivers a tight turning radius for indoor use combined with durability for outdoor terrain. Disassembles quickly for vehicle loading.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"wheels": 3, "disassembles": "Yes", "duty": "Heavy"},
    },
    {
        "name": "Golden Buzzaround CarryOn Fold-Flat Lithium Scooter (GB120)",
        "sku": "GOL-GB120",
        "category": "mobility-scooters",
        "brand": "Golden Technologies",
        "short_description": "Fold-flat travel scooter with airline-approved lithium battery.",
        "description": "The Buzzaround CarryOn features an airline-approved lithium battery and a fold-flat design for compact storage. One of the lightest full-featured travel scooters on the market.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"battery": "Lithium — airline approved", "folds": "Flat"},
    },
    {
        "name": "Pride Go-Go Super Portable 4-Wheel Scooter (SC15)",
        "sku": "PRI-SC15",
        "category": "mobility-scooters",
        "brand": "Pride Mobility",
        "short_description": "Foldable 41.6 lb scooter with lithium battery — 300 lb capacity.",
        "description": "The Go-Go Super Portable weighs just 41.6 lbs total and features a lithium battery for easy air travel. Folds quickly for compact storage. 300 lb weight capacity.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 300, "total_weight_lbs": 41.6, "battery": "Lithium", "folds": "Yes"},
    },
    {
        "name": "Pride Go-Go Elite Traveller 2 4-Wheel Scooter (SC442E-12)",
        "sku": "PRI-SC442E-12",
        "category": "mobility-scooters",
        "brand": "Pride Mobility",
        "short_description": "4-wheel travel scooter with iTurn technology — 37 inch turning radius.",
        "description": "The Go-Go Elite Traveller 2 features Pride's iTurn technology for an ultra-tight 37-inch turning radius, making it exceptionally maneuverable indoors.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"wheels": 4, "turning_radius_inches": 37, "technology": "iTurn"},
    },
    {
        "name": "Pride Go-Go Elite Traveller 3-Wheel Scooter (SC40E)",
        "sku": "PRI-SC40E",
        "category": "mobility-scooters",
        "brand": "Pride Mobility",
        "short_description": "Classic 3-wheel travel scooter — disassembles into 5 lightweight pieces.",
        "description": "Pride's best-selling travel scooter disassembles into five lightweight pieces, with the heaviest under 14 lbs. Tight turning radius for indoor use with solid outdoor performance.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"wheels": 3, "pieces_for_transport": 5, "heaviest_piece": "Under 14 lbs"},
    },

    # =========================================================================
    # POWER WHEELCHAIRS
    # =========================================================================
    {
        "name": "Pride Jazzy Carbon 27X Power Wheelchair",
        "sku": "PRI-JAZZY-27X",
        "category": "power-wheelchairs",
        "brand": "Pride Mobility",
        "short_description": "Carbon fiber power chair — extended range and higher bariatric capacity.",
        "description": "The Jazzy Carbon 27X combines a lightweight carbon fiber frame with extended-range batteries and higher weight capacity. Folds for easy transport.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"frame": "Carbon fiber", "folds": "Yes"},
    },
    {
        "name": "Pride Jazzy Carbon 27 Power Wheelchair",
        "sku": "PRI-JAZZY-27",
        "category": "power-wheelchairs",
        "brand": "Pride Mobility",
        "short_description": "Lightweight carbon fiber folding power chair for travel and daily use.",
        "description": "The Jazzy Carbon 27 is a foldable carbon-fiber power wheelchair balancing portability and performance. Folds in seconds and fits in most car trunks.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"frame": "Carbon fiber", "folds": "Yes"},
    },
    {
        "name": "Pride Jazzy Carbon HD Power Wheelchair",
        "sku": "PRI-JAZZY-HD",
        "category": "power-wheelchairs",
        "brand": "Pride Mobility",
        "short_description": "Heavy-duty carbon fiber folding power chair with higher weight capacity.",
        "description": "The Jazzy Carbon HD is built for users requiring extra weight capacity without sacrificing the portability of a carbon-fiber folding design.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"frame": "Carbon fiber", "duty": "Heavy-duty", "folds": "Yes"},
    },
    {
        "name": "Pride Jazzy Ultra Light Foldable Power Wheelchair",
        "sku": "PRI-JAZZY-UL",
        "category": "power-wheelchairs",
        "brand": "Pride Mobility",
        "short_description": "Carbon fiber frame, airline-compliant 10Ah lithium battery, 300 lb capacity.",
        "description": "The Jazzy Ultra Light is a foldable electric wheelchair with a carbon fiber frame and airline-compliant 10Ah lithium battery — designed for travelers who need a chair that goes anywhere.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"frame": "Carbon fiber", "weight_capacity_lbs": 300, "battery": "10Ah Lithium — airline approved", "folds": "Yes"},
    },
    {
        "name": "Journey Zoomer Folding Power Chair (TSA Approved)",
        "sku": "JOU-ZOOMER",
        "category": "power-wheelchairs",
        "brand": "Journey Health & Lifestyle",
        "short_description": "TSA-approved all-terrain lightweight folding power chair.",
        "description": "The Journey Zoomer is a lightweight, foldable, TSA-approved power chair built for all-terrain use. Easy to fold and transport — a great travel companion.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"TSA_approved": "Yes", "folds": "Yes", "terrain": "All-terrain"},
    },
    {
        "name": "Journey Air Elite Folding Power Chair — 26 lbs",
        "sku": "JOU-AIR-ELITE",
        "category": "power-wheelchairs",
        "brand": "Journey Health & Lifestyle",
        "short_description": "Ultra-lightweight at just 26 lbs — carbon fiber foldable electric wheelchair.",
        "description": "The Journey Air Elite weighs only 26 lbs, making it one of the lightest power chairs available. Carbon fiber frame folds in seconds for easy transport in any vehicle.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_lbs": 26, "frame": "Carbon fiber", "folds": "Yes"},
    },
    {
        "name": "Forcemech Ultralite G10 Power Wheelchair",
        "sku": "FOR-G10",
        "category": "power-wheelchairs",
        "brand": "Forcemech",
        "short_description": "Ultra-lightweight folding power wheelchair with long-range battery.",
        "description": "The Forcemech Ultralite G10 is engineered for portability and performance, featuring a lightweight foldable frame and long-range battery for extended daily use.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"folds": "Yes"},
    },
    {
        "name": "Forcemech Carbon F1 Power Wheelchair",
        "sku": "FOR-F1",
        "category": "power-wheelchairs",
        "brand": "Forcemech",
        "short_description": "Carbon fiber frame power wheelchair — lightweight and durable.",
        "description": "The Forcemech Carbon F1 combines a full carbon fiber frame with powerful motors for an exceptionally light yet capable folding power wheelchair.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"frame": "Carbon fiber", "folds": "Yes"},
    },
    {
        "name": "Golden Cricket Ultra-Lightweight Travel Power Wheelchair",
        "sku": "GOL-CRICKET",
        "category": "power-wheelchairs",
        "brand": "Golden Technologies",
        "short_description": "39.3 lb carbon fiber folding power wheelchair — airline and cruise approved battery.",
        "description": "The Golden Cricket weighs just 39.3 lbs total and uses an airline- and cruise-approved lithium battery. Carbon fiber frame folds compactly for easy transport anywhere.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"total_weight_lbs": 39.3, "frame": "Carbon fiber", "battery": "Lithium — airline and cruise approved"},
    },

    # =========================================================================
    # POWER LIFT RECLINERS
    # =========================================================================
    {
        "name": "Pride VivaLift! Tranquil 2 Power Lift Recliner (PLR935)",
        "sku": "PRI-PLR935",
        "category": "lift-chairs-power-recliners",
        "brand": "Pride Mobility",
        "short_description": "4-position power lift recliner with memory foam chaise pad.",
        "description": "The VivaLift Tranquil 2 features a plush memory foam chaise pad and 4-position recline mechanism that goes to a near-flat sleeping position. Available in multiple fabric options.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"positions": 4, "padding": "Memory foam chaise pad"},
    },
    {
        "name": "Pride VivaLift! Radiance Power Lift Recliner (PLR3955)",
        "sku": "PRI-PLR3955",
        "category": "lift-chairs-power-recliners",
        "brand": "Pride Mobility",
        "short_description": "Infinite-position power lift recliner with Trendelenburg capability.",
        "description": "The VivaLift Radiance offers infinite positioning including the Trendelenburg position (feet above heart level), plus headrest and lumbar support.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"positions": "Infinite", "trendelenburg": "Yes", "lumbar_support": "Yes"},
    },
    {
        "name": "Pride VivaLift! Ultra Power Lift Recliner (PLR4955)",
        "sku": "PRI-PLR4955",
        "category": "lift-chairs-power-recliners",
        "brand": "Pride Mobility",
        "short_description": "Premium infinite-position lift recliner with heat, massage, and zero-gravity.",
        "description": "The VivaLift Ultra is Pride's flagship lift recliner with infinite positioning, zero-gravity recline, optional heat and massage, and premium upholstery options.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"positions": "Infinite / Zero-Gravity", "heat_massage": "Optional"},
    },
    {
        "name": "Pride Evolution XXL 600 lb Power Lift Chair (LC435XXL)",
        "sku": "PRI-LC435XXL",
        "category": "lift-chairs-power-recliners",
        "brand": "Pride Mobility",
        "short_description": "Extra-large 600 lb capacity power lift chair for bariatric users.",
        "description": "The Pride Evolution XXL is designed for larger users with a 600 lb weight capacity, wide seat, and durable frame providing comfortable lift and recline support.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 600, "size": "Extra-large / Bariatric"},
    },
    {
        "name": "Golden Rhea Power Lift Recliner (PR442)",
        "sku": "GOL-PR442",
        "category": "lift-chairs-power-recliners",
        "brand": "Golden Technologies",
        "short_description": "Stylish Golden Rhea lift recliner with MaxiComfort zero-gravity positioning.",
        "description": "The Golden Rhea combines elegant styling with MaxiComfort infinite positioning and zero-gravity recline. Features headrest, lumbar support, and a whisper-quiet motor.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"positions": "Infinite / MaxiComfort", "zero_gravity": "Yes"},
    },
    {
        "name": "Golden EZ Sleeper Slim Power Lift Recliner (PR764)",
        "sku": "GOL-PR764",
        "category": "lift-chairs-power-recliners",
        "brand": "Golden Technologies",
        "short_description": "Slim-profile lift recliner with Twilight full-recline and sleeper function.",
        "description": "The Golden EZ Sleeper Slim is designed for smaller spaces without sacrificing comfort. The Twilight system allows a fully flat sleeping position.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"profile": "Slim", "sleeper": "Yes", "twilight_system": "Yes"},
    },
    {
        "name": "Golden Dione Power Lift Chair Recliner Large/Wide (PR446)",
        "sku": "GOL-PR446",
        "category": "lift-chairs-power-recliners",
        "brand": "Golden Technologies",
        "short_description": "Large/wide power lift recliner for bigger body frames.",
        "description": "The Golden Dione comes in Large and Large/Wide sizes to accommodate users who need a roomier seat. Features MaxiComfort infinite positioning.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"sizes": "Large, Large/Wide", "positions": "Infinite / MaxiComfort"},
    },
    {
        "name": "Golden Elara Power Lift Chair Recliner (PR118)",
        "sku": "GOL-PR118",
        "category": "lift-chairs-power-recliners",
        "brand": "Golden Technologies",
        "short_description": "Traditional-style power lift recliner with full recline and standing assist.",
        "description": "The Golden Elara features a classic pillow-top design with full recline and standing assist, available in multiple fabric options to suit any living room decor.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"style": "Traditional pillow-top"},
    },
    {
        "name": "Golden Cloud Power Recliner with Twilight (PR527)",
        "sku": "GOL-PR527",
        "category": "lift-chairs-power-recliners",
        "brand": "Golden Technologies",
        "short_description": "Zero-gravity cloud recliner with Twilight recline and optional Nirvana heat/massage.",
        "description": "The Golden Cloud combines MaxiComfort zero-gravity positioning with the Twilight full-recline system. Optional Nirvana package adds heat and massage.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"positions": "Infinite / Zero-Gravity", "twilight": "Yes", "optional": "Nirvana heat and massage"},
    },
    {
        "name": "Golden Comforter MaxiComfort Large/Wide 600 lb Lift Chair (PR535-LXW)",
        "sku": "GOL-PR535-LXW",
        "category": "lift-chairs-power-recliners",
        "brand": "Golden Technologies",
        "short_description": "Bariatric 600 lb capacity large/wide MaxiComfort lift recliner.",
        "description": "The Golden Comforter PR535-LXW is built for heavy-duty use with a 600 lb weight capacity in a large/wide configuration. MaxiComfort infinite positioning included.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 600, "size": "Large/Wide", "positions": "Infinite / MaxiComfort"},
    },

    # =========================================================================
    # WHEELCHAIRS & TRANSPORT CHAIRS
    # =========================================================================
    {
        "name": "Strongback Comfort 24 Lightweight Folding Wheelchair",
        "sku": "STR-COMFORT-24",
        "category": "wheelchairs-transport-chairs",
        "brand": "Strongback",
        "short_description": "Lightweight folding wheelchair with patented ergonomic lumbar back support.",
        "description": "The Strongback Comfort 24 features a patented back support system that improves posture and reduces pain. Lightweight aluminum frame folds easily for transport.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"back_support": "Patented lumbar / ergonomic", "frame": "Lightweight aluminum"},
    },
    {
        "name": "Strongback Excursion 12+AB Transport Wheelchair",
        "sku": "STR-EXC-12AB",
        "category": "wheelchairs-transport-chairs",
        "brand": "Strongback",
        "short_description": "Lightweight transport chair with adjustable Strongback lumbar support.",
        "description": "The Excursion 12+AB is a compact caregiver-pushed transport wheelchair featuring Strongback's patented lumbar support and adjustable back height.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Transport chair", "back_support": "Adjustable Strongback lumbar"},
    },
    {
        "name": "Strongback Excursion 8 Transport Wheelchair",
        "sku": "STR-EXC-8",
        "category": "wheelchairs-transport-chairs",
        "brand": "Strongback",
        "short_description": "Ultra-compact lightweight transport chair with Strongback lumbar support.",
        "description": "The Excursion 8 is Strongback's most compact transport wheelchair, ideal for easy storage and travel with patented lumbar back support.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Transport chair — ultra compact"},
    },
    {
        "name": "Strongback 24HD Heavy Duty Wheelchair",
        "sku": "STR-24HD",
        "category": "wheelchairs-transport-chairs",
        "brand": "Strongback",
        "short_description": "Heavy-duty manual wheelchair with Strongback ergonomic lumbar support.",
        "description": "The Strongback 24HD is built for users who need a heavier-duty frame while still enjoying the ergonomic benefits of Strongback's patented lumbar support system.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"duty": "Heavy-duty", "back_support": "Strongback lumbar"},
    },
    {
        "name": "Rhythm Super Lite 19 inch Aluminum Companion Chair (L2419)",
        "sku": "RHY-L2419",
        "category": "wheelchairs-transport-chairs",
        "brand": "Rhythm Healthcare",
        "short_description": "Ultra-lightweight 19 inch aluminum transport/companion chair.",
        "description": "The Rhythm Super Lite is one of the lightest transport chairs available, featuring a 19-inch seat width and aluminum frame. Ideal for caregivers who need a chair that is easy to lift and load.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Transport / Companion chair", "seat_width_inches": 19, "frame": "Aluminum"},
    },
    {
        "name": "Rhythm Array K2 Wheelchair (16, 18, 20 inch seat)",
        "sku": "RHY-ARRAY-K2",
        "category": "wheelchairs-transport-chairs",
        "brand": "Rhythm Healthcare",
        "short_description": "Folding manual wheelchair available in 16, 18, and 20 inch seat widths.",
        "description": "The Rhythm Array K2 is a durable folding manual wheelchair with flip-back arms and swing-away footrests. Available in three seat widths to accommodate a range of users.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"seat_width_options": "16, 18, 20 inch", "footrests": "Swing-away", "arms": "Flip-back"},
    },
    {
        "name": "Vive Transport Wheelchair / Rollator",
        "sku": "VIVE-TRANSPORT",
        "category": "wheelchairs-transport-chairs",
        "brand": "Vive Health",
        "short_description": "Dual-function transport wheelchair and rollator in one device.",
        "description": "The Vive Transport Wheelchair/Rollator converts between a rollator for independent walking support and a transport wheelchair for caregiver-assisted travel.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Hybrid — transport wheelchair and rollator"},
    },

    # =========================================================================
    # WALKERS & ROLLATORS
    # =========================================================================
    {
        "name": "Drive AeroWalk Ultra-Lite Rollator",
        "sku": "DRI-AEROWALK",
        "category": "walkers-rollators",
        "brand": "Drive Medical",
        "short_description": "Ultra-lightweight rollator with padded seat, backrest, and storage bag.",
        "description": "The Drive AeroWalk is one of the lightest rollators available. Features a padded seat, backrest, loop brakes, and a storage pouch. Folds compactly for easy transport.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Rollator", "weight": "Ultra-lite"},
    },
    {
        "name": "Rhythm Rimor LT Rollator with 10 inch Chrome Front Wheels (970BK)",
        "sku": "RHY-970BK",
        "category": "walkers-rollators",
        "brand": "Rhythm Healthcare",
        "short_description": "10 inch chrome front wheels, padded seat, easy fold-up outdoor rollator.",
        "description": "The Rimor LT features large 10-inch chrome front wheels for smooth rolling on outdoor surfaces, a padded seat for resting, and loop brakes. Folds easily for storage.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Rollator", "front_wheel_size_inches": 10, "folds": "Yes"},
    },
    {
        "name": "Rhythm Tall Arpeggio Rollator (956BK)",
        "sku": "RHY-956BK",
        "category": "walkers-rollators",
        "brand": "Rhythm Healthcare",
        "short_description": "Tall rollator with extra height adjustment for taller users — indoor/outdoor.",
        "description": "The Rhythm Arpeggio is designed for taller users, featuring extra-high handle height adjustment suitable for both indoor and outdoor use.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Rollator — Tall", "use": "Indoor/Outdoor"},
    },
    {
        "name": "Rhythm Royal Deluxe Universal Aluminum 4-Wheel Rollator (812)",
        "sku": "RHY-812",
        "category": "walkers-rollators",
        "brand": "Rhythm Healthcare",
        "short_description": "Universal 4-wheel aluminum rollator with padded seat and storage bag.",
        "description": "The Rhythm Royal Deluxe is a sturdy universal-fit rollator with aluminum frame, padded seat, loop brakes, and a zippered storage pouch.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Rollator", "frame": "Aluminum"},
    },
    {
        "name": "Rhythm Regal Bariatric 4-Wheel Rollator (850UL)",
        "sku": "RHY-850UL",
        "category": "walkers-rollators",
        "brand": "Rhythm Healthcare",
        "short_description": "Bariatric 4-wheel rollator — 500 lb capacity with universal height adjustment.",
        "description": "The Rhythm Regal is a heavy-duty bariatric rollator with a 500 lb weight capacity and universal height adjustment to fit a wide range of users.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Rollator — Bariatric", "weight_capacity_lbs": 500},
    },
    {
        "name": "Rhythm Royal Aluminum 4-Wheel Rollator (807)",
        "sku": "RHY-807",
        "category": "walkers-rollators",
        "brand": "Rhythm Healthcare",
        "short_description": "Lightweight aluminum 4-wheel rollator with padded seat and backrest.",
        "description": "The Rhythm Royal 807 is a reliable everyday rollator with a lightweight aluminum frame, padded seat, backrest, loop brakes, and storage bag.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Rollator", "frame": "Aluminum"},
    },

    # =========================================================================
    # VEHICLE LIFTS
    # =========================================================================
    {
        "name": "Bruno Joey Platform Interior Vehicle Lift (VSL-4400)",
        "sku": "BRU-VSL-4400",
        "category": "vehicle-lifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Interior platform vehicle lift for minivans and SUVs — stores device inside.",
        "description": "The Bruno Joey interior platform lift raises your scooter or power wheelchair into the interior of your vehicle through the rear hatch, keeping your device protected from the elements.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"mount_type": "Interior — rear hatch", "compatible_with": "Minivans, SUVs"},
    },
    {
        "name": "Bruno Out-Sider Platform Vehicle Lift (ASL-275)",
        "sku": "BRU-ASL-275",
        "category": "vehicle-lifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Exterior hitch-mounted platform lift — carries scooter/wheelchair outside vehicle.",
        "description": "The Bruno Out-Sider attaches to your vehicle's trailer hitch and lifts your scooter or power wheelchair onto an exterior platform behind the vehicle.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"mount_type": "Exterior — hitch mount"},
    },
    {
        "name": "Bruno Curb-Sider Hoist Style Interior Vehicle Lift (VSL-6000)",
        "sku": "BRU-VSL-6000",
        "category": "vehicle-lifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Interior hoist lift — scooter drives onto platform and lifts into vehicle.",
        "description": "The Bruno Curb-Sider is a hoist-style interior lift where your scooter or chair drives onto the platform and is automatically hoisted into your van or SUV.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"mount_type": "Interior hoist", "loading": "Drive-on"},
    },
    {
        "name": "Bruno Chariot Exterior Wheeled Platform Vehicle Lift (ASL-700)",
        "sku": "BRU-ASL-700",
        "category": "vehicle-lifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Heavy-duty exterior wheeled platform lift for large power chairs and scooters.",
        "description": "The Bruno Chariot is a robust exterior wheeled platform lift designed for heavier devices. The wheeled platform rolls out for easy loading then retracts behind the vehicle.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"mount_type": "Exterior — wheeled platform"},
    },
    {
        "name": "Harmar Universal Scooter Hitch-Mount Lift (AL100/AL100HD)",
        "sku": "HAR-AL100",
        "category": "vehicle-lifts",
        "brand": "Harmar",
        "short_description": "Universal hitch-mounted lift for most scooters — standard and HD models.",
        "description": "The Harmar AL100 is a universal hitch-mount lift compatible with most mobility scooters. Works with 1.25 inch and 2 inch hitch receivers. HD model for heavier scooters.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"mount_type": "Exterior — hitch mount", "compatible_with": "Most scooters"},
    },
    {
        "name": "Harmar Universal Powerchair Hitch-Mount Lift (AL500/AL500HD)",
        "sku": "HAR-AL500",
        "category": "vehicle-lifts",
        "brand": "Harmar",
        "short_description": "Universal hitch-mounted lift for power wheelchairs — standard and HD models.",
        "description": "The Harmar AL500 is designed specifically for power wheelchairs, providing a reliable exterior hitch-mount lift. HD model available for heavier chairs.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"mount_type": "Exterior — hitch mount", "compatible_with": "Power wheelchairs"},
    },
    {
        "name": "Harmar Hybrid Platform Lift (AL600 Classic)",
        "sku": "HAR-AL600",
        "category": "vehicle-lifts",
        "brand": "Harmar",
        "short_description": "Hybrid exterior platform lift — compatible with both scooters and power wheelchairs.",
        "description": "The Harmar AL600 Classic is a versatile hybrid lift that accommodates both scooters and power wheelchairs on a single hitch-mounted platform.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"mount_type": "Exterior — hitch mount", "compatible_with": "Scooters and power wheelchairs"},
    },

    # =========================================================================
    # PATIENT LIFTS
    # =========================================================================
    {
        "name": "BestCare PL400 Full Body Electric Patient Lift (400 lb)",
        "sku": "BEST-PL400",
        "category": "patient-lifts",
        "brand": "BestCare",
        "short_description": "Full-body electric patient lift with ergonomic hand control — 400 lb capacity.",
        "description": "The BestCare PL400 provides powered full-body patient transfers between bed, wheelchair, bath, and more. Ergonomic one-handed hand control. 400 lb weight capacity.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Full-body electric", "weight_capacity_lbs": 400, "control": "Ergonomic hand control"},
    },
    {
        "name": "BestCare SA182 Sit-to-Stand Manual Lift (400 lb)",
        "sku": "BEST-SA182",
        "category": "patient-lifts",
        "brand": "BestCare",
        "short_description": "Manual sit-to-stand lift with adjustable knee pad and detachable foot plate.",
        "description": "The BestCare SA182 is a manual sit-to-stand lift for patients who can bear some weight. Features adjustable knee pad and detachable foot plate for versatility.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Sit-to-stand manual", "weight_capacity_lbs": 400},
    },

    # =========================================================================
    # RAMPS
    # =========================================================================
    {
        "name": "EZ-ACCESS GATEWAY 3G Solid Surface Aluminum Portable Ramp",
        "sku": "EZA-GATEWAY-3G",
        "category": "ramps",
        "brand": "EZ-ACCESS",
        "short_description": "Solid-surface portable aluminum ramp with 2-line handrails and self-adjusting transition plates.",
        "description": "The EZ-ACCESS GATEWAY 3G features a solid non-slip aluminum surface, self-adjusting bottom transition plates, and included 2-line handrails. ADA-compliant design. Available in multiple lengths.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"surface": "Solid non-slip textured aluminum", "handrails": "2-line included", "transition_plates": "Self-adjusting"},
    },
    {
        "name": "EZ-ACCESS Suitcase Singlefold Portable Ramp",
        "sku": "EZA-SINGLEFOLD",
        "category": "ramps",
        "brand": "EZ-ACCESS",
        "short_description": "Single-fold suitcase ramp — slip-resistant surface, self-adjusting transition plates.",
        "description": "The EZ-ACCESS Suitcase Singlefold is the classic portable ramp. Folds in half like a suitcase for easy carrying. Slip-resistant surface and self-adjusting bottom transition plates.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"fold_type": "Single-fold suitcase", "surface": "Slip-resistant"},
    },
    {
        "name": "EZ-ACCESS Suitcase Trifold Portable Aluminum Ramp",
        "sku": "EZA-TRIFOLD",
        "category": "ramps",
        "brand": "EZ-ACCESS",
        "short_description": "Three-section folding portable ramp — shorter carry length than singlefold.",
        "description": "The EZ-ACCESS Trifold folds into thirds, making it shorter and easier to carry when folded. Ideal when carry length is a concern. Slip-resistant surface.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"fold_type": "Trifold", "surface": "Slip-resistant"},
    },
    {
        "name": "EZ-ACCESS TRANSITIONS Angled Entry Threshold Ramp",
        "sku": "EZA-TRANSITIONS",
        "category": "ramps",
        "brand": "EZ-ACCESS",
        "short_description": "Portable aluminum angled entry plate ramp for door thresholds and small steps.",
        "description": "The TRANSITIONS Angled Entry Plate bridges door thresholds, small lips, and low steps. Non-slip aluminum surface with pre-drilled slots for optional anchoring.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Threshold ramp / angled entry plate", "surface": "Non-slip aluminum"},
    },

    # =========================================================================
    # BEDS
    # =========================================================================
    {
        "name": "Golden Passport Hi-Low Adjustable Bed with Dual-Zone Vibrating Massage",
        "sku": "GOL-PASSPORT-BED",
        "category": "beds",
        "brand": "Golden Technologies",
        "short_description": "Hi-low adjustable residential bed with dual-zone vibrating massage.",
        "description": "The Golden Passport is a residential hi-low adjustable bed that raises and lowers for easy transfers. Dual-zone vibrating massage adds therapeutic comfort. Ideal for home care use.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"adjustment": "Hi-Low electric", "massage": "Dual-zone vibrating"},
    },
    {
        "name": "Drive Delta Ultra-Light 1000 Full-Electric Bed (#15033)",
        "sku": "DRI-DELTA-1000",
        "category": "beds",
        "brand": "Drive Medical",
        "short_description": "Full-electric homecare bed — head, foot, and height adjust independently.",
        "description": "The Drive Delta Ultra-Light 1000 is a full-electric homecare bed with independent head, foot, and height adjustment. Lightweight construction makes repositioning easier.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Full-electric", "adjustments": "Head, foot, and height"},
    },

    # =========================================================================
    # VERTICAL PLATFORM LIFTS
    # =========================================================================
    {
        "name": "Bruno Residential Vertical Platform Lift",
        "sku": "BRU-VPL",
        "category": "vertical-platform-lifts",
        "brand": "Bruno Independent Living Aids",
        "short_description": "Residential vertical platform lift for porch, deck, and home entry access.",
        "description": "The Bruno Residential VPL provides safe, smooth access to raised porches, decks, and home entries for wheelchair and scooter users. Features a fold-down ramp, safety sensors, emergency stop button, and battery backup. Straight and 90-degree models available. Free evaluations offered.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"models": "Straight, 90-degree", "battery_backup": "Yes", "safety_sensors": "Yes", "emergency_stop": "Yes", "ramp": "Automatic fold-down"},
    },

    # =========================================================================
    # SECURITY POLES
    # =========================================================================
    {
        "name": "Stander Wonder Pole (#1100-W)",
        "sku": "STA-1100-W",
        "category": "security-poles",
        "brand": "Stander",
        "short_description": "Floor-to-ceiling security pole — installs without tools in minutes, 300 lb capacity.",
        "description": "The Stander Wonder Pole installs between floor and ceiling by turning a jackscrew — no drilling required. Must align with a ceiling joist. Provides a stable grab point for standing, sitting, and bed transfers.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 300, "installation": "Tool-free jackscrew"},
    },
    {
        "name": "Healthcraft Advantage-Rail Bed Rail",
        "sku": "HCR-ADVANTAGE-RAIL",
        "category": "security-poles",
        "brand": "Healthcraft",
        "short_description": "Adjustable bedside safety rail and handle for sitting up and getting out of bed.",
        "description": "The Healthcraft Advantage-Rail slides under the mattress to provide a firm grip point for sitting up, repositioning, and transferring out of bed. Adjustable height.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"type": "Bed rail / grab bar", "mounting": "Under-mattress"},
    },
    {
        "name": "Healthcraft Bariatric SuperBar Floor-to-Ceiling Grab Bar 8 ft (450 lb)",
        "sku": "HCR-SUPERBAR-450",
        "category": "security-poles",
        "brand": "Healthcraft",
        "short_description": "8 ft bariatric floor-to-ceiling transfer pole — 450 lb capacity.",
        "description": "The Healthcraft Bariatric SuperBar is an 8-foot floor-to-ceiling grab bar with 450 lb capacity. Ideal for bedroom, kitchen, bath, and shower safety. Installs via jackscrew between floor and ceiling with no drilling required.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"weight_capacity_lbs": 450, "height_ft": 8, "installation": "Jackscrew — tool-free", "locations": "Bedroom, kitchen, bath, shower"},
    },

    # =========================================================================
    # TABLES & TRAYS
    # =========================================================================
    {
        "name": "Stander Assist-A-Tray Table",
        "sku": "STA-ASSIST-TRAY",
        "category": "tables-trays",
        "brand": "Stander",
        "short_description": "Lift-chair side tray with standing handle assist and swivel surface.",
        "description": "The Stander Assist-A-Tray attaches beside a lift chair or recliner and provides a swiveling surface for meals and activities plus a sturdy handle to help users stand up.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"compatible_with": "Lift chairs, recliners", "swivel": "Yes", "standing_assist": "Yes"},
    },
    {
        "name": "Stander EZ Stand-N-Go Heavy Duty (#9220)",
        "sku": "STA-9220",
        "category": "tables-trays",
        "brand": "Stander",
        "short_description": "Heavy-duty stand-assist handle that slides under mattress for bed transfers.",
        "description": "The Stander EZ Stand-N-Go Heavy Duty slides securely under the mattress and provides a firm grab bar to assist with sitting up in bed and transferring to a standing position.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"mounting": "Under-mattress", "duty": "Heavy-duty", "use": "Bed stand assist"},
    },
    {
        "name": "Stander Omni Tray Table — Adjustable Swivel Tray with Standing Handle",
        "sku": "STA-OMNI-TRAY",
        "category": "tables-trays",
        "brand": "Stander",
        "short_description": "Bamboo swivel tray with standing handle — works with chairs, couches, and recliners.",
        "description": "The Stander Omni Tray Table is a versatile bamboo swivel tray suitable for meals, laptops, puzzles, and more. Includes a sturdy standing-assist handle and works with chairs, couches, and recliners.",
        "call_for_price": True, "condition": "new", "status": "available", "is_featured": False,
        "specifications": {"surface": "Bamboo", "swivel": "Yes", "standing_handle": "Yes", "compatible_with": "Chairs, couches, recliners"},
    },
]


# ---------------------------------------------------------------------------
# DEALS
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
DEALS = [
    {
        "title": "April Deal of the Month — 10% Off Rollators",
        "slug": "april-deal-rollators",
        "deal_type": "seasonal",
        "short_description": "Save 10% on all rollators this month — 3-wheel, 4-wheel, bariatric & upright models included.",
        "description": (
            "Spring is here and so is our April Deal of the Month! Take 10% off all rollators for a limited time. "
            "Rollators—also called rolling walkers—are one of the most effective mobility aids for staying active, "
            "steady, and independent. They combine stability, comfort, and ease of movement in a way traditional "
            "walkers simply can't. Whether you're shopping for yourself or a loved one, we're here to help you "
            "find the right fit."
        ),
        "discount_percent": 10,
        "badge_label": "10% OFF",
        "badge_color": "#E63946",
        "is_featured": True,
        "is_active": True,
    },
    {
        "title": "Veterans Appreciation Savings",
        "slug": "veterans-appreciation-savings",
        "deal_type": "seasonal",
        "short_description": "Veterans receive 10% off their first purchase and 5% off every future purchase — year-round.",
        "description": (
            "Miller Mobility is proud to honor those who've served. Veterans receive 10% off their first purchase "
            "and 5% off every future purchase — our way of saying thank you for your service.\n\n"
            "Plus, you'll automatically earn Miller Money with every purchase — our exclusive rewards program that "
            "lets you save even more on mobility products and accessories.\n\n"
            "Stop by our showroom today to find the perfect fit and start earning Miller Money!"
        ),
        "discount_percent": 10,
        "badge_label": "Veteran Savings",
        "badge_color": "#003366",
        "is_featured": True,
        "is_active": True,
    },
    {
        "title": "ADRC Vehicle Modification Program — Funding Is Back",
        "slug": "adrc-vehicle-modification",
        "deal_type": "financing",
        "short_description": "Waukesha County residents may qualify for ADRC funding toward vehicle lifts and modifications.",
        "description": (
            "ADRC vehicle lift funding is back for Waukesha County residents! Miller Mobility is a preferred "
            "provider for the ADRC Vehicle Modification Program. Qualified Waukesha County residents may receive "
            "funding to help cover the cost of vehicle lifts, hand controls, and other adaptive equipment.\n\n"
            "Our team handles the estimate and paperwork — you pay only 10% of the final modification cost. "
            "Funding is limited, so don't wait."
        ),
        "badge_label": "ADRC Funding",
        "badge_color": "#16A34A",
        "is_featured": True,
        "is_active": True,
    },
]


# ---------------------------------------------------------------------------
# MANAGEMENT COMMAND
# ---------------------------------------------------------------------------
class Command(BaseCommand):
    help = "Seed the database with all Miller Mobility products from millermobility.com."

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Clear existing data before re-seeding.")

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            VehicleConversion.objects.all().delete()
            Product.objects.all().delete()
            Brand.objects.all().delete()
            Category.objects.all().delete()
            Deal.objects.all().delete()
            self.stdout.write(self.style.WARNING("  Cleared.\n"))

        # Categories
        self.stdout.write("Seeding categories...")
        category_map = {}
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(slug=cat_data["slug"], defaults=cat_data)
            category_map[cat_data["slug"]] = cat
            self.stdout.write(f"  {'Created' if created else 'Exists'}: {cat.name}")

        # Brands
        self.stdout.write("\nSeeding brands...")
        brand_map = {}
        for brand_data in BRANDS:
            brand, created = Brand.objects.get_or_create(name=brand_data["name"], defaults=brand_data)
            brand_map[brand_data["name"]] = brand
            self.stdout.write(f"  {'Created' if created else 'Exists'}: {brand.name}")

        # Products
        self.stdout.write("\nSeeding products...")
        created_count = 0
        for p_data in PRODUCTS:
            category_slug = p_data.pop("category")
            brand_name = p_data.pop("brand")

            if category_slug not in category_map:
                self.stdout.write(self.style.WARNING(f"  SKIP — unknown category: {category_slug}"))
                continue

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
            if created:
                created_count += 1
            self.stdout.write(f"  {'Created' if created else 'Exists'}: {product.name}")

        # Deals
        self.stdout.write("\nSeeding deals...")
        for deal_data in DEALS:
            deal, created = Deal.objects.get_or_create(slug=deal_data["slug"], defaults=deal_data)
            self.stdout.write(f"  {'Created' if created else 'Exists'}: {deal.title}")

        self.stdout.write(self.style.SUCCESS(
            f"\nSeed complete! Created {created_count} new products across {len(CATEGORIES)} categories."
            f"\nRun: python manage.py runserver  then visit /api/products/ to verify."
        ))