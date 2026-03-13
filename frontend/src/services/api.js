import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, REQUEST_TIMEOUT } from '../constants/api';
import {
  createCategory,
  createBrand,
  createProduct,
  createDeal,
} from '../models';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor (add auth token when implemented)
client.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Response interceptor — normalise errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  },
);

// ─── Generic helpers ──────────────────────────────────────────────────────────
const get = (url, params = {}) => client.get(url, { params }).then((r) => r.data);
const post = (url, data) => client.post(url, data).then((r) => r.data);

// ─── Products Service ─────────────────────────────────────────────────────────
export const productsService = {
  /**
   * List products with optional filters.
   * @param {object} filters - category, condition, status, min_price, max_price, featured, search
   */
  list: async (filters = {}) => {
    const data = await get(ENDPOINTS.PRODUCTS, filters);
    return {
      ...data,
      results: (data.results ?? []).map(createProduct),
    };
  },

  detail: async (id) => {
    const data = await get(ENDPOINTS.PRODUCT_DETAIL(id));
    return createProduct(data);
  },

  featured: async () => {
    const data = await get(ENDPOINTS.PRODUCTS_FEATURED);
    return (Array.isArray(data) ? data : data.results ?? []).map(createProduct);
  },

  vehicles: async (filters = {}) => {
    const data = await get(ENDPOINTS.PRODUCTS_VEHICLES, filters);
    return (Array.isArray(data) ? data : data.results ?? []).map(createProduct);
  },

  categories: async () => {
    const data = await get(ENDPOINTS.CATEGORIES);
    return (data.results ?? data).map(createCategory);
  },

  brands: async () => {
    const data = await get(ENDPOINTS.BRANDS);
    return (data.results ?? data).map(createBrand);
  },
};

// ─── Deals Service ────────────────────────────────────────────────────────────
export const dealsService = {
  list: async (filters = {}) => {
    const data = await get(ENDPOINTS.DEALS, filters);
    return {
      ...data,
      results: (data.results ?? []).map(createDeal),
    };
  },

  active: async () => {
    const data = await get(ENDPOINTS.DEALS_ACTIVE);
    return (Array.isArray(data) ? data : data.results ?? []).map(createDeal);
  },

  detail: async (slug) => {
    const data = await get(ENDPOINTS.DEAL_DETAIL(slug));
    return createDeal(data);
  },

  submitTradeIn: async (payload) => {
    return post(ENDPOINTS.TRADE_IN, payload);
  },
};

export default client;