/**
 * Global Styles & CSS Variables
 * Defines all CSS custom properties for the entire application
 */

import theme from './theme';

const globalStyles = `
  :root {
    /* PRIMARY COLORS */
    --color-primary: ${theme.colors.primary};
    --color-primary-dark: ${theme.colors.primaryDark};
    --color-primary-light: ${theme.colors.primaryLight};
    --color-secondary: ${theme.colors.secondary};
    --color-secondary-dark: ${theme.colors.secondaryDark};
    --color-secondary-light: ${theme.colors.secondaryLight};
    
    /* SEMANTIC COLORS */
    --color-success: ${theme.colors.success};
    --color-error: ${theme.colors.error};
    --color-warning: ${theme.colors.warning};
    --color-info: ${theme.colors.info};
    
    /* NEUTRAL COLORS */
    --color-white: ${theme.colors.white};
    --color-black: ${theme.colors.black};
    --color-gray-50: ${theme.colors.gray50};
    --color-gray-100: ${theme.colors.gray100};
    --color-gray-200: ${theme.colors.gray200};
    --color-gray-300: ${theme.colors.gray300};
    --color-gray-400: ${theme.colors.gray400};
    --color-gray-500: ${theme.colors.gray500};
    --color-gray-600: ${theme.colors.gray600};
    --color-gray-700: ${theme.colors.gray700};
    --color-gray-800: ${theme.colors.gray800};
    --color-gray-900: ${theme.colors.gray900};
    
    /* BACKGROUND & TEXT */
    --color-background: ${theme.colors.background};
    --color-background-secondary: ${theme.colors.backgroundSecondary};
    --color-text: ${theme.colors.text};
    --color-text-secondary: ${theme.colors.textSecondary};
    --color-text-light: ${theme.colors.textLight};
    --color-border: ${theme.colors.border};
    
    /* SPACING */
    --space-xs: ${theme.spacing.xs};
    --space-sm: ${theme.spacing.sm};
    --space-md: ${theme.spacing.md};
    --space-lg: ${theme.spacing.lg};
    --space-xl: ${theme.spacing.xl};
    --space-2xl: ${theme.spacing['2xl']};
    
    /* TYPOGRAPHY */
    --font-size-xs: ${theme.typography.fontSize.xs};
    --font-size-sm: ${theme.typography.fontSize.sm};
    --font-size-base: ${theme.typography.fontSize.base};
    --font-size-lg: ${theme.typography.fontSize.lg};
    --font-size-xl: ${theme.typography.fontSize.xl};
    --font-size-2xl: ${theme.typography.fontSize['2xl']};
    
    --font-weight-light: ${theme.typography.fontWeight.light};
    --font-weight-normal: ${theme.typography.fontWeight.normal};
    --font-weight-medium: ${theme.typography.fontWeight.medium};
    --font-weight-semibold: ${theme.typography.fontWeight.semibold};
    --font-weight-bold: ${theme.typography.fontWeight.bold};
    
    /* BORDER RADIUS */
    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    --radius-xl: ${theme.borderRadius.xl};
    
    /* SHADOWS */
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-xl: ${theme.shadows.xl};
    
    /* TRANSITIONS */
    --transition-fast: ${theme.transitions.fast};
    --transition-normal: ${theme.transitions.normal};
    --transition-slow: ${theme.transitions.slow};
  }

  /* RESET & BASE STYLES */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    color: var(--color-text);
    background-color: var(--color-background);
    line-height: 1.5;
    font-weight: 400;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  /* TYPOGRAPHY */
  h1 {
    font-size: var(--font-size-5xl);
    font-weight: var(--font-weight-bold);
    line-height: 1.2;
  }

  h2 {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    line-height: 1.2;
  }

  h3 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    line-height: 1.3;
  }

  h4 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
  }

  h5 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
  }

  h6 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
  }

  p {
    margin-bottom: var(--space-md);
    color: var(--color-text-secondary);
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--color-primary-dark);
  }

  /* FORMS */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* SCROLLBAR STYLING */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-gray-100);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: var(--radius-md);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-gray-400);
  }

  /* ANIMATIONS */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-fadeIn {
    animation: fadeIn var(--transition-normal);
  }

  .animate-slideDown {
    animation: slideDown var(--transition-normal);
  }

  .animate-slideUp {
    animation: slideUp var(--transition-normal);
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* UTILITY CLASSES */
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--space-md);
  }

  @media (min-width: 640px) {
    .container {
      padding: 0 var(--space-lg);
    }
  }

  @media (min-width: 1024px) {
    .container {
      padding: 0 var(--space-xl);
    }
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* ACCESSIBILITY */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-text: ${theme.colors.gray100};
      --color-text-secondary: ${theme.colors.gray400};
      --color-background: ${theme.colors.gray900};
      --color-background-secondary: ${theme.colors.gray800};
      --color-border: ${theme.colors.gray700};
    }
  }
`;

export default globalStyles;
