import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import ShoppingCartBadge from './ShoppingCartBadge';

const ModernNavbar = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logout, cart } = useAppContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isAdmin = useMemo(() => {
    if (!currentUser?.roles) return false;
    return currentUser.roles.some(
      role => role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN'
    );
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    setIsProfileOpen(false);
  };

  const menuItems = isAdmin
    ? [{ label: 'Dashboard', page: 'admin', icon: '📊' }]
    : currentUser
    ? [
        { label: 'Home', page: 'home', icon: '🏠' },
        { label: 'Products', page: 'products', icon: '🛍️' },
        { label: 'Cart', page: 'cart', icon: '🛒' },
        { label: 'Orders', page: 'orders', icon: '📦' },
      ]
    : [{ label: 'Home', page: 'home', icon: '🏠' }];

  const cartCount = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  return (
    <motion.nav
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #d1d5db',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* LOGO */}
      <motion.div
        onClick={() => setCurrentPage('home')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          fontSize: '20px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#000',
        }}
      >
        <motion.span
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🛒
        </motion.span>
        ShopHub
      </motion.div>

      {/* MENU */}
      <motion.div
        style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, staggerChildren: 0.05 }}
      >
        {menuItems.map((item) => (
          <motion.button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            whileHover={{ scale: 1.05, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background:
                currentPage === item.page ? '#BFD7E3' : '#ffffff',
              color: '#000',
              border: '1px solid #e5e7eb',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            {item.icon} {item.label}
          </motion.button>
        ))}

        {/* USER SECTION */}
        {currentUser ? (
          <motion.div
            style={{
              position: 'relative',
              marginLeft: '12px',
              borderLeft: '1px solid #e5e7eb',
              paddingLeft: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ShoppingCartBadge count={cartCount} onClick={() => setCurrentPage('cart')} />

            <motion.button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              👤 {currentUser.username}
            </motion.button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    width: '180px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ padding: '10px' }}>
                    <p style={{ fontWeight: '600', marginBottom: '6px' }}>
                      {currentUser.username}
                    </p>

                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#BFD7E3',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            style={{ display: 'flex', gap: '10px' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.button
              onClick={() => setCurrentPage('customerLogin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#BFD7E3',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Login
            </motion.button>

            <motion.button
              onClick={() => setCurrentPage('adminLogin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Admin
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.nav>
  );
};

export default ModernNavbar;