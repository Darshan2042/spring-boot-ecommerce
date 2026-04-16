package com.luv2code.ecommerce.config;

import com.luv2code.ecommerce.dao.ProductCategoryRepository;
import com.luv2code.ecommerce.dao.ProductRepository;
import com.luv2code.ecommerce.dao.UserRepository;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import com.luv2code.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize admin user
        if (userRepository.count() == 0) {
            initializeAdminUser();
        }

        // Initialize categories
        if (categoryRepository.count() == 0) {
            initializeCategories();
        }

        // Initialize products
        if (productRepository.count() == 0) {
            initializeProducts();
        }

        System.out.println("✅ Database initialized with sample data");
    }

    private void initializeAdminUser() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@shophub.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEnabled(true);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_ADMIN");
        roles.add("ROLE_USER");
        admin.setRoles(roles);
        
        userRepository.save(admin);
        System.out.println("✅ Admin user created: admin@shophub.com / admin123");
    }

    private void initializeCategories() {
        // Electronics Category
        ProductCategory electronics = new ProductCategory();
        electronics.setCategoryName("Electronics");
        categoryRepository.save(electronics);

        // Fashion Category
        ProductCategory fashion = new ProductCategory();
        fashion.setCategoryName("Fashion");
        categoryRepository.save(fashion);

        // Home & Living Category
        ProductCategory homeLiving = new ProductCategory();
        homeLiving.setCategoryName("Home & Living");
        categoryRepository.save(homeLiving);

        // Books Category
        ProductCategory books = new ProductCategory();
        books.setCategoryName("Books");
        categoryRepository.save(books);

        System.out.println("✅ Categories initialized: Electronics, Fashion, Home & Living, Books");
    }

    private void initializeProducts() {

    // Get categories
    ProductCategory electronics = categoryRepository.findAll().get(0); // Electronics
    ProductCategory fashion = categoryRepository.findAll().get(1);     // Fashion
    ProductCategory homeLiving = categoryRepository.findAll().get(2);  // Home & Living
    ProductCategory books = categoryRepository.findAll().get(3);       // Books

    Date now = new Date();

    // ================= ELECTRONICS =================
    addProduct("MacBook Pro 14\"", "Powerful laptop for professionals", 1999.99,
            "https://unsplash.com/photos/turned-on-laptop-on-table-HyTwtsk8XqA", electronics, now);

    addProduct("iPhone 15 Pro", "Latest Apple smartphone with advanced camera", 999.99,
            "https://source.unsplash.com/300x250/?iphone", electronics, now);

    addProduct("AirPods Pro", "Premium wireless earbuds with noise cancellation", 249.99,
            "https://source.unsplash.com/300x250/?airpods", electronics, now);

    addProduct("iPad Air", "Versatile tablet for work and creative professionals", 599.99,
            "https://source.unsplash.com/300x250/?ipad", electronics, now);

    addProduct("Apple Watch Series 9", "Smartwatch with health tracking features", 399.99,
            "https://source.unsplash.com/300x250/?smartwatch", electronics, now);

    addProduct("4K Webcam", "Professional streaming webcam", 149.99,
            "https://source.unsplash.com/300x250/?webcam", electronics, now);

    addProduct("USB-C Hub", "7-in-1 multiport adapter", 79.99,
            "https://source.unsplash.com/300x250/?usb-c-hub", electronics, now);

    addProduct("Wireless Mouse", "Ergonomic mouse with silent click", 49.99,
            "https://source.unsplash.com/300x250/?wireless-mouse", electronics, now);

    // ================= FASHION =================
    addProduct("Cotton T-Shirt", "Comfortable everyday cotton t-shirt", 29.99,
            "https://source.unsplash.com/300x250/?tshirt", fashion, now);

    addProduct("Running Shoes", "Professional running shoes with cushioning", 129.99,
            "https://source.unsplash.com/300x250/?running-shoes", fashion, now);

    addProduct("Blue Jeans", "Classic denim jeans for casual wear", 79.99,
            "https://source.unsplash.com/300x250/?jeans", fashion, now);

    addProduct("Winter Jacket", "Warm waterproof winter jacket", 199.99,
            "https://source.unsplash.com/300x250/?winter-jacket", fashion, now);

    addProduct("Leather Wallet", "Premium leather wallet with RFID protection", 59.99,
            "https://source.unsplash.com/300x250/?leather-wallet", fashion, now);

    // ================= HOME & LIVING =================
    addProduct("Coffee Maker", "Programmable coffee maker with timer", 89.99,
            "https://source.unsplash.com/300x250/?coffee-maker", homeLiving, now);

    addProduct("Bedding Set", "Soft and comfortable 4-piece bedding set", 99.99,
            "https://source.unsplash.com/300x250/?bedding", homeLiving, now);

    addProduct("Table Lamp", "Modern LED table lamp with dimming", 45.99,
            "https://source.unsplash.com/300x250/?table-lamp", homeLiving, now);

    addProduct("Throw Pillow", "Decorative throw pillow for sofa", 24.99,
            "https://source.unsplash.com/300x250/?pillow", homeLiving, now);

    addProduct("Desk Chair", "Ergonomic office chair with lumbar support", 299.99,
            "https://source.unsplash.com/300x250/?office-chair", homeLiving, now);

    // ================= BOOKS =================
    addProduct("Clean Code", "A Handbook of Agile Craftsmanship by Robert C. Martin", 39.99,
            "https://source.unsplash.com/300x250/?programming-book", books, now);

    addProduct("Design Patterns", "Elements of Reusable Object-Oriented Software", 49.99,
            "https://source.unsplash.com/300x250/?software-design-book", books, now);

    addProduct("Atomic Habits", "Tiny Changes, Remarkable Results by James Clear", 29.99,
            "https://source.unsplash.com/300x250/?self-help-book", books, now);

    System.out.println("✅ Products initialized successfully with real images");
}

    private void addProduct(String name, String description, double price, String imageUrl, 
                           ProductCategory category, Date dateCreated) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setUnitPrice(new BigDecimal(price));
        product.setImageUrl(imageUrl);
        product.setActive(true);
        product.setDateCreated(dateCreated);
        product.setUnitsInStock(100);  // Set default stock
        product.setCategory(category);
        productRepository.save(product);
    }
}
