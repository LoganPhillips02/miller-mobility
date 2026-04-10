# Miller Mobility — Full Stack App

React Native (Expo) frontend + Django REST API backend with **Neon PostgreSQL**.

---

## Architecture

```
frontend/          ← Expo / React Native app
  src/
    constants/     ← api.js, theme.js
    services/      ← api.js  (single fetch layer)
    hooks/         ← useApi.js  (useFeaturedProducts, useCategories, useDeals …)
    models/        ← product.js  (normalizers, helpers)
    screens/       ← HomeScreen, ProductsScreen, ProductDetailScreen, DealsScreen, ContactScreen
    navigation/    ← AppNavigator.js

backend/           ← Django REST Framework
  config/          ← settings.py (Neon DB config), urls.py, wsgi.py
  products/        ← Category, Brand, Product, ProductImage  +  REST API
  deals/           ← Deal  +  REST API
  contact/         ← ContactInquiry  +  REST API
  products/management/commands/
    scrape_millermobility.py   ← scrapes + seeds all data from millermobility.com
```

---

## Backend Setup

### 1. Create a Neon database

1. Go to [neon.tech](https://neon.tech) and sign up / sign in.
2. Create a new project (e.g. `miller-mobility`).
3. From the dashboard, open **Connection Details** and copy the **Connection string**.  
   It will look like:  
   ```
   postgresql://miller_owner:password@ep-cool-fog-123456.us-east-2.aws.neon.tech/miller_mobility?sslmode=require
   ```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:

```
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(50))">
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
DEBUG=True
```

### 3. Install dependencies & migrate

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser  # optional, for Django admin
```

### 4. Scrape and seed data from millermobility.com

```bash
# Full scrape — imports categories, products, images, and deals from the live site
python manage.py scrape_millermobility

# Clear existing data and re-scrape from scratch
python manage.py scrape_millermobility --clear

# Only update categories (fast, no product scraping)
python manage.py scrape_millermobility --categories-only

# Preview what would be imported without touching the database
python manage.py scrape_millermobility --dry-run
```

> **Note:** If millermobility.com blocks automated requests, the scraper automatically
> falls back to a comprehensive set of hard-coded products matching the live site.

### 5. Run the dev server

```bash
python manage.py runserver 0.0.0.0:8000
```

API is available at `http://localhost:8000/api/`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List products (paginated, filterable) |
| GET | `/api/products/<id>/` | Product detail |
| GET | `/api/products/featured/` | Featured products |
| GET | `/api/products/categories/` | All categories with product counts |
| GET | `/api/products/brands/` | All brands |
| GET | `/api/deals/` | All deals |
| GET | `/api/deals/active/` | Currently-valid deals only |
| GET | `/api/deals/<slug>/` | Deal detail |
| POST | `/api/contact/inquiries/` | Submit contact form |

### Product filtering

```
/api/products/?category=stairlifts
/api/products/?search=Bruno+Elan
/api/products/?condition=new&status=available
/api/products/?featured=true
/api/products/?min_price=500&max_price=2000
/api/products/?ordering=-price
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Point the app at your backend

Edit `src/constants/api.js`:

```js
export const API_BASE_URL = __DEV__
  ? 'http://YOUR_LOCAL_IP:8000/api'   // ← change this for physical device testing
  : 'https://api.millermobility.com/api';
```

For a **Codespace or GitHub Dev Container**, the URL is already set to the
`github.dev` forwarded port — just make sure port `8000` is forwarded and public.

---

## Database schema (key tables)

```
products_category     id, name, slug, description, icon, image_url, sort_order
products_brand        id, name, logo_url, website
products_product      id, name, slug, category_id, brand_id, sku, price, msrp,
                      call_for_price, condition, status, specifications (JSONB),
                      primary_image_url, source_url, is_featured, is_active
products_productimage id, product_id, image_url, alt_text, is_primary, sort_order
deals_deal            id, title, slug, deal_type, description, discount_percent,
                      badge_label, badge_color, start_date, end_date, is_active
contact_contactinquiry id, inquiry_type, first_name, last_name, email, phone,
                       message, preferred_contact, status
```

---

## Key decisions

| Decision | Why |
|----------|-----|
| **Neon PostgreSQL** instead of SQLite | Serverless Postgres — scales, supports concurrent connections, has a generous free tier. `DATABASE_URL` env var is the only config change needed between environments. |
| **`image_url` instead of file uploads** | Product images are served directly from Miller Mobility's CDN (`lirp.cdn-website.com`). No S3/storage bucket needed; images stay fresh without re-uploading. |
| **`specifications` as JSONB** | Product specs vary widely by category (stairlifts have weight capacity; scooters have battery type). JSONB avoids dozens of nullable columns while remaining queryable. |
| **Fallback seed data** | If the live site can't be scraped (rate limiting, bot detection), the command automatically inserts ~25 real products matching the site so the app always has content. |
| **Single `apiFetch` wrapper** | All HTTP calls go through one function with timeout, error normalization, and abort controller — no duplicated try/catch across the app. |
| **`normalizeProduct` model layer** | API response shapes are normalized before reaching any component, so a backend field rename only requires one fix. |

---

## Deployment checklist

- [ ] Set `DEBUG=False` in production `.env`
- [ ] Generate a strong `SECRET_KEY`
- [ ] Add your production domain to `ALLOWED_HOSTS`
- [ ] Run `python manage.py collectstatic`
- [ ] Set `CORS_ALLOW_ALL_ORIGINS = False` and add your app's domain to `CORS_ALLOWED_ORIGINS`
- [ ] Run `python manage.py scrape_millermobility` after deployment to seed production DB
- [ ] Update `API_BASE_URL` in `frontend/src/constants/api.js` to production URL