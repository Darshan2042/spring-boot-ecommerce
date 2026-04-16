package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "products", path = "products")
public interface ProductRepository extends JpaRepository<Product, Long>
{
    /**
     * Find products by name containing keyword (search)
     */
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    /**
     * Find products by category ID
     */
    Page<Product> findAllByCategoryId(Long categoryId, Pageable pageable);

    /**
     * Find products by name and category
     */
    Page<Product> findByNameContainingIgnoreCaseAndCategoryId(String keyword, Long categoryId, Pageable pageable);

    /**
     * Find products by seller
     */
    List<Product> findBySeller(Seller seller);

    /**
     * Find products by seller with pagination
     */
    Page<Product> findBySeller(Seller seller, Pageable pageable);

    /**
     * Find products by seller and name
     */
    Page<Product> findBySellerAndNameContainingIgnoreCase(Seller seller, String keyword, Pageable pageable);

    /**
     * Find active products only (for customer viewing)
     */
    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.dateCreated DESC")
    Page<Product> findAllActive(Pageable pageable);

    /**
     * Find active products by keyword search
     */
    @Query("SELECT p FROM Product p WHERE p.active = true AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY p.dateCreated DESC")
    Page<Product> findActiveByNameContainingIgnoreCase(String keyword, Pageable pageable);

    /**
     * Find active products by category
     */
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.category.id = :categoryId ORDER BY p.dateCreated DESC")
    Page<Product> findActiveByCategoryId(Long categoryId, Pageable pageable);

    /**
     * Find active products by category and keyword
     */
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.category.id = :categoryId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY p.dateCreated DESC")
    Page<Product> findActiveByNameContainingIgnoreCaseAndCategoryId(String keyword, Long categoryId, Pageable pageable);
}
