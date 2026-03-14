export const API_BASE_URL = __DEV__
  ? 'http://cuddly-space-fiesta-r4g97w6rq74h946-8000.app.github.dev/api'
  : 'https://api.millermobility.com/api';

export const ENDPOINTS = {
  // Products
  PRODUCTS: '/products/',
  PRODUCT_DETAIL: (id) => `/products/${id}/`,
  PRODUCTS_FEATURED: '/products/featured/',
  PRODUCTS_VEHICLES: '/products/vehicles/',
  CATEGORIES: '/products/categories/',
  CATEGORY_DETAIL: (slug) => `/products/categories/${slug}/`,
  BRANDS: '/products/brands/',

  // Deals
  DEALS: '/deals/',
  DEALS_ACTIVE: '/deals/active/',
  DEAL_DETAIL: (slug) => `/deals/${slug}/`,
  TRADE_IN: '/deals/trade-in/',
};

export const REQUEST_TIMEOUT = 10000; // 10 seconds