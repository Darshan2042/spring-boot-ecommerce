import React, { useState } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiService } from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import { formatINR } from '../utils/priceUtils';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_your_key');

console.log('[STRIPE JS] Loading Stripe with public key:', process.env.REACT_APP_STRIPE_PUBLIC_KEY ? 'SET' : 'NOT SET');

const CheckoutPage = ({ setCurrentPage }) => {
  const { cart, currentUser, clearCart, showNotification } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    sameAsShipping: true,
  });

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item?.price) || 0;
    return sum + (price * (item?.quantity || 0));
  }, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-fill shipping if same as billing
    if (name === 'sameAsShipping' && checked) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: prev.billingAddress,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingZip: prev.billingZip,
      }));
    }
  };

  const handleContinueToPayment = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    if (!formData.billingAddress || !formData.billingCity || !formData.billingZip) {
      showNotification('Please fill in all billing address fields', 'error');
      return;
    }
    if (!formData.sameAsShipping && (!formData.shippingAddress || !formData.shippingCity || !formData.shippingZip)) {
      showNotification('Please fill in all shipping address fields', 'error');
      return;
    }

    setShowPaymentForm(true);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="glass-panel mb-6 rounded-[28px] p-6">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">Checkout</h2>
          <p className="mt-2 text-slate-500">Complete your order in a calm, guided flow.</p>
        </div>

        {cart.length === 0 ? (
          <div className="glass-panel rounded-[28px] p-10 text-center">
            <p className="mb-6 text-lg text-slate-600">Your cart is empty</p>
            <button
              onClick={() => setCurrentPage('products')}
              className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
            >
              Continue Shopping
            </button>
          </div>
        ) : !showPaymentForm ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="glass-panel rounded-[28px] p-6 sm:p-8">
                {/* Personal Information */}
                <h3 className="mb-6 text-2xl font-bold text-slate-900">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="premium-input"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="premium-input"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="premium-input mb-6"
                />

                {/* Billing Address */}
                <h3 className="mb-6 text-2xl font-bold text-slate-900">Billing Address</h3>
                <input
                  type="text"
                  name="billingAddress"
                  placeholder="Street Address"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  className="premium-input mb-4"
                />
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <input
                    type="text"
                    name="billingCity"
                    placeholder="City"
                    value={formData.billingCity}
                    onChange={handleInputChange}
                    className="premium-input"
                  />
                  <input
                    type="text"
                    name="billingState"
                    placeholder="State"
                    value={formData.billingState}
                    onChange={handleInputChange}
                    className="premium-input"
                  />
                  <input
                    type="text"
                    name="billingZip"
                    placeholder="ZIP Code"
                    value={formData.billingZip}
                    onChange={handleInputChange}
                    className="premium-input"
                  />
                </div>

                {/* Shipping Address */}
                <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/60 p-4">
                  <label className="flex items-center gap-3 text-slate-700">
                    <input
                      type="checkbox"
                      name="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Shipping address same as billing</span>
                  </label>
                </div>

                {!formData.sameAsShipping && (
                  <>
                    <h3 className="mb-6 text-2xl font-bold text-slate-900">Shipping Address</h3>
                    <input
                      type="text"
                      name="shippingAddress"
                      placeholder="Street Address"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      className="premium-input mb-4"
                    />
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <input
                        type="text"
                        name="shippingCity"
                        placeholder="City"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        className="premium-input"
                      />
                      <input
                        type="text"
                        name="shippingState"
                        placeholder="State"
                        value={formData.shippingState}
                        onChange={handleInputChange}
                        className="premium-input"
                      />
                      <input
                        type="text"
                        name="shippingZip"
                        placeholder="ZIP Code"
                        value={formData.shippingZip}
                        onChange={handleInputChange}
                        className="premium-input"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="glass-panel h-fit rounded-[28px] p-6">
              <h3 className="mb-6 text-2xl font-bold text-slate-900">Order Summary</h3>

              <div className="mb-6 max-h-64 space-y-3 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between rounded-2xl border-b border-slate-100 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{item.productName}</p>
                      <p className="text-sm text-slate-500">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {formatINR((parseFloat(item?.price) || 0) * (item?.quantity || 0))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-6 space-y-3 border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-medium">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping:</span>
                  <span className="font-medium">{formatINR(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax (8%):</span>
                  <span className="font-medium">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="text-xl font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatINR(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinueToPayment}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 font-semibold text-white shadow-lg transition hover:scale-[1.01]"
              >
                Continue to Payment
              </button>

              <button
                onClick={() => setCurrentPage('cart')}
                className="mt-4 w-full rounded-full border border-slate-200 bg-white py-3.5 font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Back to Cart
              </button>
            </div>
          </div>
        ) : (
          <PaymentForm
            cartItems={cart}
            formData={formData}
            total={total}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            setCurrentPage={setCurrentPage}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            clearCart={clearCart}
          />
        )}
      </div>
    </Elements>
  );
};

// Separate component for payment form that uses Stripe hooks
const PaymentForm = ({
  cartItems,
  formData,
  total,
  subtotal,
  shipping,
  tax,
  setCurrentPage,
  isProcessing,
  setIsProcessing,
  clearCart,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showNotification } = useAppContext();
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const handleCreateOrder = async () => {
    try {
      setIsProcessing(true);
      console.log('[CHECKOUT] Creating order step 1: Validating cart');

      // Validate cart
      if (!cartItems || cartItems.length === 0) {
        showNotification('Cart is empty', 'error');
        setIsProcessing(false);
        return;
      }

      console.log('[CHECKOUT] Cart validation passed. Items:', cartItems.length);

      // Validate form data
      if (!formData.email || !formData.firstName || !formData.lastName) {
        showNotification('Please fill in all required fields', 'error');
        setIsProcessing(false);
        return;
      }

      console.log('[CHECKOUT] Form validation passed. Customer:', formData.email);

      // Prepare order request
      const orderRequest = {
        customerEmail: formData.email,
        totalPrice: total,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        billingAddress: `${formData.billingAddress}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`,
        shippingAddress: formData.sameAsShipping
          ? `${formData.billingAddress}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`
          : `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingState} ${formData.shippingZip}`,
        orderItems: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price),
          imageUrl: item.imageUrl,
        })),
      };

      console.log('[CHECKOUT] Order request prepared:', orderRequest);
      console.log('[CHECKOUT] Creating order step 2: Sending to backend');

      // Create order first
      const orderResponse = await apiService.createOrder(orderRequest);
      const newOrderId = orderResponse.data.orderId;
      
      console.log('[CHECKOUT] Order created. Order ID:', newOrderId);

      if (!newOrderId) {
        throw new Error('No order ID received from server');
      }

      setOrderId(newOrderId);

      console.log('[CHECKOUT] Creating order step 3: Creating payment intent');

      // Create payment intent
      const paymentResponse = await apiService.createPaymentIntent(newOrderId);
      
      console.log('[CHECKOUT] Payment response received:', paymentResponse.data);

      if (!paymentResponse.data.clientSecret) {
        throw new Error('No client secret received from Stripe');
      }

      console.log('[CHECKOUT] ClientSecret received, updating state');
      setClientSecret(paymentResponse.data.clientSecret);
      showNotification('Order created. Please complete the payment.', 'info');
    } catch (error) {
      console.error('[CHECKOUT] Error creating order:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create order. Please try again.';
      showNotification(errorMessage, 'error');
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    console.log('[PAYMENT] Starting payment process');
    console.log('[PAYMENT] Stripe loaded:', !!stripe);
    console.log('[PAYMENT] Elements loaded:', !!elements);
    console.log('[PAYMENT] ClientSecret available:', !!clientSecret);
    console.log('[PAYMENT] OrderId available:', !!orderId);

    if (!stripe || !elements || !clientSecret || !orderId) {
      console.error('[PAYMENT] Missing payment information');
      showNotification('Payment information missing. Please try again.', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('[PAYMENT] Getting card element');

      const cardElement = elements.getElement(CardElement);

      // Validate card
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      console.log('[PAYMENT] Card element found, confirming payment');
      console.log('[PAYMENT] Customer:', formData.firstName, formData.lastName);
      console.log('[PAYMENT] Email:', formData.email);

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.billingAddress,
              city: formData.billingCity,
              state: formData.billingState,
              postal_code: formData.billingZip,
              country: 'US',
            },
          },
        },
      });

      console.log('[PAYMENT] Stripe response received');
      console.log('[PAYMENT] Result:', result);

      if (result.error) {
        // Show card error
        console.error('[PAYMENT] Card error:', result.error);
        showNotification(`Payment failed: ${result.error.message}`, 'error');
        setIsProcessing(false);
      } else if (result.paymentIntent) {
        const paymentIntent = result.paymentIntent;
        console.log('[PAYMENT] Payment intent status:', paymentIntent.status);
        console.log('[PAYMENT] Payment intent ID:', paymentIntent.id);
        
        if (paymentIntent.status === 'succeeded') {
          // Payment successful - update order status on backend
          try {
            console.log('[PAYMENT] Payment succeeded, updating order status');
            await apiService.updateOrderStatusByPayment(paymentIntent.id);
            showNotification('Payment successful! Your order has been placed.', 'success');
            
            // Clear cart and redirect
            clearCart();
            setTimeout(() => {
              setCurrentPage('orders');
            }, 2000);
          } catch (updateError) {
            console.error('[PAYMENT] Error updating order status:', updateError);
            // Show warning but still consider payment successful
            showNotification('Payment successful but order confirmation pending. Please check your orders page.', 'warning');
            clearCart();
            setTimeout(() => {
              setCurrentPage('orders');
            }, 2000);
          }
        } else if (paymentIntent.status === 'processing') {
          console.log('[PAYMENT] Payment is processing');
          showNotification('Payment is being processed. Please wait...', 'info');
          setIsProcessing(false);
        } else if (paymentIntent.status === 'requires_action') {
          console.log('[PAYMENT] Payment requires additional action');
          showNotification('Payment requires additional action. Please complete verification.', 'warning');
          setIsProcessing(false);
        } else {
          console.log('[PAYMENT] Unexpected payment status:', paymentIntent.status);
          showNotification(`Payment status: ${paymentIntent.status}`, 'info');
          setIsProcessing(false);
        }
      } else {
        console.error('[PAYMENT] Unexpected response - no error and no paymentIntent');
        showNotification('Unexpected payment response. Please contact support.', 'error');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('[PAYMENT] Payment error:', error);
      const errorMessage = error.message || 'An error occurred during payment. Please try again.';
      showNotification(errorMessage, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h3>

          {!clientSecret ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-blue-900">
                  Click the button below to create your order and proceed to payment.
                </p>
              </div>
              <button
                onClick={handleCreateOrder}
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400"
              >
                {isProcessing ? 'Creating Order...' : 'Create Order & Proceed to Payment'}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Card Details</label>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  className="p-3 border border-gray-300 rounded"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
                <p className="text-green-900 font-semibold mb-2">Test Card for Demo:</p>
                <p className="text-green-800 text-sm">Card: 4242 4242 4242 4242</p>
                <p className="text-green-800 text-sm">Date: 12/25 | CVC: 123</p>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || !stripe}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ${formatINR(total)}`}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6 h-fit">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto border-b pb-4">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">{item.productName}</p>
                <p className="text-sm text-gray-600">x{item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatINR((parseFloat(item?.price) || 0) * (item?.quantity || 0))}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium">{formatINR(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (8%):</span>
            <span className="font-medium">{formatINR(tax)}</span>
          </div>
          <div className="border-t-2 border-gray-200 pt-3 flex justify-between">
            <span className="text-xl font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-indigo-600">
              {formatINR(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
