package com.luv2code.ecommerce.rest;

import com.luv2code.ecommerce.dto.SellerRegistrationRequest;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.Seller;
import com.luv2code.ecommerce.entity.User;
import com.luv2code.ecommerce.service.AuthService;
import com.luv2code.ecommerce.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080", "http://localhost:4200"})
public class SellerController {

    @Autowired
    private SellerService sellerService;

    @Autowired
    private AuthService authService;

    /**
     * Register as a seller
     * POST /api/seller/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerSeller(
            @Valid @RequestBody SellerRegistrationRequest request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errors = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.joining(", "));
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("error", "Validation failed: " + errors);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
            }

            Seller seller = sellerService.registerSeller(request);

            Map<String, Object> response = new HashMap<>();
            response.put("sellerId", seller.getId());
            response.put("shopName", seller.getShopName());
            response.put("email", seller.getUser().getEmail());
            response.put("message", "Seller registered successfully. Pending verification.");
            response.put("verificationStatus", seller.getVerificationStatus());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get current seller profile
     * GET /api/seller/me
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> getMyProfile() {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("User not authenticated"));
            }

            Optional<Seller> sellerOpt = sellerService.getSellerByUser(user);
            if (!sellerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Seller profile not found"));
            }

            return ResponseEntity.ok(sellerOpt.get());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Get seller by ID
     * GET /api/seller/{sellerId}
     */
    @GetMapping("/{sellerId}")
    public ResponseEntity<?> getSellerById(@PathVariable Long sellerId) {
        try {
            Optional<Seller> seller = sellerService.getSellerById(sellerId);
            if (!seller.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Seller not found"));
            }
            return ResponseEntity.ok(seller.get());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Update seller profile
     * PUT /api/seller/me
     */
    @PutMapping("/me")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> updateProfile(@RequestBody Seller updatedSeller) {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("User not authenticated"));
            }

            Optional<Seller> sellerOpt = sellerService.getSellerByUser(user);
            if (!sellerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Seller profile not found"));
            }

            Seller updated = sellerService.updateSellerProfile(sellerOpt.get().getId(), updatedSeller);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Get seller's dashboard/stats
     * GET /api/seller/dashboard
     */
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> getDashboard() {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("User not authenticated"));
            }

            Optional<Seller> sellerOpt = sellerService.getSellerByUser(user);
            if (!sellerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Seller profile not found"));
            }

            Seller seller = sellerService.getSellerDashboard(sellerOpt.get().getId());
            return ResponseEntity.ok(seller);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Get-seller's products
     * GET /api/seller/products?page=0&size=10
     */
    @GetMapping("/products")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> getMyProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("User not authenticated"));
            }

            Optional<Seller> sellerOpt = sellerService.getSellerByUser(user);
            if (!sellerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Seller profile not found"));
            }

            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = sellerService.getSellerProductsPaginated(sellerOpt.get().getId(), pageable);

            return ResponseEntity.ok(products);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Add a new product
     * POST /api/seller/products
     */
    @PostMapping("/products")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("User not authenticated"));
            }

            Optional<Seller> sellerOpt = sellerService.getSellerByUser(user);
            if (!sellerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Seller profile not found"));
            }

            Product savedProduct = sellerService.addProduct(sellerOpt.get().getId(), product);

            Map<String, Object> response = new HashMap<>();
            response.put("productId", savedProduct.getId());
            response.put("name", savedProduct.getName());
            response.put("message", "Product added successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to add product: " + e.getMessage()));
        }
    }

    /**
     * Update product
     * PUT /api/seller/products/{productId}
     */
    @PutMapping("/products/{productId}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long productId,
            @RequestBody Product updatedProduct) {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("User not authenticated"));
            }

            Optional<Seller> sellerOpt = sellerService.getSellerByUser(user);
            if (!sellerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Seller profile not found"));
            }

            Product product = sellerService.updateProduct(sellerOpt.get().getId(), productId, updatedProduct);

            Map<String, Object> response = new HashMap<>();
            response.put("productId", product.getId());
            response.put("name", product.getName());
            response.put("message", "Product updated successfully");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to update product: " + e.getMessage()));
        }
    }

    /**
     * Delete product
     * DELETE /api/seller/products/{productId}
     */
    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("User not authenticated"));
            }

            Optional<Seller> sellerOpt = sellerService.getSellerByUser(user);
            if (!sellerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("Seller profile not found"));
            }

            sellerService.deleteProduct(sellerOpt.get().getId(), productId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to delete product: " + e.getMessage()));
        }
    }

    /**
     * Get all sellers (Admin only)
     * GET /api/seller/admin/all
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllSellers() {
        try {
            List<Seller> sellers = sellerService.getAllSellers();
            return ResponseEntity.ok(sellers);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Verify seller (Admin only)
     * PUT /api/seller/admin/{sellerId}/verify
     */
    @PutMapping("/admin/{sellerId}/verify")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> verifySeller(@PathVariable Long sellerId) {
        try {
            Seller seller = sellerService.verifySeller(sellerId);

            Map<String, Object> response = new HashMap<>();
            response.put("sellerId", seller.getId());
            response.put("shopName", seller.getShopName());
            response.put("verificationStatus", seller.getVerificationStatus());
            response.put("message", "Seller verified successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to verify seller: " + e.getMessage()));
        }
    }

    /**
     * Reject seller (Admin only)
     * PUT /api/seller/admin/{sellerId}/reject
     */
    @PutMapping("/admin/{sellerId}/reject")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> rejectSeller(
            @PathVariable Long sellerId,
            @RequestBody Map<String, String> request) {
        try {
            String reason = request.getOrDefault("reason", "No reason provided");
            Seller seller = sellerService.rejectSeller(sellerId, reason);

            Map<String, Object> response = new HashMap<>();
            response.put("sellerId", seller.getId());
            response.put("shopName", seller.getShopName());
            response.put("verificationStatus", seller.getVerificationStatus());
            response.put("message", "Seller rejected");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to reject seller: " + e.getMessage()));
        }
    }

    /**
     * Error response class
     */
    static class ErrorResponse {
        public String error;
        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}
