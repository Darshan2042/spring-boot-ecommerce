export const theme = {
  // Premium e-commerce palette
  colors: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#DBEAFE',

    secondary: '#0F172A',
    secondaryDark: '#020617',
    secondaryLight: '#1E293B',

    accent: '#14B8A6',

    // Semantic Colors
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#2563EB',

    // Neutral Colors
    white: '#FFFFFF',
    black: '#0F172A',
    gray50: '#F8FAFC',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
    gray900: '#0F172A',

    // Background & Text
    background: '#F8FAFC',
    backgroundSecondary: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    border: '#E2E8F0',
    borderDark: '#CBD5E1',
  },

  // SPACING (UNCHANGED - already perfect)
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
    '4xl': '4rem',
  },

  // TYPOGRAPHY (UNCHANGED - good)
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // BORDER RADIUS (slightly smoother feel)
  borderRadius: {
    none: '0',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    '2xl': '24px',
    full: '9999px',
  },

  // SHADOWS (softer & premium)
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 8px 20px rgba(0,0,0,0.08)',
    xl: '0 12px 28px rgba(0,0,0,0.10)',
    '2xl': '0 20px 40px rgba(0,0,0,0.12)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.05)',
  },

  // LAYOUT (UNCHANGED)
  layout: {
    sidebars: {
      width: '280px',
      collapsedWidth: '80px',
    },
    navbar: {
      height: '64px',
    },
    maxWidth: '1400px',
  },

  // TRANSITIONS (slightly smoother)
  transitions: {
    fast: '180ms ease',
    normal: '260ms ease',
    slow: '400ms ease',
  },

  // Z-INDEX (UNCHANGED)
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    offcanvas: 1050,
    modal: 1060,
    popover: 1070,
    tooltip: 1080,
  },

  // BREAKPOINTS (UNCHANGED)
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // 🔥 CLEAN SUBTLE GRADIENTS (NO FLASHY COLORS)
  gradients: {
    primary: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    secondary: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.46) 100%)',
    success: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  },
};


// Utility function (UNCHANGED)
export const getThemeValue = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme) || null;
};

export default theme;