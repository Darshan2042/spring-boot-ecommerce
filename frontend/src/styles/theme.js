export const theme = {
  // CLEAN PROFESSIONAL COLOR PALETTE
  colors: {
    primary: '#BFD7E3',        // Soft blue tone
    primaryDark: '#a1c2d3',
    primaryLight: '#e6f2f8',

    secondary: '#8bbcd3',      // Darker variation for accents
    secondaryDark: '#6ea6c1',
    secondaryLight: '#d4e6ef',

    // Semantic Colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

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
    background: '#f4f8fa',
    backgroundSecondary: '#FFFFFF',
    text: '#1E293B',
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
    fast: '150ms ease',
    normal: '250ms ease',
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
    primary: 'linear-gradient(135deg, #BFD7E3 0%, #e6f2f8 100%)',
    secondary: 'linear-gradient(135deg, #f4f8fa 0%, #BFD7E3 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
  },
};


// Utility function (UNCHANGED)
export const getThemeValue = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme) || null;
};

export default theme;