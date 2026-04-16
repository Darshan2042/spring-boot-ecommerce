package com.luv2code.ecommerce.rest;

import com.luv2code.ecommerce.dao.ProductCategoryRepository;
import com.luv2code.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-categories")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000", "http://localhost:4200"})
public class ProductCategoryController {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    /**
     * Get all product categories
     */
    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllCategories() {
        System.out.println("[ProductCategoryController] Fetching all categories");
        try {
            List<ProductCategory> categories = productCategoryRepository.findAll();
            System.out.println("[ProductCategoryController] Found " + categories.size() + " categories");
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            System.err.println("[ProductCategoryController] Error fetching categories: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Get category by ID
     */
    @GetMapping("/{categoryId}")
    public ResponseEntity<ProductCategory> getCategoryById(@PathVariable Long categoryId) {
        return productCategoryRepository.findById(categoryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new category (Admin only)
     */
    @PostMapping
    public ResponseEntity<ProductCategory> createCategory(@RequestBody ProductCategory category) {
        ProductCategory savedCategory = productCategoryRepository.save(category);
        return ResponseEntity.status(201).body(savedCategory);
    }

    /**
     * Update category (Admin only)
     */
    @PutMapping("/{categoryId}")
    public ResponseEntity<ProductCategory> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody ProductCategory categoryDetails) {
        
        return productCategoryRepository.findById(categoryId)
                .map(category -> {
                    category.setCategoryName(categoryDetails.getCategoryName());
                    ProductCategory updated = productCategoryRepository.save(category);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete category (Admin only)
     */
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        if (productCategoryRepository.existsById(categoryId)) {
            productCategoryRepository.deleteById(categoryId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
