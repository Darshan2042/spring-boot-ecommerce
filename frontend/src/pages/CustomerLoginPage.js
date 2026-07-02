import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import theme from '../styles/theme';
import { Button } from '../components/UIComponents';

// Custom hook for form state management
const useLoginForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value, isRegister) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Username is required';
        } else if (value.length < 3) {
          newErrors.username = 'Username must be at least 3 characters';
        } else {
          delete newErrors.username;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (isRegister && value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (isRegister && value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'firstName':
      case 'lastName':
        if (isRegister && !value.trim()) {
          newErrors[name] = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else {
          delete newErrors[name];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  }, [errors, formData.password]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value, !isLogin);
    }
  }, [touched, validateField, isLogin]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value, !isLogin);
  }, [validateField, isLogin]);

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
  }, [isLogin]);

  return {
    formData,
    setFormData,
    errors,
    isLogin,
    toggleMode,
    handleChange,
    handleBlur,
    touched,
  };
};

const CustomerLoginPage = ({ setCurrentPage }) => {
  const { login, register } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const containerRef = useRef(null);

  const form = useLoginForm();

  // Memoized isFormValid
  const isFormValid = useMemo(() => {
    if (form.isLogin) {
      return (
        form.formData.username &&
        form.formData.password &&
        !form.errors.username &&
        !form.errors.password
      );
    } else {
      return (
        form.formData.username &&
        form.formData.email &&
        form.formData.password &&
        form.formData.confirmPassword &&
        form.formData.firstName &&
        form.formData.lastName &&
        !Object.keys(form.errors).length
      );
    }
  }, [form.formData, form.errors, form.isLogin]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);

    try {
      let result;
      if (form.isLogin) {
        result = await login(form.formData.username, form.formData.password);
      } else {
        result = await register(form.formData);
      }

      if (result.success && result.user) {
        // Add a small delay to ensure context updates propagate
        setTimeout(() => {
          // Check if user is admin based on roles
          const isAdmin = result.user?.roles?.some(role => 
            role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN'
          );
          
          // Navigate to appropriate page based on role
          if (isAdmin) {
            setCurrentPage('admin');
          } else {
            setCurrentPage('products');
          }
        }, 150);
      }
    } catch (error) {
      setServerError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [form.isLogin, form.formData, login, register, setCurrentPage]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: theme.colors.primary,
          borderRadius: '50%',
          opacity: 0.1,
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: theme.colors.secondary,
          borderRadius: '50%',
          opacity: 0.1,
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite 2s',
          zIndex: 0,
        }}
      />

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.78)',
          borderRadius: theme.borderRadius['2xl'],
          boxShadow: '0 24px 80px rgba(15,23,42,0.14)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '520px',
          border: '1px solid rgba(255,255,255,0.6)',
          animation: 'fadeIn 0.5s ease-out',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <h1
            style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: '#FFFFFF',
              marginBottom: theme.spacing.sm,
              position: 'relative',
              zIndex: 2,
            }}
          >
            ShopHub
          </h1>
          <p
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: 'rgba(255,255,255,0.84)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {form.isLogin ? 'Welcome back!' : 'Join our community!'}
          </p>
        </div>

        {/* Form Container */}
        <div style={{ padding: theme.spacing.xl }}>
          {/* Error Alert */}
          {serverError && (
            <div
              style={{
                marginBottom: theme.spacing.lg,
                padding: theme.spacing.md,
                background: `${theme.colors.error}12`,
                border: `1px solid ${theme.colors.error}30`,
                borderRadius: theme.borderRadius.xl,
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
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.formData.username}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="Enter your username"
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
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                  form.handleBlur(e);
                }}
              />
              {form.errors.username && form.touched.username && (
                <p
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.error,
                    marginTop: theme.spacing.sm,
                    animation: 'slideDown 0.2s ease-out',
                  }}
                >
                  {form.errors.username}
                </p>
              )}
            </div>

            {/* Email Field (Register Only) */}
            {!form.isLogin && (
              <div style={{ animation: 'slideDown 0.3s ease-out' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text,
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.formData.email}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  placeholder="your@email.com"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    border: `1px solid ${form.errors.email && form.touched.email ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text,
                    background: form.errors.email && form.touched.email ? `${theme.colors.error}10` : theme.colors.backgroundSecondary,
                    transition: `all ${theme.transitions.fast}`,
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.colors.border;
                    e.target.style.boxShadow = 'none';
                    form.handleBlur(e);
                  }}
                />
                {form.errors.email && form.touched.email && (
                  <p
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.error,
                      marginTop: theme.spacing.sm,
                    }}
                  >
                    {form.errors.email}
                  </p>
                )}
              </div>
            )}

            {/* First & Last Name (Register Only) */}
            {!form.isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, animation: 'slideDown 0.3s ease-out' }}>
                {[{ name: 'firstName', label: 'First Name' }, { name: 'lastName', label: 'Last Name' }].map((field) => (
                  <div key={field.name}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.spacing.sm,
                        color: theme.colors.text,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={form.formData[field.name]}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      placeholder={field.label}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                        border: `1px solid ${form.errors[field.name] && form.touched[field.name] ? theme.colors.error : theme.colors.border}`,
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.typography.fontSize.base,
                        color: theme.colors.text,
                        background: form.errors[field.name] && form.touched[field.name] ? `${theme.colors.error}10` : theme.colors.backgroundSecondary,
                        transition: `all ${theme.transitions.fast}`,
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.border;
                        e.target.style.boxShadow = 'none';
                        form.handleBlur(e);
                      }}
                    />
                    {form.errors[field.name] && form.touched[field.name] && (
                      <p
                        style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.error,
                          marginTop: theme.spacing.sm,
                        }}
                      >
                        {form.errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

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
                Password
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
                    padding: `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.lg}`,
                    border: `1px solid ${form.errors.password && form.touched.password ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text,
                    background: form.errors.password && form.touched.password ? `${theme.colors.error}10` : theme.colors.backgroundSecondary,
                    transition: `all ${theme.transitions.fast}`,
                    boxSizing: 'border-box',
                    paddingRight: '40px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
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
                <p
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.error,
                    marginTop: theme.spacing.sm,
                  }}
                >
                  {form.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password (Register Only) */}
            {!form.isLogin && (
              <div style={{ animation: 'slideDown 0.3s ease-out' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text,
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.formData.confirmPassword}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    placeholder="••••••••"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.lg}`,
                      border: `1px solid ${form.errors.confirmPassword && form.touched.confirmPassword ? theme.colors.error : theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.base,
                      color: theme.colors.text,
                      background: form.errors.confirmPassword && form.touched.confirmPassword ? `${theme.colors.error}10` : theme.colors.backgroundSecondary,
                      transition: `all ${theme.transitions.fast}`,
                      boxSizing: 'border-box',
                      paddingRight: '40px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.border;
                      e.target.style.boxShadow = 'none';
                      form.handleBlur(e);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {form.errors.confirmPassword && form.touched.confirmPassword && (
                  <p
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.error,
                      marginTop: theme.spacing.sm,
                    }}
                  >
                    {form.errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              style={{
                width: '100%',
                marginTop: theme.spacing.lg,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#FFFFFF',
                fontWeight: 'bold',
                  border: 'none',
                  borderRadius: theme.borderRadius.full,
                  boxShadow: '0 14px 30px rgba(37,99,235,0.25)',
              }}
            >
              {loading ? '⏳ Loading...' : form.isLogin ? '🔓 Sign In' : '✨ Create Account'}
            </Button>

            {/* Toggle Mode */}
            <div
              style={{
                textAlign: 'center',
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <p
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.textSecondary,
                }}
              >
                {form.isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={form.toggleMode}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.colors.primary,
                    fontWeight: theme.typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: `color ${theme.transitions.fast}`,
                    textDecoration: 'underline',
                    opacity: loading ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.colors.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.colors.primary;
                  }}
                >
                  {form.isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
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
      `}</style>
    </div>
  );
};

export default CustomerLoginPage;
