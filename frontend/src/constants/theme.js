export const Colors = {
  // Brand
  primary: '#003366',       // Deep navy — Miller Mobility blue
  primaryLight: '#1A4D8A',
  primaryDark: '#001F3F',
  accent: '#E63946',        // Alert red for badges / CTAs
  accentLight: '#FF6B6B',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F7F9FC',
  gray50: '#F0F4F8',
  gray100: '#E2E8F0',
  gray200: '#CBD5E0',
  gray400: '#94A3B8',
  gray600: '#475569',
  gray800: '#1E293B',
  black: '#0F172A',

  // Semantic
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0284C7',

  // Backgrounds
  background: '#F7F9FC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
};

export const Typography = {
  // Font families (loaded via expo-font or system)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    heavy: 'System',
  },

  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 19,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
};