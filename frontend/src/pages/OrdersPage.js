import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import { formatINR } from '../utils/priceUtils';

const OrdersPage = ({ setCurrentPage }) => {
  const { currentUser, isAuthenticated, showNotification } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setCurrentPage('auth');
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await apiService.getOrders();
      // Handle different response formats
      const orderData = response.data?.content || response.data || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);  // Set empty array on error
      showNotification('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await apiService.cancelOrder(orderId);
      showNotification('Order cancelled successfully', 'success');
      loadOrders(); // Reload orders
    } catch (error) {
      console.error('Error cancelling order:', error);
      showNotification('Failed to cancel order', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-600 mb-4">Please login to view your orders</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-6 text-lg">You haven't placed any orders yet</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : Array.isArray(orders) && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Tracking: {order.orderTrackingNumber || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.dateCreated || new Date()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded font-semibold ${getStatusColor(order.status)}`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details Summary */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{order.totalQuantity || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatINR(order.totalPrice || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Billing Address</p>
                    <p className="text-sm text-gray-900">{order.billingAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Shipping Address</p>
                    <p className="text-sm text-gray-900">{order.shippingAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {Array.isArray(order.orderItems) && order.orderItems.length > 0 && (
                <div>
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition border-t border-gray-200"
                  >
                    <span className="flex justify-between items-center">
                      <span>Order Items ({order.orderItems.length})</span>
                      <span className="text-sm text-gray-600">
                        {expandedOrder === order.id ? '▼' : '▶'}
                      </span>
                    </span>
                  </button>

                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200">
                      {order.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="px-6 py-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt="Product"
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">Product #{item.productId}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatINR(item.unitPrice ? parseFloat(item.unitPrice) : 0)}
                            </p>
                            <p className="text-sm text-gray-600">
                              each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Order Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  onClick={() => setCurrentPage('products')}
                  className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition"
                >
                  Continue Shopping
                </button>
                {order.status && !['completed', 'cancelled'].includes(order.status.toLowerCase()) && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-6 text-lg">No orders found</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
