import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import theme from '../styles/theme';
import { Button } from '../components/UIComponents';

// Custom hook for admin login state
const useAdminLoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const newErrors = { ...errors };

    if (name === 'username') {
      if (!value.trim()) {
        newErrors.username = 'Username is required';
      } else if (value.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else {
        delete newErrors.username;
      }
    } else if (name === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else if (value.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  }, [errors]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  return {
    formData,
    setFormData,
    errors,
    touched,
    handleChange,
    handleBlur,
  };
};

const AdminLoginPage = ({ setCurrentPage }) => {
  const { login } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState('');
  const containerRef = useRef(null);

  const form = useAdminLoginForm();

  // Memoized isFormValid
  const isFormValid = useMemo(() => {
    return (
      form.formData.username &&
      form.formData.password &&
      !form.errors.username &&
      !form.errors.password
    );
  }, [form.formData, form.errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);

    try {
      const success = await login(form.formData.username, form.formData.password);

      if (success) {
        if (rememberMe) {
          localStorage.setItem('adminRemember', form.formData.username);
        }
        setCurrentPage('admin');
      }
    } catch (error) {
      setServerError(error.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  }, [form.formData, login, rememberMe, setCurrentPage]);

  // Load remembered username on mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('adminRemember');
    if (remembered) {
      form.setFormData((prev) => ({ ...prev, username: remembered }));
      setRememberMe(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FBFD 0%, #EAF4F8 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '400px',
          height: '400px',
          background: 'rgba(191, 215, 227, 0.4)',
          borderRadius: '50%',
          opacity: 0.9,
          filter: 'blur(80px)',
          animation: 'pulse 5s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '400px',
          height: '400px',
          background: 'rgba(139, 188, 211, 0.4)',
          borderRadius: '50%',
          opacity: 0.8,
          filter: 'blur(80px)',
          animation: 'pulse 5s ease-in-out infinite 2s',
          zIndex: 0,
        }}
      />

      {/* Admin Badge */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: theme.spacing.xl,
          zIndex: 10,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, #BFD7E3 0%, #8bbcd3 100%)`,
            color: '#1E293B',
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            borderRadius: theme.borderRadius.full,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.bold,
            boxShadow: theme.shadows.lg,
          }}
        >
          🔐 Administration Portal
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          background: theme.colors.backgroundSecondary,
          borderRadius: theme.borderRadius['2xl'],
          boxShadow: theme.shadows['2xl'],
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '420px',
          border: `1px solid ${theme.colors.primary}40`,
          zIndex: 10,
          animation: 'fadeIn 0.5s ease-out',
        }}
      >
        {/* Header with Gradient */}
        <div
          style={{
            background: `linear-gradient(135deg, #BFD7E3 0%, #8bbcd3 100%)`,
            padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <h1
            style={{
              fontSize: theme.typography.fontSize['4xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: '#1E293B',
              marginBottom: theme.spacing.sm,
              position: 'relative',
              zIndex: 2,
            }}
          >
            🛍️ ShopHub
          </h1>
          <p
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: 'rgba(30, 41, 59, 0.8)',
              position: 'relative',
              zIndex: 2,
              letterSpacing: '0.1em',
              fontWeight: 'bold',
            }}
          >
            ADMIN DASHBOARD
          </p>
        </div>

        {/* Form Container */}
        <div style={{ padding: theme.spacing.xl }}>
          {/* Demo Credentials Card */}
          <div
            style={{
              marginBottom: theme.spacing.lg,
              padding: theme.spacing.md,
              background: `linear-gradient(135deg, #BFD7E3 0%, #8bbcd3 100%)`,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.md,
              border: `1px solid #8bbcd3`,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <div style={{ display: 'flex', gap: theme.spacing.md }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span>
              <div>
                <p style={{ color: '#1E293B', fontWeight: 'bold', fontSize: theme.typography.fontSize.sm, marginBottom: theme.spacing.sm }}>
                  Demo Credentials:
                </p>
                <p style={{ color: '#1E293B', fontSize: theme.typography.fontSize.xs, opacity: 0.9 }}>
                  <strong>Username:</strong> admin<br />
                  <strong>Password:</strong> admin123
                </p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {serverError && (
            <div
              style={{
                marginBottom: theme.spacing.lg,
                padding: theme.spacing.md,
                background: `${theme.colors.error}20`,
                border: `1px solid ${theme.colors.error}`,
                borderRadius: theme.borderRadius.lg,
                color: theme.colors.error,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                animation: 'slideDown 0.3s ease-out',
              }}
            >
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
            {/* Username Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.text,
                }}
              >
                👤 Admin Username
              </label>
              <input
                type="text"
                name="username"
                value={form.formData.username}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="Enter admin username"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: `1px solid ${form.errors.username && form.touched.username ? theme.colors.error : theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text,
                  background: form.errors.username && form.touched.username ? `${theme.colors.error}10` : theme.colors.backgroundSecondary,
                  transition: `all ${theme.transitions.fast}`,
                  boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}30`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                  form.handleBlur(e);
                }}
              />
              {form.errors.username && form.touched.username && (
                <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.error, marginTop: theme.spacing.sm }}>
                  {form.errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.text,
                }}
              >
                🔒 Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.formData.password}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    paddingRight: '40px',
                    border: `1px solid ${form.errors.password && form.touched.password ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text,
                    background: form.errors.password && form.touched.password ? `${theme.colors.error}10` : theme.colors.backgroundSecondary,
                    transition: `all ${theme.transitions.fast}`,
                    boxSizing: 'border-box',
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}30`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.colors.border;
                    e.target.style.boxShadow = 'none';
                    form.handleBlur(e);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: theme.spacing.md,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {form.errors.password && form.touched.password && (
                <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.error, marginTop: theme.spacing.sm }}>
                  {form.errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, paddingTop: theme.spacing.md }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  border: `1px solid ${theme.colors.primary}`,
                }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text, cursor: 'pointer' }}>
                Remember this username
              </label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              style={{
                width: '100%',
                marginTop: theme.spacing.xl,
                background: `linear-gradient(135deg, #BFD7E3 0%, #8bbcd3 100%)`,
                color: '#1E293B',
                boxShadow: '0 10px 30px rgba(191, 215, 227, 0.4)',
                fontWeight: 'bold',
                border: 'none',
              }}
            >
              {loading ? '🔄 Authenticating...' : '🔑 Access Admin Panel'}
            </Button>

            {/* Help Section */}
            <div style={{ textAlign: 'center', marginTop: theme.spacing.xl, paddingTop: theme.spacing.lg, borderTop: `1px solid ${theme.colors.border}` }}>
              <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>
                Need assistance?
              </p>
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.primary,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: `color ${theme.transitions.fast}`,
                  textDecoration: 'underline',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = theme.colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = theme.colors.primary;
                }}
              >
                ← Back to Store
              </button>
            </div>
          </form>
        </div>

        {/* Footer Security Info */}
        <div
          style={{
            background: theme.colors.background,
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            borderTop: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.md,
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.textSecondary,
            textAlign: 'center',
          }}
        >
          <span>🔐</span>
          <p>Admin access is protected and audited for security</p>
        </div>
      </div>

      <style>{`
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
