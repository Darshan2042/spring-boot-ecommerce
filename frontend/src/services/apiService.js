import axios from 'axios';

// Use relative URL so it works in any environment
// In development: http://localhost:3000 calls http://localhost:8080 (backend)
// In production: both frontend and backend are on same server
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response Status: ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[API] Response Error: ${error.response.status}`, error.response.data);
      
      // Handle 401 Unauthorized - clear auth and redirect
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
      }
    } else if (error.request) {
      console.error('[API] No Response:', error.request);
    } else {
      console.error('[API] Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  register: (userData) => {
    console.log('[API] Registering user:', userData.username);
    return api.post('/auth/register', userData);
  },
  
  login: (credentials) => {
    console.log('[API] Logging in user:', credentials.username);
    return api.post('/auth/login', credentials);
  },
  
  getCurrentUser: () => {
    console.log('[API] Getting current user');
    return api.get('/auth/me');
  },

  // Products endpoints
  getProducts: (page = 0, size = 20, categoryId = null, keyword = '') => {
    let url = `/products?page=${page}&size=${size}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (keyword) url += `&keyword=${keyword}`;
    console.log('[API] Fetching products:', { page, size, categoryId, keyword });
    return api.get(url);
  },

  // Admin only - get all products (active and inactive)
  getAdminProducts: (page = 0, size = 100) => {
    const url = `/products/admin/all?page=${page}&size=${size}`;
    console.log('[API] Fetching admin products:', { page, size });
    return api.get(url);
  },
  
  getProductById: (productId) => {
    console.log('[API] Fetching product:', productId);
    return api.get(`/products/${productId}`);
  },

  createProduct: (productData) => {
    console.log('[API] Creating product:', productData.name);
    return api.post('/products', productData);
  },

  updateProduct: (productId, productData) => {
    console.log('[API] Updating product:', productId);
    return api.put(`/products/${productId}`, productData);
  },

  deleteProduct: (productId) => {
    console.log('[API] Deleting product:', productId);
    return api.delete(`/products/${productId}`);
  },

  // Categories endpoints
  getCategories: () => {
    console.log('[API] Fetching categories');
    return api.get('/product-categories');
  },

  // Cart endpoints
  getCart: () => {
    console.log('[API] Fetching cart');
    return api.get('/cart');
  },
  
  addToCart: (cartItem) => {
    console.log('[API] Adding to cart:', cartItem);
    return api.post('/cart/add', cartItem);
  },
  
  removeFromCart: (cartItemId) => {
    console.log('[API] Removing from cart:', cartItemId);
    return api.delete(`/cart/${cartItemId}`);
  },
  
  updateCartItem: (cartItemId, quantity) => {
    console.log('[API] Updating cart item:', { cartItemId, quantity });
    return api.put(`/cart/${cartItemId}`, { quantity });
  },
  
  clearCart: () => {
    console.log('[API] Clearing cart');
    return api.delete('/cart');
  },

  // Orders endpoints
  getOrders: () => {
    console.log('[API] Fetching orders');
    return api.get('/orders');
  },
  
  getAllOrders: () => {
    console.log('[API] Fetching all orders');
    return api.get('/orders/all');
  },
  
  getOrdersByEmail: (email) => {
    console.log('[API] Fetching orders for email:', email);
    return api.get(`/orders/customer/${email}`);
  },
  
  createOrder: (orderData) => {
    console.log('[API] Creating order:', orderData);
    return api.post('/orders/create', orderData);
  },
  
  getOrderById: (orderId) => {
    console.log('[API] Fetching order:', orderId);
    return api.get(`/orders/${orderId}`);
  },

  updateOrderStatus: (orderId, status) => {
    console.log('[API] Updating order status:', { orderId, status });
    return api.put(`/orders/${orderId}`, { status });
  },

  cancelOrder: (orderId) => {
    console.log('[API] Cancelling order:', orderId);
    return api.put(`/orders/${orderId}/cancel`);
  },

  // Payment endpoints
  createPaymentIntent: (orderId) => {
    console.log('[API] Creating payment intent for order:', orderId);
    console.log('[API] POST /payments/create-payment-intent');
    return api.post('/payments/create-payment-intent', { orderId });
  },

  getPaymentIntent: (paymentIntentId) => {
    console.log('[API] Getting payment intent:', paymentIntentId);
    return api.get(`/payments/payment-intent/${paymentIntentId}`);
  },

  updateOrderStatusByPayment: (paymentIntentId) => {
    console.log('[API] Updating order status by payment:', paymentIntentId);
    console.log('[API] POST /payments/update-order-status');
    return api.post('/payments/update-order-status', { paymentIntentId });
  },

  checkStripeStatus: () => {
    console.log('[API] Checking Stripe status');
    return api.get('/payments/stripe-status');
  },

  // Generic HTTP methods for custom endpoints
  get: (url) => {
    console.log('[API] GET', url);
    return api.get(url);
  },

  post: (url, data) => {
    console.log('[API] POST', url);
    return api.post(url, data);
  },

  put: (url, data) => {
    console.log('[API] PUT', url);
    return api.put(url, data);
  },

  delete: (url) => {
    console.log('[API] DELETE', url);
    return api.delete(url);
  },
};

export default api;
