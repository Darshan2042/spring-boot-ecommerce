import React from 'react';
import { useAppContext } from '../context/AppContext';
import theme from '../styles/theme';
import { Button, Card } from '../components/UIComponents';
import { Layout, Flex, Section } from '../components/LayoutComponents';
import { getProductImage } from '../config/imageMapping';
import { formatINR } from '../utils/priceUtils';

const CartPage = ({ setCurrentPage }) => {
  const { cart, removeFromCart, updateCartQuantity, showNotification } = useAppContext();

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item?.price) || parseFloat(item?.unitPrice) || 0;
    return sum + (price * (item?.quantity || 0));
  }, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'warning');
      return;
    }
    setCurrentPage('checkout');
  };

  const removeItem = (productId) => {
    removeFromCart(productId);
    showNotification('Item removed from cart', 'info');
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartQuantity(productId, newQuantity);
    } else {
      removeItem(productId);
    }
  };

  return (
    <Layout title="Shopping Cart" subtitle="Review and manage your items">
      {cart.length === 0 ? (
        <Section padding="3xl" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: theme.spacing['2xl'] }}>
            <div style={{ fontSize: '4rem', marginBottom: theme.spacing.lg }}>🛒</div>
            <h3 style={{ fontSize: theme.typography.fontSize['2xl'], fontWeight: 'bold', marginBottom: theme.spacing.md }}>
              Your cart is empty
            </h3>
            <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing['2xl'] }}>
              Add some products to get started!
            </p>
          </div>
          <Button onClick={() => setCurrentPage('products')}>
            Continue Shopping
          </Button>
        </Section>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: theme.spacing['2xl'], alignItems: 'start' }}>
          {/* Cart Items */}
          <Section spacing="xl">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
              {cart.map((item) => {
                const price = parseFloat(item?.price) || parseFloat(item?.unitPrice) || 0;
                const itemTotal = price * (item?.quantity || 0);

                return (
                  <Card
                    key={item.productId || item.id}
                    variant="elevated"
                    style={{
                      display: 'flex',
                      gap: theme.spacing.lg,
                      alignItems: 'flex-start',
                      transition: `all ${theme.transitions.fast}`,
                    }}
                  >
                    {/* Product Image */}
                    <img
                      src={getProductImage({ name: item.productName })}
                      alt={item.productName}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: theme.borderRadius.md,
                        flexShrink: 0,
                      }}
                    />

                    {/* Item Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                      <div>
                        <h4 style={{ fontSize: theme.typography.fontSize.lg, fontWeight: 'bold', marginBottom: theme.spacing.sm }}>
                          {item.productName}
                        </h4>
                        <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary }}>
                          SKU: {item.productId}
                        </p>
                      </div>

                      {/* Quantity and Price */}
                      <Flex gap="lg" style={{ alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.productId || item.id, item.quantity - 1)
                            }
                            style={{
                              background: theme.colors.backgroundSecondary,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: theme.borderRadius.sm,
                              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                              cursor: 'pointer',
                              fontSize: theme.typography.fontSize.lg,
                              fontWeight: 'bold',
                              color: theme.colors.text,
                              transition: `all ${theme.transitions.fast}`,
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = theme.colors.error;
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = theme.colors.backgroundSecondary;
                              e.target.style.color = theme.colors.text;
                            }}
                          >
                            −
                          </button>

                          <div
                            style={{
                              width: '50px',
                              textAlign: 'center',
                              fontSize: theme.typography.fontSize.lg,
                              fontWeight: 'bold',
                              color: theme.colors.text,
                            }}
                          >
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              handleQuantityChange(item.productId || item.id, item.quantity + 1)
                            }
                            style={{
                              background: theme.colors.backgroundSecondary,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: theme.borderRadius.sm,
                              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                              cursor: 'pointer',
                              fontSize: theme.typography.fontSize.lg,
                              fontWeight: 'bold',
                              color: theme.colors.text,
                              transition: `all ${theme.transitions.fast}`,
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = theme.colors.success;
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = theme.colors.backgroundSecondary;
                              e.target.style.color = theme.colors.text;
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div style={{ flex: 1 }}>
                          <p style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
                            {formatINR(price)}{' '}
                            <span style={{ fontWeight: 'bold', color: theme.colors.text }}>
                              × {item.quantity} = {formatINR(itemTotal)}
                            </span>
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId || item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: theme.colors.error,
                            fontSize: theme.typography.fontSize.lg,
                            cursor: 'pointer',
                            transition: `all ${theme.transitions.fast}`,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          🗑️
                        </button>
                      </Flex>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Section>

          {/* Order Summary Sidebar */}
          <Card
            variant="elevated"
            style={{
              position: 'sticky',
              top: `calc(64px + ${theme.spacing.lg})`,
              padding: theme.spacing.lg,
            }}
          >
            <h3 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: 'bold', marginBottom: theme.spacing.lg }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              {/* Subtotal */}
              <Flex justify="space-between">
                <span style={{ color: theme.colors.textSecondary }}>Subtotal:</span>
                <span style={{ fontWeight: 'bold', color: theme.colors.text }}>
                  {formatINR(subtotal)}
                </span>
              </Flex>

              {/* Shipping */}
              <Flex justify="space-between">
                <span style={{ color: theme.colors.textSecondary }}>Shipping:</span>
                <span style={{ fontWeight: 'bold', color: theme.colors.text }}>
                  {formatINR(shipping)}
                </span>
              </Flex>

              {/* Tax */}
              <Flex justify="space-between">
                <span style={{ color: theme.colors.textSecondary }}>Tax (8%):</span>
                <span style={{ fontWeight: 'bold', color: theme.colors.text }}>
                  {formatINR(tax)}
                </span>
              </Flex>

              {/* Divider */}
              <div style={{ borderTop: `2px solid ${theme.colors.border}`, paddingTop: theme.spacing.md }}></div>

              {/* Total */}
              <Flex justify="space-between" style={{ marginBottom: theme.spacing.md }}>
                <span style={{ fontWeight: 'bold', fontSize: theme.typography.fontSize.lg, color: theme.colors.text }}>
                  Total:
                </span>
                <span
                  style={{
                    fontSize: theme.typography.fontSize['2xl'],
                    fontWeight: 'bold',
                    background: theme.gradients.primary,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {formatINR(total)}
                </span>
              </Flex>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              <Button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                }}
              >
                Proceed to Checkout
              </Button>

              <button
                onClick={() => setCurrentPage('products')}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  background: theme.colors.backgroundSecondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text,
                  cursor: 'pointer',
                  transition: `all ${theme.transitions.fast}`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = theme.colors.border;
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = theme.colors.backgroundSecondary;
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Continue Shopping
              </button>
            </div>

            {/* Items Count */}
            <div
              style={{
                marginTop: theme.spacing.lg,
                padding: theme.spacing.md,
                background: theme.colors.backgroundSecondary,
                borderRadius: theme.borderRadius.md,
                textAlign: 'center',
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.textSecondary,
              }}
            >
              Total Items: <strong style={{ color: theme.colors.text }}>{cart.length}</strong>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default CartPage;
