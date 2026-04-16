import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import ProductForm from '../admin/components/ProductForm';
import { getProductImage } from '../config/imageMapping';
import { formatINR } from '../utils/priceUtils';

const AdminDashboard = ({ setCurrentPage }) => {
  const { showNotification, currentUser, refreshProducts } = useAppContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    unitPrice: '',
    unitsInStock: '',
    imageUrl: '',
    categoryId: '',
    active: true,
  });
  const [loading, setLoading] = useState(false);

  // Initialize dashboard
  useEffect(() => {
    console.log('AdminDashboard mounted, loading data...');
    fetchCategories();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch products when tab changes
  useEffect(() => {
    if (activeTab === 'products') {
      console.log('Products tab active, fetching products');
      fetchProducts();
    } else if (activeTab === 'orders') {
      console.log('Orders tab active, fetching orders');
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await apiService.getCategories();
      console.log('Categories response:', response.data);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin products...');
      const response = await apiService.getAdminProducts(0, 100);
      console.log('Admin products response:', response.data);
      
      let productsList;
      if (response.data.content !== undefined) {
        // Response is a Page object
        productsList = response.data.content;
      } else if (Array.isArray(response.data)) {
        // Response is a direct array
        productsList = response.data;
      } else {
        // Single product or other format
        productsList = [];
      }
      
      console.log('Parsed products:', productsList);
      setProducts(Array.isArray(productsList) ? productsList : []);
      
      if (productsList.length === 0) {
        console.warn('No products found');
      }
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      showNotification('Failed to load products: ' + (error.response?.data?.message || error.message), 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching all orders...');
      const response = await apiService.getAllOrders();
      console.log('Orders response:', response.data);
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      showNotification('Failed to load orders', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!formData.sku || !formData.name || !formData.unitPrice || formData.unitsInStock === '' || !formData.categoryId) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        unitPrice: parseFloat(formData.unitPrice),
        unitsInStock: parseInt(formData.unitsInStock),
        imageUrl: formData.imageUrl.trim() || 'https://source.unsplash.com/300x250/?product',
        active: formData.active,
        categoryId: parseInt(formData.categoryId),
      };

      if (editingProduct) {
        // Update existing product
        await apiService.updateProduct(editingProduct.id, productData);
        showNotification('✅ Product updated successfully!', 'success');
      } else {
        // Create new product
        await apiService.createProduct(productData);
        showNotification('✅ Product added successfully!', 'success');
      }

      // Reset form and refresh list
      resetForm();
      fetchProducts();
      refreshProducts();  // Trigger refresh for customer product view
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMsg = error.response?.data?.error || 'Failed to save product';
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      unitPrice: product.unitPrice?.toString() || '',
      unitsInStock: product.unitsInStock?.toString() || '',
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id?.toString() || '',
      active: product.active !== false,
    });
    setShowProductForm(true);
  };

  // Delete product
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteProduct(productId);
      showNotification('✅ Product deleted successfully!', 'success');
      fetchProducts();
      refreshProducts();  // Trigger refresh for customer product view
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Failed to delete product', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      unitPrice: '',
      unitsInStock: '',
      imageUrl: '',
      categoryId: '',
      active: true,
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const getProductImageUrl = (product, index) => {
    // First check if product has custom image URL
    if (product.imageUrl && product.imageUrl !== 'https://source.unsplash.com/300x250/?product') {
      return product.imageUrl;
    }
    
    // Use local image mapping
    return getProductImage(product);
  };

  // Check if user is admin
  if (!currentUser || (!currentUser.roles?.some(role => role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN'))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FBFD] to-[#EAF4F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access the admin dashboard.</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FBFD] to-[#EAF4F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        {/* <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-900"><strong>Debug Info:</strong> User: {currentUser?.username}, Roles: {JSON.stringify(currentUser?.roles)}, Total Products: {products.length}</p>
        </div> */}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, <span className="font-semibold">{currentUser?.username}</span>! Manage products and view orders.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'products'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'orders'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {!showProductForm ? (
              <div>
                {/* Add Product Button */}
                <button
                  onClick={() => setShowProductForm(true)}
                  className="mb-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  + Add New Product
                </button>

                {/* Products List */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-center text-gray-600 mt-4">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 text-lg mb-4">📦 No products found</p>
                    <p className="text-gray-500 text-sm mb-6">Get started by adding your first product</p>
                    <button
                      onClick={() => setShowProductForm(true)}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      + Create First Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            marginBottom: '16px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#f0f0f0',
                          }}
                        >
                          {/* Real Image - No Fallback Gradient */}
                          <img
  src={getProductImage(product)} // ✅ ALWAYS use mapping
  alt={product.name}
  onError={(e) => {
    e.target.src = '/images/products/book.jpg'; // fallback
  }}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }}
/>

                          {/* Status Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: product.active ? '#10B981' : '#EF4444',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '12px',
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                              zIndex: 10,
                            }}
                          >
                            {product.active ? 'In Stock' : 'Out of Stock'}
                          </div>

                          {/* Cart Icon Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '12px',
                              right: '12px',
                              background: 'rgba(255, 255, 255, 0.95)',
                              borderRadius: '50%',
                              width: '48px',
                              height: '48px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              backdropFilter: 'blur(10px)',
                              zIndex: 10,
                            }}
                          >
                            🛒
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                        
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-indigo-600 mb-2">
                            {formatINR(parseFloat(product.unitPrice) || 0)}
                          </p>
                          <p className="text-gray-600">
                            Stock: <span className="font-semibold">{product.unitsInStock}</span>
                          </p>
                          <p className="text-gray-600">
                            Status: <span className={`font-semibold ${product.active ? 'text-green-600' : 'text-red-600'}`}>
                              {product.active ? 'Active' : 'Inactive'}
                            </span>
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <ProductForm 
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleAddProduct}
                resetForm={resetForm}
                loading={loading}
                editingProduct={editingProduct}
                categories={categories}
              />
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {loading ? (
              <p className="text-center text-gray-600">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No orders found</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Order ID</p>
                        <p className="font-bold text-gray-900">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Tracking Number</p>
                        <p className="font-bold text-gray-900">{order.orderTrackingNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <p className={`font-bold ${
                          order.status === 'completed' ? 'text-green-600' :
                          order.status === 'processing' ? 'text-blue-600' :
                          order.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {order.status?.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Total Price</p>
                        <p className="font-bold text-indigo-600">{formatINR(parseFloat(order.totalPrice) || 0)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Customer Email</p>
                        <p className="text-gray-900">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Items</p>
                        <p className="text-gray-900">{order.totalQuantity} items</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
