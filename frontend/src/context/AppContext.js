import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/apiService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error parsing currentUser from localStorage:', error);
      return null;
    }
  });
  
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null;
    } catch (error) {
      console.error('Error reading token from localStorage:', error);
      return null;
    }
  });
  
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });
  
  const [notification, setNotification] = useState(null);
  const [productRefreshTrigger, setProductRefreshTrigger] = useState(0);

  const saveCart = useCallback((newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }, []);

  const saveUser = useCallback((user, authToken) => {
    setCurrentUser(user);
    setToken(authToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', authToken);
  }, []);

  const clearAuth = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }, []);

  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    setNotification({ message, type });
    const toastOptions = {
      autoClose: duration,
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    const mappedType = {
      success: toast.success,
      error: toast.error,
      warning: toast.warn,
      info: toast.info,
    }[type] || toast;

    mappedType(message, toastOptions);
    setTimeout(() => setNotification(null), duration);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const response = await apiService.login({ username, password });
      const { token: authToken, user } = response.data;
      saveUser(user, authToken);
      showNotification('Login successful', 'success');
      return { success: true, user };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (!error.response) {
        errorMessage = 'Cannot connect to server. Make sure backend is running on port 8080';
      }
      
      console.error('Login error details:', error);
      showNotification(errorMessage, 'error', 5000);
      return { success: false, user: null };
    }
  }, [saveUser, showNotification]);

  const register = useCallback(async (userData) => {
    try {
      const response = await apiService.register(userData);
      const { token: authToken, user } = response.data;
      saveUser(user, authToken);
      showNotification('Registration successful', 'success');
      return { success: true, user };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (!error.response) {
        errorMessage = 'Cannot connect to server. Make sure backend is running on port 8080';
      }
      
      console.error('Registration error details:', error);
      showNotification(errorMessage, 'error', 5000);
      return { success: false, user: null };
    }
  }, [saveUser, showNotification]);

  const logout = useCallback(() => {
    clearAuth();
    setCart([]);
    localStorage.removeItem('cart');
    showNotification('Logged out successfully', 'success');
  }, [clearAuth, showNotification]);

  const addToCart = useCallback((product) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          price: parseFloat(product.unitPrice || product.price || 0),
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ];
    }

    saveCart(newCart);
    showNotification(`${product.name} added to cart`, 'success');
  }, [cart, saveCart, showNotification]);

  const removeFromCart = useCallback((productId) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    saveCart(newCart);
    showNotification('Item removed from cart', 'success');
  }, [cart, saveCart, showNotification]);

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const newCart = cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveCart(newCart);
    }
  }, [cart, saveCart, removeFromCart]);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const refreshProducts = useCallback(() => {
    setProductRefreshTrigger((prev) => prev + 1);
  }, []);

  const value = {
    currentUser,
    token,
    isAuthenticated: !!token,
    cart,
    notification,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    showNotification,
    productRefreshTrigger,
    refreshProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
