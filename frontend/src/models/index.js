// Plain-object "models" with factory functions and helpers.
// These mirror the Django serializer shapes and provide sensible defaults.

// ─── Category ───────────────────────────────────────────────────────────────
export const createCategory = (data = {}) => ({
  id: data.id ?? null,
  name: data.name ?? '',
  slug: data.slug ?? '',
  description: data.description ?? '',
  icon: data.icon ?? 'tag',
  sortOrder: data.sort_order ?? 0,
  productCount: data.product_count ?? 0,
});

// ─── Brand ──────────────────────────────────────────────────────────────────
export const createBrand = (data = {}) => ({
  id: data.id ?? null,
  name: data.name ?? '',
  logoUrl: data.logo_url ?? null,
  website: data.website ?? '',
});

// ─── Product Image ───────────────────────────────────────────────────────────
export const createProductImage = (data = {}) => ({
  id: data.id ?? null,
  imageUrl: data.image_url ?? null,
  altText: data.alt_text ?? '',
  isPrimary: data.is_primary ?? false,
  sortOrder: data.sort_order ?? 0,
});

// ─── Vehicle Conversion ──────────────────────────────────────────────────────
export const createVehicleConversion = (data = {}) => ({
  year: data.year ?? null,
  make: data.make ?? '',
  model: data.model ?? '',
  trim: data.trim ?? '',
  mileage: data.mileage ?? null,
  color: data.color ?? '',
  vin: data.vin ?? '',
  bodyStyle: data.body_style ?? '',
  bodyStyleDisplay: data.body_style_display ?? '',
  entryType: data.entry_type ?? '',
  entryTypeDisplay: data.entry_type_display ?? '',
  rampLengthInches: data.ramp_length_inches ?? null,
  loweredFloorInches: data.lowered_floor_inches ?? null,
  doorOpeningHeightInches: data.door_opening_height_inches ?? null,
  doorOpeningWidthInches: data.door_opening_width_inches ?? null,
  driverCanRemainInWheelchair: data.driver_can_remain_in_wheelchair ?? false,
  passengerPositions: data.passenger_positions ?? 1,
  conversionBrand: data.conversion_brand ?? '',
});

// ─── Product ─────────────────────────────────────────────────────────────────
export const createProduct = (data = {}) => ({
  id: data.id ?? null,
  name: data.name ?? '',
  slug: data.slug ?? '',
  shortDescription: data.short_description ?? '',
  description: data.description ?? '',
  categoryName: data.category_name ?? (data.category?.name ?? ''),
  brandName: data.brand_name ?? (data.brand?.name ?? ''),
  brand: data.brand ? createBrand(data.brand) : null,
  category: data.category ? createCategory(data.category) : null,
  price: data.price ? parseFloat(data.price) : null,
  msrp: data.msrp ? parseFloat(data.msrp) : null,
  displayPrice: data.display_price ?? 'Contact Us',
  callForPrice: data.call_for_price ?? false,
  savings: data.savings ? parseFloat(data.savings) : null,
  condition: data.condition ?? 'new',
  conditionDisplay: data.condition_display ?? 'New',
  status: data.status ?? 'available',
  statusDisplay: data.status_display ?? 'Available',
  isFeatured: data.is_featured ?? false,
  specifications: data.specifications ?? {},
  modelNumber: data.model_number ?? '',
  sku: data.sku ?? '',
  primaryImage: data.primary_image_url ?? null,
  images: (data.images ?? []).map(createProductImage),
  conversionDetails: data.conversion_details ? createVehicleConversion(data.conversion_details) : null,
  createdAt: data.created_at ? new Date(data.created_at) : null,
  updatedAt: data.updated_at ? new Date(data.updated_at) : null,
});

// Helpers
export const isAvailable = (product) => product.status === 'available';
export const isVehicle = (product) => !!product.conversionDetails;
export const formatPrice = (price) =>
  price != null ? `$${Number(price).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : 'Contact Us';

// ─── Deal ────────────────────────────────────────────────────────────────────
export const createDeal = (data = {}) => ({
  id: data.id ?? null,
  title: data.title ?? '',
  slug: data.slug ?? '',
  dealType: data.deal_type ?? '',
  dealTypeDisplay: data.deal_type_display ?? '',
  description: data.description ?? '',
  shortDescription: data.short_description ?? '',
  discountPercent: data.discount_percent ? parseFloat(data.discount_percent) : null,
  discountAmount: data.discount_amount ? parseFloat(data.discount_amount) : null,
  promoCode: data.promo_code ?? '',
  financingApr: data.financing_apr ? parseFloat(data.financing_apr) : null,
  financingMonths: data.financing_months ?? null,
  badgeLabel: data.badge_label ?? '',
  badgeColor: data.badge_color ?? '#E63946',
  isActive: data.is_active ?? true,
  isValid: data.is_valid ?? true,
  startDate: data.start_date ? new Date(data.start_date) : null,
  endDate: data.end_date ? new Date(data.end_date) : null,
  daysRemaining: data.days_remaining ?? null,
  imageUrl: data.image ?? null,
  isFeatured: data.is_featured ?? false,
  productCount: data.product_count ?? 0,
});

export const dealBadgeText = (deal) => {
  if (deal.badgeLabel) return deal.badgeLabel;
  if (deal.discountPercent) return `${deal.discountPercent}% OFF`;
  if (deal.discountAmount) return `Save $${deal.discountAmount.toLocaleString()}`;
  if (deal.financingApr === 0) return '0% APR';
  if (deal.financingApr) return `${deal.financingApr}% APR`;
  return deal.dealTypeDisplay;
};

// ─── Trade-In Request ────────────────────────────────────────────────────────
export const createTradeInRequest = (overrides = {}) => ({
  year: '',
  make: '',
  model: '',
  mileage: '',
  conditionNotes: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  zipCode: '',
  interestedIn: null,
  notes: '',
  ...overrides,
});

export const tradeInToPayload = (form) => ({
  year: parseInt(form.year, 10),
  make: form.make,
  model: form.model,
  mileage: parseInt(form.mileage, 10),
  condition_notes: form.conditionNotes,
  first_name: form.firstName,
  last_name: form.lastName,
  email: form.email,
  phone: form.phone,
  zip_code: form.zipCode,
  interested_in: form.interestedIn,
  notes: form.notes,
});