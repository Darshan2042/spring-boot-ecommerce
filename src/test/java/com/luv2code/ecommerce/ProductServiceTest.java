package com.luv2code.ecommerce;

import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import com.luv2code.ecommerce.dao.ProductRepository;
import com.luv2code.ecommerce.dao.ProductCategoryRepository;
import com.luv2code.ecommerce.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    private Product testProduct;
    private ProductCategory testCategory;

    @BeforeEach
    public void setUp() {
        // Create and save test category first
        testCategory = new ProductCategory();
        testCategory.setCategoryName("Test Category");
        testCategory = productCategoryRepository.save(testCategory);

        // Create test product
        testProduct = new Product();
        testProduct.setName("Test Product");
        testProduct.setDescription("Test product description");
        testProduct.setUnitPrice(new BigDecimal("99.99"));
        testProduct.setCategory(testCategory);
        testProduct.setUnitsInStock(100);
        testProduct.setActive(true);
        testProduct.setSku("TEST-SKU-001");
        testProduct.setImageUrl("https://example.com/image.jpg");

        // Save to database
        testProduct = productRepository.save(testProduct);
    }

    @Test
    public void testGetProductById() {
        Optional<Product> product = productService.getProductById(testProduct.getId());
        assertTrue(product.isPresent());
        assertEquals("Test Product", product.get().getName());
    }

    @Test
    public void testGetProductByIdNotFound() {
        Optional<Product> product = productService.getProductById(99999L);
        assertFalse(product.isPresent());
    }

    @Test
    public void testGetProductByIdInvalidId() {
        assertThrows(IllegalArgumentException.class, () -> {
            productService.getProductById(-1L);
        });
    }

    @Test
    public void testGetAllProducts() {
        Page<Product> products = productService.getAllProducts(0, 20);
        assertNotNull(products);
        assertTrue(products.getTotalElements() > 0);
    }

    @Test
    public void testGetProductsByCategory() {
        Page<Product> products = productService.getProductsByCategory(testCategory.getId(), 0, 20);
        assertNotNull(products);
        assertTrue(products.getTotalElements() > 0);
    }

    @Test
    public void testGetProductsByCategoryInvalidId() {
        assertThrows(IllegalArgumentException.class, () -> {
            productService.getProductsByCategory(-1L, 0, 20);
        });
    }

    @Test
    public void testSearchProducts() {
        Page<Product> products = productService.searchProducts("Test", 0, 20);
        assertNotNull(products);
        assertTrue(products.getTotalElements() > 0);
    }

    @Test
    public void testSearchProductsEmptyKeyword() {
        Page<Product> products = productService.searchProducts("", 0, 20);
        assertNotNull(products);
        assertTrue(products.getTotalElements() > 0);
    }

    @Test
    public void testSearchProductsNullKeyword() {
        Page<Product> products = productService.searchProducts(null, 0, 20);
        assertNotNull(products);
        assertTrue(products.getTotalElements() > 0);
    }

    @Test
    public void testSearchProductsByCategory() {
        Page<Product> products = productService.searchProductsByCategory("Test", testCategory.getId(), 0, 20);
        assertNotNull(products);
        assertTrue(products.getTotalElements() > 0);
    }

    @Test
    public void testSearchProductsByCategoryInvalidId() {
        assertThrows(IllegalArgumentException.class, () -> {
            productService.searchProductsByCategory("Test", -1L, 0, 20);
        });
    }

    @Test
    public void testGetProductWithStockValidation() {
        Product product = productService.getProductWithStockValidation(testProduct.getId(), 50);
        assertNotNull(product);
        assertEquals("Test Product", product.getName());
    }

    @Test
    public void testGetProductWithStockValidationInsufficientStock() {
        assertThrows(RuntimeException.class, () -> {
            productService.getProductWithStockValidation(testProduct.getId(), 200);
        });
    }

    @Test
    public void testGetProductWithStockValidationNotFound() {
        assertThrows(RuntimeException.class, () -> {
            productService.getProductWithStockValidation(99999L, 50);
        });
    }

    @Test
    public void testIsProductInStock() {
        boolean inStock = productService.isProductInStock(testProduct.getId());
        assertTrue(inStock);
    }

    @Test
    public void testIsProductOutOfStock() {
        Product outOfStockProduct = new Product();
        outOfStockProduct.setName("Out of Stock Product");
        outOfStockProduct.setDescription("Out of stock product");
        outOfStockProduct.setUnitPrice(new BigDecimal("49.99"));
        outOfStockProduct.setCategory(testCategory);  // Use the test category
        outOfStockProduct.setUnitsInStock(0);
        outOfStockProduct.setActive(true);
        outOfStockProduct.setSku("OUT-STOCK-001");
        productRepository.save(outOfStockProduct);

        boolean inStock = productService.isProductInStock(outOfStockProduct.getId());
        assertFalse(inStock);
    }

    @Test
    public void testHasSufficientStock() {
        boolean hasSufficient = productService.hasSufficientStock(testProduct.getId(), 50);
        assertTrue(hasSufficient);
    }

    @Test
    public void testHasInsufficientStock() {
        boolean hasSufficient = productService.hasSufficientStock(testProduct.getId(), 200);
        assertFalse(hasSufficient);
    }

    @Test
    public void testHasSufficientStockNotFound() {
        boolean hasSufficient = productService.hasSufficientStock(99999L, 50);
        assertFalse(hasSufficient);
    }
}
