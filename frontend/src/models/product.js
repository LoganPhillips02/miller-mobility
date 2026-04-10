// ─── Normalize API responses to consistent shapes ────────────────────────────
// Ensures components never break if the API adds/removes optional fields.

export function normalizeProduct(raw = {}) {
  return {
    id:                 raw.id ?? null,
    name:               raw.name ?? '',
    slug:               raw.slug ?? '',
    shortDescription:   raw.short_description ?? '',
    description:        raw.description ?? '',
    categoryName:       raw.category_name ?? raw.category?.name ?? '',
    categorySlug:       raw.category?.slug ?? '',
    brandName:          raw.brand_name ?? raw.brand?.name ?? '',
    price:              raw.price ? parseFloat(raw.price) : null,
    msrp:               raw.msrp ? parseFloat(raw.msrp) : null,
    displayPrice:       raw.display_price ?? 'Contact Us',
    callForPrice:       raw.call_for_price ?? false,
    condition:          raw.condition ?? 'new',
    conditionDisplay:   raw.condition_display ?? 'New',
    status:             raw.status ?? 'available',
    statusDisplay:      raw.status_display ?? 'Available',
    isFeatured:         raw.is_featured ?? false,
    primaryImageUrl:    raw.primary_image_url ?? '',
    images:             (raw.images ?? []).map(normalizeProductImage),
    specifications:     raw.specifications ?? {},
    sourceUrl:          raw.source_url ?? '',
    savings:            raw.savings ? parseFloat(raw.savings) : null,
    sku:                raw.sku ?? '',
    createdAt:          raw.created_at ?? null,
  };
}

export function normalizeProductImage(raw = {}) {
  return {
    id:         raw.id ?? null,
    imageUrl:   raw.image_url ?? '',
    altText:    raw.alt_text ?? '',
    isPrimary:  raw.is_primary ?? false,
    sortOrder:  raw.sort_order ?? 0,
  };
}

export function normalizeCategory(raw = {}) {
  return {
    id:           raw.id ?? null,
    name:         raw.name ?? '',
    slug:         raw.slug ?? '',
    description:  raw.description ?? '',
    icon:         raw.icon ?? 'category',
    imageUrl:     raw.image_url ?? '',
    sortOrder:    raw.sort_order ?? 0,
    productCount: raw.product_count ?? 0,
  };
}

export function normalizeDeal(raw = {}) {
  return {
    id:                raw.id ?? null,
    title:             raw.title ?? '',
    slug:              raw.slug ?? '',
    dealType:          raw.deal_type ?? '',
    dealTypeDisplay:   raw.deal_type_display ?? '',
    description:       raw.description ?? '',
    shortDescription:  raw.short_description ?? '',
    discountPercent:   raw.discount_percent ? parseFloat(raw.discount_percent) : null,
    discountAmount:    raw.discount_amount ? parseFloat(raw.discount_amount) : null,
    promoCode:         raw.promo_code ?? '',
    financingApr:      raw.financing_apr ? parseFloat(raw.financing_apr) : null,
    financingMonths:   raw.financing_months ?? null,
    badgeLabel:        raw.badge_label ?? '',
    badgeColor:        raw.badge_color ?? '#E63946',
    isActive:          raw.is_active ?? true,
    isValid:           raw.is_valid ?? true,
    startDate:         raw.start_date ?? null,
    endDate:           raw.end_date ?? null,
    daysRemaining:     raw.days_remaining ?? null,
    imageUrl:          raw.image_url ?? '',
    isFeatured:        raw.is_featured ?? false,
    sortOrder:         raw.sort_order ?? 0,
  };
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export function getProductImageUrl(product) {
  if (product.primaryImageUrl) return product.primaryImageUrl;
  const primary = product.images?.find(img => img.isPrimary);
  if (primary?.imageUrl) return primary.imageUrl;
  return product.images?.[0]?.imageUrl ?? null;
}

export function formatPrice(price) {
  if (!price && price !== 0) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

export function getSavingsPercent(product) {
  if (!product.msrp || !product.price) return null;
  return Math.round(((product.msrp - product.price) / product.msrp) * 100);
}

// Condition badge colors
export const CONDITION_COLORS = {
  new:        { bg: '#DCFCE7', text: '#166534' },
  used:       { bg: '#FEF3C7', text: '#92400E' },
  certified:  { bg: '#DBEAFE', text: '#1E40AF' },
};

// Status badge colors
export const STATUS_COLORS = {
  available:    { bg: '#DCFCE7', text: '#166534' },
  sold:         { bg: '#FEE2E2', text: '#991B1B' },
  on_hold:      { bg: '#FEF3C7', text: '#92400E' },
  coming_soon:  { bg: '#EDE9FE', text: '#5B21B6' },
};