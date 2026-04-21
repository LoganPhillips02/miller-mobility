// ─── Colors ───────────────────────────────────────────────────────────────────
export const Colors = {
  // Brand
  primary:      '#1C4A8A',
  primaryDark:  '#133368',
  primaryLight: '#E8EFF9',
  accent:       '#E63946',

  // Neutrals
  background:  '#F4F6FA',
  surface:     '#FFFFFF',
  surfaceAlt:  '#F0F2F7',
  border:      '#E2E6EF',

  // Text / grays
  text:          '#1A1E2E',
  textSecondary: '#4B5573',
  textMuted:     '#9BA3BF',
  white:         '#FFFFFF',
  black:         '#1A1E2E',
  gray50:        '#F9FAFB',
  gray100:       '#F3F4F6',
  gray200:       '#E5E7EB',
  gray400:       '#9BA3BF',
  gray600:       '#4B5573',
  gray800:       '#1A1E2E',

  // Status
  success: '#16A34A',
  warning: '#D97706',
  danger:  '#DC2626',
  error:   '#DC2626',
  info:    '#2563EB',
};

// Legacy uppercase alias
export const COLORS = Colors;

// ─── Typography ───────────────────────────────────────────────────────────────
export const Typography = {
  sizes: {
    xs:   11,
    sm:   13,
    base: 15,
    md:   16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 30,
  },
  weights: {
    regular:  '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    heavy:    '800',
  },
};

export const FONTS = {
  regular:  'System',
  medium:   'System',
  semiBold: 'System',
  bold:     'System',
};

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   32,
  '2xl': 48,
  '3xl': 64,
};

export const SPACING = Spacing;

// ─── Radius ──────────────────────────────────────────────────────────────────
export const Radius = {
  sm:   6,
  md:   10,
  lg:   16,
  xl:   24,
  full: 9999,
};

export const RADIUS = Radius;

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const SHADOW = Shadows;
