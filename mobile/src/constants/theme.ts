export const COLORS = {
  navy: {
    900: '#0a0a1a',
    800: '#1A1A2E',
    700: '#16213E',
    600: '#0F3460',
    500: '#1a3a6b',
    400: '#2a5298',
  },
  gold: '#D4AF37',
  goldLight: '#F0D060',
  goldDark: '#B8960F',
  accent: {
    red: '#E94560',
    green: '#4CAF50',
    blue: '#2196F3',
    orange: '#FF9800',
  },
  white: '#FFFFFF',
  black: '#000000',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    tertiary: 'rgba(255,255,255,0.4)',
    muted: 'rgba(255,255,255,0.2)',
  },
  bg: {
    primary: '#0a0a1a',
    card: '#1A1A2E',
    surface: '#16213E',
    border: 'rgba(255,255,255,0.08)',
  },
};

export const FONTS = {
  regular: { fontSize: 14, color: COLORS.text.primary },
  medium: { fontSize: 14, fontWeight: '500' as const, color: COLORS.text.primary },
  semibold: { fontSize: 14, fontWeight: '600' as const, color: COLORS.text.primary },
  bold: { fontSize: 14, fontWeight: '700' as const, color: COLORS.text.primary },
  h1: { fontSize: 28, fontWeight: '700' as const, color: COLORS.text.primary },
  h2: { fontSize: 22, fontWeight: '700' as const, color: COLORS.text.primary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: COLORS.text.primary },
  caption: { fontSize: 12, color: COLORS.text.tertiary },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
