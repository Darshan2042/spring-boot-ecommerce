import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import { formatINR } from '../utils/priceUtils';
import { Badge } from '../components/UIComponents';
import { ClipboardList, PackageSearch, RotateCcw } from 'lucide-react';

const OrdersPage = ({ setCurrentPage }) => {
  const { isAuthenticated, showNotification } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = useCallback(async () => {
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
  }, [showNotification]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setCurrentPage('auth');
    }
  }, [isAuthenticated, setCurrentPage, loadOrders]);

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
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'processing':
        return 'primary';
      default:
        return 'primary';
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
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="glass-panel mb-6 rounded-[28px] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Order history</p>
            <h2 className="mt-1 text-4xl font-bold text-slate-900">My Orders</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <ClipboardList className="h-4 w-4 text-blue-600" />
            {orders.length} total orders
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel flex min-h-[320px] items-center justify-center rounded-[28px]">
          <div className="flex items-center gap-3 text-slate-600">
            <RotateCcw className="h-5 w-5 animate-spin text-blue-600" />
            Loading orders
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel rounded-[28px] p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <PackageSearch className="h-8 w-8" />
          </div>
          <p className="mb-3 text-lg font-semibold text-slate-900">You haven&apos;t placed any orders yet</p>
          <p className="mb-6 text-slate-500">Your completed purchases will appear here with a clean timeline view.</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            Start Shopping
          </button>
        </div>
      ) : Array.isArray(orders) && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.article key={order.id} className="glass-panel overflow-hidden rounded-[28px]" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <div className="border-b border-slate-200/80 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Order #{order.orderTrackingNumber || order.id}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">Tracking: {order.orderTrackingNumber || 'N/A'}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(order.dateCreated || new Date()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(order.status)}>{order.status || 'processing'}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 border-b border-slate-200/80 bg-white/55 px-6 py-5 md:grid-cols-4">
                {[
                  ['Total Items', order.totalQuantity || 0],
                  ['Total Amount', formatINR(order.totalPrice || 0)],
                  ['Billing Address', order.billingAddress || 'N/A'],
                  ['Shipping Address', order.shippingAddress || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              {Array.isArray(order.orderItems) && order.orderItems.length > 0 && (
                <div>
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="flex w-full items-center justify-between border-t border-slate-200/80 px-6 py-4 text-left font-semibold text-slate-900 transition hover:bg-white/60"
                  >
                    <span className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-blue-600" />
                      <span>Order Items ({order.orderItems.length})</span>
                    </span>
                    <span className="text-sm text-slate-500">{expandedOrder === order.id ? 'Collapse' : 'Expand'}</span>
                  </button>

                  {expandedOrder === order.id && (
                    <div className="border-t border-slate-200/80">
                      {order.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b border-slate-100 px-6 py-4 transition hover:bg-slate-50/80"
                        >
                          <div className="flex items-center gap-4">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt="Product"
                                className="h-12 w-12 rounded-2xl object-cover shadow-sm"
                              />
                            )}
                            <div>
                              <p className="font-medium text-slate-900">Product #{item.productId}</p>
                              <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">
                              {formatINR(item.unitPrice ? parseFloat(item.unitPrice) : 0)}
                            </p>
                            <p className="text-sm text-slate-500">each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-white/55 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setCurrentPage('products')}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  Continue Shopping
                </button>
                {order.status && !['completed', 'cancelled'].includes(order.status.toLowerCase()) && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="rounded-full border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[28px] p-8 text-center">
          <p className="mb-6 text-lg text-slate-600">No orders found</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
