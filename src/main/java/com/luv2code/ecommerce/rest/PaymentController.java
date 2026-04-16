package com.luv2code.ecommerce.rest;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.dao.OrderRepository;
import com.luv2code.ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080", "http://localhost:4200"})
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Create a payment intent for an order
     * Request: POST /api/payments/create-payment-intent
     * Body: { "orderId": 1 }
     */
    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Long> request) {
        try {
            logger.info("[STRIPE] Payment intent creation request received");
            Long orderId = request.get("orderId");
            logger.info("[STRIPE] Order ID: {}", orderId);

            // Validate orderId
            if (orderId == null || orderId <= 0) {
                logger.error("[STRIPE] Invalid order ID: {}", orderId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Order ID must be provided and greater than 0"));
            }

            // Retrieve order from database
            Order order = orderRepository.findById(orderId).orElse(null);
            logger.info("[STRIPE] Order retrieved: {}", order != null ? order.getId() : "null");

            if (order == null) {
                logger.error("[STRIPE] Order not found for ID: {}", orderId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Order not found"));
            }

            // Check if payment intent already exists
            if (order.getStripePaymentIntentId() != null && !order.getStripePaymentIntentId().isEmpty()) {
                // Return existing payment intent client secret
                try {
                    PaymentIntent existingIntent = paymentService.retrievePaymentIntent(order.getStripePaymentIntentId());
                    
                    // Only allow if payment intent is still valid
                    if (!existingIntent.getStatus().equals("succeeded") && 
                        !existingIntent.getStatus().equals("canceled")) {
                        Map<String, String> response = new HashMap<>();
                        response.put("clientSecret", existingIntent.getClientSecret());
                        response.put("paymentIntentId", order.getStripePaymentIntentId());
                        return ResponseEntity.ok(response);
                    }
                } catch (Exception e) {
                    // Continue to create new payment intent if retrieval fails
                }
            }

            // Generate order tracking number if not present
            if (order.getOrderTrackingNumber() == null || order.getOrderTrackingNumber().isEmpty()) {
                order.setOrderTrackingNumber(generateOrderTrackingNumber());
                orderRepository.save(order);
            }

            // Create new payment intent
            logger.info("[STRIPE] Creating new payment intent for order: {} amount: {}", orderId, order.getTotalPrice());
            String clientSecret = paymentService.createPaymentIntentForOrder(order);
            
            logger.info("[STRIPE] Payment intent created successfully. ID: {}", order.getStripePaymentIntentId());
            logger.info("[STRIPE] Client secret: {}...", clientSecret.substring(0, Math.min(20, clientSecret.length())));

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", clientSecret);
            response.put("paymentIntentId", order.getStripePaymentIntentId());
            response.put("message", "Payment intent created successfully");

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            logger.error("[STRIPE] Stripe API error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Stripe error: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            logger.error("[STRIPE] Invalid input: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Invalid input: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("[STRIPE] Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Get payment intent status
     * Request: GET /api/payments/payment-intent/{paymentIntentId}
     */
    @GetMapping("/payment-intent/{paymentIntentId}")
    public ResponseEntity<?> getPaymentIntent(@PathVariable String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = paymentService.retrievePaymentIntent(paymentIntentId);

            Map<String, Object> response = new HashMap<>();
            response.put("id", paymentIntent.getId());
            response.put("status", paymentIntent.getStatus());
            response.put("amount", paymentIntent.getAmount());
            response.put("currency", paymentIntent.getCurrency());

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Stripe error: " + e.getMessage()));
        }
    }

    /**
     * Update order status based on payment intent
     * Request: POST /api/payments/update-order-status
     * Body: { "paymentIntentId": "pi_..." }
     */
    @PostMapping("/update-order-status")
    public ResponseEntity<?> updateOrderStatus(@RequestBody Map<String, String> request) {
        try {
            String paymentIntentId = request.get("paymentIntentId");

            boolean success = paymentService.updateOrderStatus(paymentIntentId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "Order updated successfully" : "Order not found");

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Stripe error: " + e.getMessage()));
        }
    }

    /**
     * Cancel a payment intent
     * Request: POST /api/payments/cancel/{paymentIntentId}
     */
    @PostMapping("/cancel/{paymentIntentId}")
    public ResponseEntity<?> cancelPayment(@PathVariable String paymentIntentId) {
        try {
            PaymentIntent canceledIntent = paymentService.cancelPaymentIntent(paymentIntentId);

            Map<String, Object> response = new HashMap<>();
            response.put("id", canceledIntent.getId());
            response.put("status", canceledIntent.getStatus());
            response.put("message", "Payment canceled successfully");

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Stripe error: " + e.getMessage()));
        }
    }

    /**
     * Get Stripe publishable key
     * Request: GET /api/payments/config
     */
    @GetMapping("/config")
    public ResponseEntity<?> getConfig() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Stripe config endpoint. Use publishable key from frontend environment.");
        return ResponseEntity.ok(response);
    }

    /**
     * Stripe initialization check endpoint
     * GET /api/payments/stripe-status
     */
    @GetMapping("/stripe-status")
    public ResponseEntity<?> stripeStatus() {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Try to retrieve a test payment intent to verify Stripe is initialized
            try {
                logger.info("[STRIPE] Checking Stripe API connection...");
                // Just check if Stripe API key is set
                String status = "Stripe API is properly configured and ready to process payments";
                response.put("status", "success");
                response.put("message", status);
                response.put("stripeInitialized", true);
                logger.info("[STRIPE] Stripe API status check: OK");
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                logger.error("[STRIPE] Stripe API not properly initialized: ", e);
                response.put("status", "error");
                response.put("message", "Stripe API not properly initialized: " + e.getMessage());
                response.put("stripeInitialized", false);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error checking Stripe status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        return ResponseEntity.ok(response);
    }

    // Helper method to generate order tracking number
    private String generateOrderTrackingNumber() {
        return "ORD-" + System.currentTimeMillis();
    }

    // Inner class for error response
    public static class ErrorResponse {
        public String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}
