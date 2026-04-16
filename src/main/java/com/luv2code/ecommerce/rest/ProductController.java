package com.luv2code.ecommerce.rest;

import com.luv2code.ecommerce.dao.ProductRepository;
import com.luv2code.ecommerce.dto.AddProductRequest;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000", "http://localhost:4200"})
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    /**
     * Get all products with pagination (customers see only active products)
     */
    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId) {
        
        try {
            Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
            
            Page<Product> products;
            
            if (keyword != null && !keyword.isEmpty()) {
                if (categoryId != null) {
                    products = productRepository.findActiveByNameContainingIgnoreCaseAndCategoryId(keyword, categoryId, pageable);
                } else {
                    products = productRepository.findActiveByNameContainingIgnoreCase(keyword, pageable);
                }
            } else if (categoryId != null) {
                products = productRepository.findActiveByCategoryId(categoryId, pageable);
            } else {
                products = productRepository.findAllActive(pageable);
            }
            
            // Wrap response to avoid HAL serialization issues
            Map<String, Object> response = new HashMap<>();
            response.put("content", products.getContent());
            response.put("totalElements", products.getTotalElements());
            response.put("totalPages", products.getTotalPages());
            response.put("currentPage", page);
            response.put("pageSize", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch products: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get product by ID
     */
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId) {
        return productRepository.findById(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get products by category (customers see only active products)
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
            Page<Product> products = productRepository.findActiveByCategoryId(categoryId, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", products.getContent());
            response.put("totalElements", products.getTotalElements());
            response.put("totalPages", products.getTotalPages());
            response.put("currentPage", page);
            response.put("pageSize", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch products by category: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Search products by keyword (customers see only active products)
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
            Page<Product> products = productRepository.findActiveByNameContainingIgnoreCase(keyword, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", products.getContent());
            response.put("totalElements", products.getTotalElements());
            response.put("totalPages", products.getTotalPages());
            response.put("currentPage", page);
            response.put("pageSize", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to search products: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get all products for admin (admin can see both active and inactive)
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllProductsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        
        try {
            Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
            Page<Product> products = productRepository.findAll(pageable);
            
            // Wrap response to avoid HAL serialization issues
            Map<String, Object> response = new HashMap<>();
            response.put("content", products.getContent());
            response.put("totalElements", products.getTotalElements());
            response.put("totalPages", products.getTotalPages());
            response.put("currentPage", page);
            response.put("pageSize", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch admin products: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Create product (admin only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody AddProductRequest request) {
        try {
            Product product = productService.createProduct(request);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    /**
     * Update product (admin only)
     */
    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long productId, @RequestBody Map<String, Object> updates) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
            
            if (updates.containsKey("sku")) {
                product.setSku((String) updates.get("sku"));
            }
            if (updates.containsKey("name")) {
                product.setName((String) updates.get("name"));
            }
            if (updates.containsKey("description")) {
                product.setDescription((String) updates.get("description"));
            }
            if (updates.containsKey("unitPrice")) {
                product.setUnitPrice(new java.math.BigDecimal(updates.get("unitPrice").toString()));
            }
            if (updates.containsKey("unitsInStock")) {
                product.setUnitsInStock(((Number) updates.get("unitsInStock")).intValue());
            }
            if (updates.containsKey("imageUrl")) {
                product.setImageUrl((String) updates.get("imageUrl"));
            }
            if (updates.containsKey("active")) {
                product.setActive((Boolean) updates.get("active"));
            }
            if (updates.containsKey("categoryId")) {
                Long categoryId = ((Number) updates.get("categoryId")).longValue();
                // Category retrieval would go here if needed
            }
            
            Product updated = productRepository.save(product);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    /**
     * Delete product (admin only)
     */
    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.ok(Collections.singletonMap("message", "Product deleted successfully"));
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }
}
