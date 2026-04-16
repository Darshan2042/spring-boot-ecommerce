import React from 'react';
import theme from '../styles/theme';

import { motion } from 'framer-motion';

/**
 * Modern, reusable Button Component
 * Supports multiple variants, sizes, and states
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  ...props
}) => {
  const getButtonStyle = () => {
    let bgColor = theme.colors.primary;
    let textColor = 'white';
    let border = 'none';

    switch (variant) {
      case 'primary':
        bgColor = `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`;
        textColor = theme.colors.gray800;
        break;
      case 'secondary':
        bgColor = 'white';
        textColor = theme.colors.gray800;
        break;
      case 'outline':
        bgColor = 'transparent';
        textColor = theme.colors.gray800;
        border = `2px solid ${theme.colors.primary}`;
        break;
      case 'danger':
        bgColor = `linear-gradient(135deg, ${theme.colors.error} 0%, ${theme.colors.error}80 100%)`;
        textColor = 'white';
        break;
      default:
        bgColor = theme.colors.primary;
        textColor = theme.colors.gray800;
    }

    let padding = `${theme.spacing.md} ${theme.spacing.lg}`;
    let fontSize = theme.typography.fontSize.base;
    let borderRadius = theme.borderRadius.lg;

    if (size === 'sm') {
      padding = `${theme.spacing.sm} ${theme.spacing.md}`;
      fontSize = theme.typography.fontSize.sm;
      borderRadius = theme.borderRadius.md;
    } else if (size === 'lg') {
      padding = `${theme.spacing.lg} ${theme.spacing.xl}`;
      fontSize = theme.typography.fontSize.lg;
    }

    return {
      background: bgColor,
      color: textColor,
      border,
      padding,
      fontSize,
      borderRadius,
      fontWeight: theme.typography.fontWeight.semibold,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || loading ? 0.6 : 1,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : theme.shadows.sm,
      transition: 'background 0.3s ease, border 0.3s ease, color 0.3s ease',
    };
  };

  return (
    <motion.button
      disabled={disabled || loading}
      style={getButtonStyle()}
      className={className}
      whileHover={disabled ? {} : { scale: 1.02, y: -2, boxShadow: theme.shadows.lg }}
      whileTap={disabled ? {} : { scale: 0.98, y: 0, boxShadow: theme.shadows.sm }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading && <span>⏳</span>}
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

/**
 * Modern Card Component
 */
export const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: {
      background: theme.colors.backgroundSecondary,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadows.sm,
    },
    elevated: {
      background: theme.colors.backgroundSecondary,
      border: 'none',
      boxShadow: theme.shadows.lg,
    },
    bordered: {
      background: theme.colors.backgroundSecondary,
      border: `2px solid ${theme.colors.primary}`,
      boxShadow: 'none',
    },
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: theme.shadows.xl }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...variants[variant],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Modern Input Component
 */
export const Input = ({
  label,
  error,
  touched,
  disabled = false,
  icon = null,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div style={{ marginBottom: theme.spacing.md }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontWeight: theme.typography.fontWeight.medium,
            marginBottom: theme.spacing.sm,
            color: theme.colors.text,
          }}
        >
          {label}
        </label>
      )}
      <motion.div 
        style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        animate={{
          boxShadow: isFocused ? `0 0 0 3px ${theme.colors.primaryLight}` : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: theme.borderRadius.lg }}
      >
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: theme.spacing.md,
              color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
              pointerEvents: 'none',
              transition: 'color 0.2s',
            }}
          >
            {icon}
          </span>
        )}
        <input
          style={{
            width: '100%',
            padding: icon
              ? `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xl}`
              : theme.spacing.md,
            fontSize: theme.typography.fontSize.base,
            border: `1px solid ${error && touched ? theme.colors.error : (isFocused ? theme.colors.primary : theme.colors.border)}`,
            borderRadius: theme.borderRadius.lg,
            background: disabled ? theme.colors.gray100 : theme.colors.backgroundSecondary,
            color: theme.colors.text,
            transition: 'border-color 0.2s',
            outline: 'none',
          }}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          {...props}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: error && touched ? 1 : 0, y: error && touched ? 0 : -5 }}
        style={{
          color: theme.colors.error,
          fontSize: theme.typography.fontSize.sm,
          marginTop: theme.spacing.sm,
          display: error && touched ? 'block' : 'none'
        }}
      >
        {error}
      </motion.p>
    </div>
  );
};

/**
 * Modern Badge Component
 */
export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: {
      background: `${theme.colors.primary}20`,
      color: theme.colors.primary,
    },
    success: {
      background: `${theme.colors.success}20`,
      color: theme.colors.success,
    },
    error: {
      background: `${theme.colors.error}20`,
      color: theme.colors.error,
    },
    warning: {
      background: `${theme.colors.warning}20`,
      color: theme.colors.warning,
    },
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.borderRadius.full,
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.semibold,
        ...variants[variant],
      }}
      className={className}
    >
      {children}
    </span>
  );
};

/**
 * Modern Alert Component
 */
export const Alert = ({ children, type = 'info', className = '' }) => {
  const typeStyles = {
    info: {
      background: `${theme.colors.info}20`,
      border: `2px solid ${theme.colors.info}`,
      color: theme.colors.info,
    },
    success: {
      background: `${theme.colors.success}20`,
      border: `2px solid ${theme.colors.success}`,
      color: theme.colors.success,
    },
    error: {
      background: `${theme.colors.error}20`,
      border: `2px solid ${theme.colors.error}`,
      color: theme.colors.error,
    },
    warning: {
      background: `${theme.colors.warning}20`,
      border: `2px solid ${theme.colors.warning}`,
      color: theme.colors.warning,
    },
  };

  return (
    <div
      style={{
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        fontSize: theme.typography.fontSize.sm,
        ...typeStyles[type],
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default {
  Button,
  Card,
  Input,
  Badge,
  Alert,
};
