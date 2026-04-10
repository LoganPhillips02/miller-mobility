import { API_BASE_URL, ENDPOINTS, REQUEST_TIMEOUT } from '../constants/api';

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
      ...options,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(res.status, body.detail || body.message || 'Request failed', body);
    }

    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new ApiError(408, 'Request timed out');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export class ApiError extends Error {
  constructor(status, message, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return apiFetch(`${ENDPOINTS.PRODUCTS}${qs ? `?${qs}` : ''}`);
  },

  get: (id) => apiFetch(ENDPOINTS.PRODUCT_DETAIL(id)),

  featured: () => apiFetch(ENDPOINTS.PRODUCTS_FEATURED),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: () => apiFetch(ENDPOINTS.CATEGORIES),
};

// ─── Brands ───────────────────────────────────────────────────────────────────

export const brandsApi = {
  list: () => apiFetch(ENDPOINTS.BRANDS),
};

// ─── Deals ────────────────────────────────────────────────────────────────────

export const dealsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`${ENDPOINTS.DEALS}${qs ? `?${qs}` : ''}`);
  },
  active: () => apiFetch(ENDPOINTS.DEALS_ACTIVE),
  get: (slug) => apiFetch(ENDPOINTS.DEAL_DETAIL(slug)),
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactApi = {
  submit: (data) =>
    apiFetch(ENDPOINTS.CONTACT, { method: 'POST', body: JSON.stringify(data) }),
};