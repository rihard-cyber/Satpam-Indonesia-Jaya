const theme = {
  colors: {
    navy: {
      900: '#0a0a1a',
      800: '#1A1A2E',
      700: '#16213E',
      600: '#0F3460',
      500: '#1a3a6b',
      400: '#2a5298',
    },
    gold: {
      DEFAULT: '#D4AF37',
      light: '#F0D060',
      dark: '#B8960F',
    },
    accent: {
      red: '#E94560',
      green: '#4CAF50',
      blue: '#2196F3',
      orange: '#FF9800',
    },
    dark: {
      bg: '#0a0a1a',
      card: '#1A1A2E',
      surface: '#16213E',
      border: '#2a2a4a',
    },
  },
  gradients: {
    primary: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
    gold: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)',
    dark: 'linear-gradient(180deg, #0a0a1a 0%, #1A1A2E 100%)',
  },
  glassmorphism: {
    background: 'rgba(26, 26, 46, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  shadows: {
    card: '0 4px 20px rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(212, 175, 55, 0.15)',
    button: '0 4px 15px rgba(15, 52, 96, 0.4)',
  },
};

export default theme;
