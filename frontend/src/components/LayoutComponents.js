import React from 'react';
import theme from '../styles/theme';

/**
 * Modern Layout Wrapper Component
 * Provides consistent page structure with header, sidebar, and content area
 */
export const Layout = ({
  children,
  title,
  subtitle,
  showSidebar = false,
  sidebarContent = null,
  containerSize = 'xl',
  padding = true,
}) => {
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1400px',
    full: '100%',
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #F8FBFD 0%, #EAF4F8 100%)',
      }}
    >
      {/* Sidebar */}
      {showSidebar && sidebarContent && (
        <aside
          style={{
            width: theme.layout.sidebars.width,
            background: theme.colors.backgroundSecondary,
            borderRight: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.lg,
            overflowY: 'auto',
            boxShadow: theme.shadows.sm,
          }}
        >
          {sidebarContent}
        </aside>
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: padding ? theme.spacing.xl : 0,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: maxWidths[containerSize],
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Page Header */}
          {(title || subtitle) && (
            <div
              style={{
                marginBottom: theme.spacing['3xl'],
                paddingBottom: theme.spacing.xl,
                borderBottom: `2px solid ${theme.colors.border}`,
              }}
            >
              {title && (
                <h1
                  style={{
                    fontSize: theme.typography.fontSize['4xl'],
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.text,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: theme.typography.fontSize.lg,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Page Content */}
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Page Container Component
 * Wraps content with spacing and styling
 */
export const PageContainer = ({ children, className = '' }) => {
  return (
    <div
      style={{
        padding: theme.spacing.xl,
        background: 'transparent',
        borderRadius: theme.borderRadius.lg,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * Grid Component for Product/Item Lists
 */
export const Grid = ({
  children,
  columns = 3,
  gap = 'lg',
  responsive = true,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: responsive
          ? `repeat(auto-fill, minmax(280px, 1fr))`
          : `repeat(${columns}, 1fr)`,
        gap: theme.spacing[gap] || gap,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Flex Container Component
 */
export const Flex = ({
  children,
  direction = 'row',
  justify = 'flex-start',
  align = 'stretch',
  gap = 'md',
  wrap = false,
  className = '',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        gap: theme.spacing[gap] || gap,
        flexWrap: wrap ? 'wrap' : 'nowrap',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * Section Component
 */
export const Section = ({
  children,
  title,
  subtitle,
  padding = 'lg',
  spacing = 'lg',
  className = '',
}) => {
  return (
    <section
      style={{
        padding: theme.spacing[padding] || padding,
        marginBottom: theme.spacing[spacing] || spacing,
      }}
      className={className}
    >
      {title && (
        <h2
          style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
          }}
        >
          {subtitle}
        </p>
      )}
      {children}
    </section>
  );
};

/**
 * Form Group Component
 */
export const FormGroup = ({
  label,
  error,
  touched,
  children,
  required = false,
  helperText,
}) => {
  return (
    <div
      style={{
        marginBottom: theme.spacing.lg,
      }}
    >
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
          }}
        >
          {label}
          {required && <span style={{ color: theme.colors.error }}>*</span>}
        </label>
      )}

      {children}

      {error && touched && (
        <p
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.error,
            marginTop: theme.spacing.sm,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          ⚠️ {error}
        </p>
      )}

      {helperText && !error && (
        <p
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.textLight,
            marginTop: theme.spacing.sm,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

/**
 * Modal/Dialog Component
 */
export const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.backgroundSecondary,
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows['2xl'],
          maxWidth: sizes[size],
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: theme.colors.textSecondary,
              transition: `color ${theme.transitions.fast}`,
            }}
            onMouseEnter={(e) => {
              e.target.style.color = theme.colors.text;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.colors.textSecondary;
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: theme.spacing.lg }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: theme.spacing.lg,
              borderTop: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: theme.spacing.md,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  Layout,
  PageContainer,
  Grid,
  Flex,
  Section,
  FormGroup,
  Modal,
};
