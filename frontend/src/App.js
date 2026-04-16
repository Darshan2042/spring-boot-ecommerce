import React, { useState, useCallback, useMemo, Suspense, lazy, useTransition } from 'react';
import ModernNavbar from './components/ModernNavbar';
import Notification from './components/Notification';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { useAppContext } from './context/AppContext';
import theme from './styles/theme';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CustomerLoginPage = lazy(() => import('./pages/CustomerLoginPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));

function App() {
  const { currentUser } = useAppContext();
  const [currentPage, setCurrentPage] = useState(() => {
    // Parse initial page from URL path
    const path = window.location.pathname.substring(1);
    return path || 'home';
  });
  const [, startTransition] = useTransition();

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        startTransition(() => setCurrentPage(event.state.page));
      } else {
        startTransition(() => setCurrentPage('home'));
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial state so first back works cleanly
    if (!window.history.state) {
      window.history.replaceState({ page: currentPage }, '', `/${currentPage === 'home' ? '' : currentPage}`);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if current user is admin
  const isAdmin = useMemo(() => {
    if (!currentUser?.roles) return false;
    return currentUser.roles.some(role => 
      role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN'
    );
  }, [currentUser]);

  // Handle page navigation with role-based restrictions
  const handlePageChange = useCallback((page) => {
    // Restrict admin from accessing customer features
    if (isAdmin && ['cart', 'checkout'].includes(page)) {
      console.warn('Admins cannot access this page');
      page = 'admin';
    }

    // Update URL without reloading page
    if (page !== currentPage) {
      window.history.pushState({ page }, '', `/${page === 'home' ? '' : page}`);
      startTransition(() => setCurrentPage(page));
    }
  }, [isAdmin, currentPage]);

  // Memoized page content to prevent unnecessary re-renders
  const pageContent = useMemo(() => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={handlePageChange} />;
      
      case 'products':
        return <ProductsPage setCurrentPage={handlePageChange} />;
      
      case 'customerLogin':
        return <CustomerLoginPage setCurrentPage={handlePageChange} />;
      
      case 'adminLogin':
        return <AdminLoginPage setCurrentPage={handlePageChange} />;
      
      case 'cart':
        return <CartPage setCurrentPage={handlePageChange} />;
      
      case 'checkout':
        return <CheckoutPage setCurrentPage={handlePageChange} />;
      
      case 'orders':
        return <OrdersPage setCurrentPage={handlePageChange} />;
      
      case 'admin':
        return <AdminDashboard setCurrentPage={handlePageChange} />;
      
      default:
        return <HomePage setCurrentPage={handlePageChange} />;
    }
  }, [currentPage, handlePageChange]);

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8FBFD 0%, #EAF4F8 100%)', backgroundAttachment: 'fixed', display: 'flex', flexDirection: 'column' }}>
        {/* Hide navbar on login pages */}
        {!['customerLogin', 'adminLogin'].includes(currentPage) && (
          <ModernNavbar currentPage={currentPage} setCurrentPage={handlePageChange} />
        )}
        
        <Suspense fallback={<LoadingSpinner />}>
          <main 
            style={{
              flex: 1,
              padding: !['customerLogin', 'adminLogin'].includes(currentPage) ? theme.spacing.xl : 0,
              transition: `all ${theme.transitions.normal}`,
            }}
          >
            {pageContent}
          </main>
        </Suspense>
        
        <Notification />
      </div>
    </ErrorBoundary>
  );
}

export default App;
