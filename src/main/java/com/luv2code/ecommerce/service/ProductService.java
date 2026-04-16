package com.luv2code.ecommerce.service;

import com.luv2code.ecommerce.dao.ProductRepository;
import com.luv2code.ecommerce.dao.ProductCategoryRepository;
import com.luv2code.ecommerce.dto.AddProductRequest;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    /**
     * Get all products with pagination
     */
    public Page<Product> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    /**
     * Get product by ID
     */
    public Optional<Product> getProductById(Long productId) {
        if (productId == null || productId <= 0) {
            throw new IllegalArgumentException("Product ID must be greater than 0");
        }
        return productRepository.findById(productId);
    }

    /**
     * Get products by category
     */
    public Page<Product> getProductsByCategory(Long categoryId, int page, int size) {
        if (categoryId == null || categoryId <= 0) {
            throw new IllegalArgumentException("Category ID must be greater than 0");
        }
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAllByCategoryId(categoryId, pageable);
    }

    /**
     * Search products by keyword
     */
    public Page<Product> searchProducts(String keyword, int page, int size) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllProducts(page, size);
        }
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }

    /**
     * Search products by keyword and category
     */
    public Page<Product> searchProductsByCategory(String keyword, Long categoryId, int page, int size) {
        if (categoryId == null || categoryId <= 0) {
            throw new IllegalArgumentException("Category ID must be greater than 0");
        }
        if (keyword == null || keyword.trim().isEmpty()) {
            return getProductsByCategory(categoryId, page, size);
        }
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCaseAndCategoryId(keyword, categoryId, pageable);
    }

    /**
     * Get product with stock validation
     */
    public Product getProductWithStockValidation(Long productId, int requestedQuantity) {
        Product product = getProductById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (product.getUnitsInStock() < requestedQuantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                    ". Available: " + product.getUnitsInStock() + ", Requested: " + requestedQuantity);
        }

        return product;
    }

    /**
     * Create a new product (admin only)
     */
    public Product createProduct(AddProductRequest request) {
        ProductCategory category = productCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));

        Product product = new Product();
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setUnitPrice(request.getUnitPrice());
        product.setImageUrl(request.getImageUrl());
        product.setActive(request.getActive() != null ? request.getActive() : true);
        product.setUnitsInStock(request.getUnitsInStock());
        product.setCategory(category);

        return productRepository.save(product);
    }

    /**
     * Delete a product by id (admin only)
     */
    public void deleteProduct(Long productId) {
        if (productId == null || productId <= 0) {
            throw new IllegalArgumentException("Product ID must be greater than 0");
        }

        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found: " + productId);
        }

        productRepository.deleteById(productId);
    }

    /**
     * Check if product is in stock
     */
    public boolean isProductInStock(Long productId) {
        return getProductById(productId)
                .map(product -> product.getUnitsInStock() > 0)
                .orElse(false);
    }

    /**
     * Check if product has sufficient stock
     */
    public boolean hasSufficientStock(Long productId, int quantity) {
        return getProductById(productId)
                .map(product -> product.getUnitsInStock() >= quantity)
                .orElse(false);
    }
}
