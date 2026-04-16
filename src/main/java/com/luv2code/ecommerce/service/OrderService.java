package com.luv2code.ecommerce.service;

import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.OrderItem;
import com.luv2code.ecommerce.entity.User;
import com.luv2code.ecommerce.dao.OrderRepository;
import com.luv2code.ecommerce.dao.OrderItemRepository;
import com.luv2code.ecommerce.dto.OrderRequest;
import com.luv2code.ecommerce.dto.OrderItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    /**
     * Get all orders for a customer by email
     */
    public List<Order> getOrdersByCustomerEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        return orderRepository.findByCustomerEmail(email);
    }

    /**
     * Get order by ID
     */
    public Optional<Order> getOrderById(Long orderId) {
        if (orderId == null || orderId <= 0) {
            throw new IllegalArgumentException("Order ID must be greater than 0");
        }
        return orderRepository.findById(orderId);
    }

    /**
     * Get order by tracking number
     */
    public Optional<Order> getOrderByTrackingNumber(String trackingNumber) {
        if (trackingNumber == null || trackingNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Tracking number cannot be empty");
        }
        Order order = orderRepository.findByOrderTrackingNumber(trackingNumber);
        return Optional.ofNullable(order);
    }

    /**
     * Create a new order
     */
    public Order createOrder(OrderRequest orderRequest) {
        if (orderRequest == null) {
            throw new IllegalArgumentException("Order request cannot be null");
        }
        
        if (orderRequest.getCustomerEmail() == null || orderRequest.getCustomerEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required");
        }

        // Create order
        Order order = new Order();
        order.setOrderTrackingNumber(generateOrderTrackingNumber());
        order.setTotalPrice(orderRequest.getTotalPrice());
        order.setTotalQuantity(orderRequest.getTotalQuantity());
        order.setCustomerEmail(orderRequest.getCustomerEmail());
        order.setBillingAddress(orderRequest.getBillingAddress());
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setStatus("pending");
        order.setOrderItems(new HashSet<>());

        // Save order first
        Order savedOrder = orderRepository.save(order);

        // Create order items
        if (orderRequest.getOrderItems() != null && !orderRequest.getOrderItems().isEmpty()) {
            Set<OrderItem> orderItems = new HashSet<>();
            for (OrderItemRequest itemRequest : orderRequest.getOrderItems()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setProductId(itemRequest.getProductId());
                orderItem.setQuantity(itemRequest.getQuantity());
                orderItem.setUnitPrice(itemRequest.getUnitPrice());
                orderItem.setImageUrl(itemRequest.getImageUrl());
                orderItem.setOrder(savedOrder);

                OrderItem savedItem = orderItemRepository.save(orderItem);
                orderItems.add(savedItem);
            }
            savedOrder.setOrderItems(orderItems);
            orderRepository.save(savedOrder);
        }

        return savedOrder;
    }

    /**
     * Update order status
     */
    public Order updateOrderStatus(Long orderId, String newStatus) {
        if (orderId == null || orderId <= 0) {
            throw new IllegalArgumentException("Order ID must be greater than 0");
        }
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Update order payment intent ID (for Stripe)
     */
    public Order updateStripePaymentIntentId(Long orderId, String paymentIntentId) {
        if (orderId == null || orderId <= 0) {
            throw new IllegalArgumentException("Order ID must be greater than 0");
        }
        if (paymentIntentId == null || paymentIntentId.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment intent ID cannot be empty");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        order.setStripePaymentIntentId(paymentIntentId);
        return orderRepository.save(order);
    }

    /**
     * Cancel order
     */
    public Order cancelOrder(Long orderId) {
        if (orderId == null || orderId <= 0) {
            throw new IllegalArgumentException("Order ID must be greater than 0");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // Only allow cancellation if order is not already completed or cancelled
        if ("completed".equalsIgnoreCase(order.getStatus()) || "cancelled".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }

        order.setStatus("cancelled");
        return orderRepository.save(order);
    }

    /**
     * Get all orders
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Get order total for a customer (sum of all order totals)
     */
    public BigDecimal getCustomerOrderTotal(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        List<Order> orders = getOrdersByCustomerEmail(email);
        return orders.stream()
                .map(Order::getTotalPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get order count for a customer
     */
    public long getCustomerOrderCount(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        return getOrdersByCustomerEmail(email).size();
    }

    /**
     * Generate unique order tracking number
     */
    private String generateOrderTrackingNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 10000);
    }
}
