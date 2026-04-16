package com.luv2code.ecommerce.rest;

import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.User;
import com.luv2code.ecommerce.dto.OrderRequest;
import com.luv2code.ecommerce.service.AuthService;
import com.luv2code.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080", "http://localhost:4200"})
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    /**
     * Get all orders for the currently authenticated user
     * GET /api/orders
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllOrders() {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("User not authenticated"));
            }

            List<Order> userOrders = orderService.getOrdersByCustomerEmail(user.getEmail());
            return ResponseEntity.ok(userOrders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error retrieving orders: " + e.getMessage()));
        }
    }

    /**
     * Get all orders (Admin only)
     * GET /api/orders/all
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllOrdersForAdmin() {
        try {
            List<Order> allOrders = orderService.getAllOrders();
            return ResponseEntity.ok(allOrders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error retrieving orders: " + e.getMessage()));
        }
    }

    /**
     * Create a new order
     * POST /api/orders/create
     */
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest, BindingResult bindingResult) {
        try {
            System.out.println("[ORDER] Creating order request: " + orderRequest);
            
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                String errors = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.joining(", "));
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("error", "Validation failed: " + errors);
                System.out.println("[ORDER] Validation error: " + errors);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
            }

            // Create order using service
            Order savedOrder = orderService.createOrder(orderRequest);
            System.out.println("[ORDER] Order created with ID: " + savedOrder.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", savedOrder.getId());
            response.put("orderTrackingNumber", savedOrder.getOrderTrackingNumber());
            response.put("totalPrice", savedOrder.getTotalPrice());
            response.put("totalQuantity", savedOrder.getTotalQuantity());
            response.put("status", savedOrder.getStatus());
            response.put("message", "Order created successfully");

            System.out.println("[ORDER] Order created successfully: " + response);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            System.out.println("[ORDER] IllegalArgumentException: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid order data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            System.out.println("[ORDER] Exception: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get order by ID
     * GET /api/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Long orderId) {
        try {
            Optional<Order> order = orderService.getOrderById(orderId);

            if (order.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Order not found"));
            }

            return ResponseEntity.ok(order.get());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Get all orders for a customer
     * GET /api/orders/customer/{email}
     */
    @GetMapping("/customer/{email}")
    public ResponseEntity<?> getOrdersByEmail(@PathVariable String email) {
        try {
            List<Order> customerOrders = orderService.getOrdersByCustomerEmail(email);

            if (customerOrders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("No orders found for customer"));
            }

            return ResponseEntity.ok(customerOrders);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Update order status
     * PUT /api/orders/{orderId}
     * Body: { "status": "completed" }
     */
    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        try {
            Optional<Order> orderOpt = orderService.getOrderById(orderId);

            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Order not found"));
            }

            String newStatus = request.get("status");

            if (newStatus != null && !newStatus.isEmpty()) {
                Order updatedOrder = orderService.updateOrderStatus(orderId, newStatus);
                return ResponseEntity.ok(updatedOrder);
            } else {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Status is required"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Cancel order
     * PUT /api/orders/{orderId}/cancel
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        try {
            Order cancelledOrder = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(cancelledOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }
}
