export const API_BASE_URL = __DEV__
  ? 'http://cuddly-space-fiesta-r4g97w6rq74h946-8000.app.github.dev/api'
  : 'https://api.millermobility.com/api';

export const ENDPOINTS = {
  // Products
  PRODUCTS:          '/products/',
  PRODUCT_DETAIL:    (id) => `/products/${id}/`,
  PRODUCTS_FEATURED: '/products/featured/',
  CATEGORIES:        '/products/categories/',
  BRANDS:            '/products/brands/',
  // Deals
  DEALS:             '/deals/',
  DEALS_ACTIVE:      '/deals/active/',
  DEAL_DETAIL:       (slug) => `/deals/${slug}/`,
  // Contact
  CONTACT:           '/contact/inquiries/',
};

export const REQUEST_TIMEOUT = 12000;