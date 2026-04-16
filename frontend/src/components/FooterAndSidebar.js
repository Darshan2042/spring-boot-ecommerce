import React from 'react';
import theme from '../styles/theme';
import { Flex } from './LayoutComponents';

/**
 * Footer Component - Consistent across all pages
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: theme.colors.backgroundSecondary,
        borderTop: `1px solid ${theme.colors.border}`,
        marginTop: 'auto',
        padding: theme.spacing['2xl'],
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: theme.spacing.xl,
          marginBottom: theme.spacing['2xl'],
        }}
      >
        {/* About */}
        <div>
          <h4
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            ShopHub
          </h4>
          <p
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              lineHeight: theme.typography.lineHeight.relaxed,
            }}
          >
            Your one-stop shop for quality products at great prices. We're committed to providing excellent customer service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            Quick Links
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {['Home', 'Products', 'About', 'Contact'].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    transition: `color ${theme.transitions.fast}`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.colors.textSecondary;
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            Customer Service
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {['Support', 'Returns', 'FAQ', 'Shipping'].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    transition: `color ${theme.transitions.fast}`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.colors.textSecondary;
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            Legal
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Us'].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    transition: `color ${theme.transitions.fast}`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.colors.textSecondary;
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: `1px solid ${theme.colors.border}`,
          paddingTop: theme.spacing.lg,
          textAlign: 'center',
          color: theme.colors.textSecondary,
          fontSize: theme.typography.fontSize.sm,
        }}
      >
        <p>© {currentYear} ShopHub. All rights reserved. | Made with ❤️ by ShopHub Team</p>
      </div>
    </footer>
  );
};

/**
 * Sidebar Component - For admin and user panels
 */
export const Sidebar = ({ items, activeItem, onItemClick, isAdmin = false }) => {
  return (
    <aside
      style={{
        width: theme.layout.sidebars.width,
        background: theme.colors.backgroundSecondary,
        borderRight: `1px solid ${theme.colors.border}`,
        padding: theme.spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        position: 'sticky',
        top: '64px',
        boxShadow: theme.shadows.sm,
      }}
    >
      {/* Logo/Title */}
      <div
        style={{
          marginBottom: theme.spacing.xl,
          paddingBottom: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <h3
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text,
          }}
        >
          {isAdmin ? '⚙️ Admin Panel' : '👤 My Account'}
        </h3>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1 }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            style={{
              width: '100%',
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              marginBottom: theme.spacing.sm,
              background: activeItem === item.id ? theme.colors.primary : 'transparent',
              color: activeItem === item.id ? 'white' : theme.colors.text,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontWeight: activeItem === item.id ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
              cursor: 'pointer',
              transition: `all ${theme.transitions.fast}`,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
            onMouseEnter={(e) => {
              if (activeItem !== item.id) {
                e.target.style.background = theme.colors.backgroundSecondary === theme.colors.background ? theme.colors.backgroundSecondary : 'rgba(99, 102, 241, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeItem !== item.id) {
                e.target.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div
        style={{
          paddingTop: theme.spacing.lg,
          borderTop: `1px solid ${theme.colors.border}`,
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.textLight,
          textAlign: 'center',
        }}
      >
        <p>ShopHub © 2026</p>
      </div>
    </aside>
  );
};

export default {
  Footer,
  Sidebar,
};
