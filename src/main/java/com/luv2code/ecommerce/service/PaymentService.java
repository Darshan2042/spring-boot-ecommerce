package com.luv2code.ecommerce.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.dao.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private OrderRepository orderRepository;

    public PaymentIntent createPaymentIntent(Long amount, String currency, String email) throws StripeException {
        try {
            logger.info("[STRIPE SERVICE] Creating payment intent - Amount: {} {}, Email: {}", amount, currency, email);
            PaymentIntent intent = PaymentIntent.create(
                PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency(currency)
                    .setReceiptEmail(email)
                    .setDescription("Purchase")
                    .build()
            );
            logger.info("[STRIPE SERVICE] Payment intent created successfully - ID: {}", intent.getId());
            return intent;
        } catch (StripeException e) {
            logger.error("[STRIPE SERVICE] Failed to create payment intent: ", e);
            throw e;
        }
    }

    public String createPaymentIntentForOrder(Order order) throws StripeException {
        try {
            logger.info("[STRIPE SERVICE] Creating payment intent for order: {}", order.getId());
            
            // Validate order amount
            if (order.getTotalPrice() == null || order.getTotalPrice().signum() <= 0) {
                throw new IllegalArgumentException("Order total price must be greater than 0");
            }
            
            Long amt = order.getTotalPrice().multiply(new java.math.BigDecimal("100")).longValue();
            logger.info("[STRIPE SERVICE] Payment amount in cents: {}", amt);
            
            // Get email from order or user
            String email = order.getCustomerEmail();
            if (email == null || email.trim().isEmpty()) {
                if (order.getUser() != null && order.getUser().getEmail() != null) {
                    email = order.getUser().getEmail();
                    logger.info("[STRIPE SERVICE] Using customer email from user: {}", email);
                } else {
                    throw new IllegalArgumentException("Customer email is required to create payment intent");
                }
            }
            
            logger.info("[STRIPE SERVICE] Creating payment intent with email: {}", email);
            PaymentIntent paymentIntent = createPaymentIntent(amt, "usd", email);
            
            order.setStripePaymentIntentId(paymentIntent.getId());
            order.setStatus("pending");
            orderRepository.save(order);
            
            logger.info("[STRIPE SERVICE] Payment intent saved to order - PI ID: {}", paymentIntent.getId());
            return paymentIntent.getClientSecret();
        } catch (StripeException e) {
            logger.error("[STRIPE SERVICE] Failed to create payment intent for order {}: ", order.getId(), e);
            throw e;
        } catch (Exception e) {
            logger.error("[STRIPE SERVICE] Error creating payment intent for order {}: ", order.getId(), e);
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage(), e);
        }
    }

    public PaymentIntent retrievePaymentIntent(String paymentIntentId) throws StripeException {
        try {
            logger.info("[STRIPE SERVICE] Retrieving payment intent: {}", paymentIntentId);
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            logger.info("[STRIPE SERVICE] Payment intent retrieved - Status: {}", intent.getStatus());
            return intent;
        } catch (StripeException e) {
            logger.error("[STRIPE SERVICE] Failed to retrieve payment intent {}: ", paymentIntentId, e);
            throw e;
        }
    }

    public boolean updateOrderStatus(String paymentIntentId) throws StripeException {
        PaymentIntent pi = retrievePaymentIntent(paymentIntentId);
        
        // Find order by stripe payment intent ID (not tracking number)
        Order order = orderRepository.findByStripePaymentIntentId(paymentIntentId);

        if (order == null) return false;

        if (pi.getStatus().equals("succeeded")) {
            order.setStatus("completed");
        } else if (pi.getStatus().equals("processing")) {
            order.setStatus("processing");
        } else if (pi.getStatus().equals("requires_payment_method")) {
            order.setStatus("pending");
        }

        orderRepository.save(order);
        return true;
    }

    /**
     * Cancel a payment intent
     *
     * @param paymentIntentId Stripe PaymentIntent ID
     * @return PaymentIntent object from Stripe
     * @throws StripeException if Stripe API call fails
     */
    public PaymentIntent cancelPaymentIntent(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.cancel();
    }
}
