# Miller Mobility App

A full-stack mobile application for Miller Mobility — browsing wheelchair accessible vehicles, mobility products, deals, and submitting trade-in or contact requests.

## Stack

| Layer | Technology |
|---|---|
| Mobile frontend | React Native (Expo SDK 54) |
| Backend API | Django 6 + Django REST Framework |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Navigation | React Navigation v6 (bottom tabs + stack) |
| HTTP client | Axios |

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set a real SECRET_KEY for any non-local use

# Run migrations
python manage.py migrate

# Seed sample data (categories, brands, products, deals)
python manage.py seed_data

# Create admin user
python manage.py createsuperuser

# Start the dev server
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`.
Django Admin is at `http://localhost:8000/admin/`.

#### Re-seed (wipe and reload)
```bash
python manage.py seed_data --clear
```

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

Make sure the backend is running on port 8000 before launching the app.
The API base URL is set in `src/constants/api.js` — it auto-detects `__DEV__` mode.

---

## Project Structure

```
miller-mobility/
├── backend/
│   ├── config/             # Django project settings, URLs
│   ├── products/           # Categories, brands, products, WAV conversions
│   │   └── management/commands/seed_data.py
│   ├── deals/              # Deals, promotions, trade-in requests
│   ├── contact/            # General contact inquiries
│   ├── .env.example
│   ├── .gitignore
│   └── requirements.txt
│
└── frontend/
    ├── App.js
    └── src/
        ├── components/     # ProductCard, DealCard, shared UI
        ├── constants/      # theme.js, api.js
        ├── hooks/          # useProducts, useDeals, useFavorites, useSearch
        ├── models/         # Data shape factories mirroring API
        ├── navigation/     # AppNavigator (tabs + stacks)
        ├── screens/        # Home, Inventory, ProductDetail, Deals, DealDetail, Contact, Favorites
        └── services/       # api.js (axios client + service layer)
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products/` | List products (filterable) |
| GET | `/api/products/{id}/` | Product detail |
| GET | `/api/products/featured/` | Featured products |
| GET | `/api/products/vehicles/` | WAVs only |
| GET | `/api/products/categories/` | All categories |
| GET | `/api/products/brands/` | All brands |
| GET | `/api/deals/` | All active deals |
| GET | `/api/deals/active/` | Currently valid deals |
| GET | `/api/deals/{slug}/` | Deal detail |
| POST | `/api/deals/trade-in/` | Submit trade-in request |
| POST | `/api/contact/inquiries/` | Submit contact inquiry |

### Product filters (query params)
`?category=wheelchair-accessible-vehicles&condition=new&min_price=40000&max_price=70000&featured=true&search=pacifica`

---

## Environment Variables

See `.env.example` for all variables. Key ones:

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | insecure dev key | Django secret key — **change in production** |
| `DEBUG` | `True` | Set to `False` in production |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated allowed hosts |