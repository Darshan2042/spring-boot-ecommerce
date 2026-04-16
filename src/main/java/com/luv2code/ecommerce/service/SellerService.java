package com.luv2code.ecommerce.service;

import com.luv2code.ecommerce.dao.ProductRepository;
import com.luv2code.ecommerce.dao.SellerRepository;
import com.luv2code.ecommerce.dao.UserRepository;
import com.luv2code.ecommerce.dto.SellerRegistrationRequest;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.Seller;
import com.luv2code.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SellerService {

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new seller
     */
    public Seller registerSeller(SellerRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Check if shop name already exists
        if (sellerRepository.findByShopName(request.getShopName()).isPresent()) {
            throw new IllegalArgumentException("Shop name already exists");
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.getRoles().add("ROLE_SELLER");
        user.getRoles().add("ROLE_USER");

        User savedUser = userRepository.save(user);

        // Create seller profile
        Seller seller = new Seller();
        seller.setUser(savedUser);
        seller.setShopName(request.getShopName());
        seller.setShopDescription(request.getShopDescription());
        seller.setBusinessEmail(request.getBusinessEmail());
        seller.setPhoneNumber(request.getPhoneNumber());
        seller.setBusinessAddress(request.getBusinessAddress());
        seller.setCity(request.getCity());
        seller.setState(request.getState());
        seller.setZipCode(request.getZipCode());
        seller.setCountry(request.getCountry());
        seller.setBankAccount(request.getBankAccount());
        seller.setVerificationStatus("pending");
        seller.setActive(true);

        return sellerRepository.save(seller);
    }

    /**
     * Get seller by user
     */
    public Optional<Seller> getSellerByUser(User user) {
        return sellerRepository.findByUser(user);
    }

    /**
     * Get seller by ID
     */
    public Optional<Seller> getSellerById(Long sellerId) {
        return sellerRepository.findById(sellerId);
    }

    /**
     * Get all products for a seller
     */
    public List<Product> getSellerProducts(Long sellerId) {
        Optional<Seller> seller = sellerRepository.findById(sellerId);
        if (seller.isPresent()) {
            return productRepository.findBySeller(seller.get());
        }
        throw new IllegalArgumentException("Seller not found");
    }

    /**
     * Get paginated products for a seller
     */
    public Page<Product> getSellerProductsPaginated(Long sellerId, Pageable pageable) {
        Optional<Seller> seller = sellerRepository.findById(sellerId);
        if (seller.isPresent()) {
            return productRepository.findBySeller(seller.get(), pageable);
        }
        throw new IllegalArgumentException("Seller not found");
    }

    /**
     * Add a new product for seller
     */
    public Product addProduct(Long sellerId, Product product) {
        Optional<Seller> sellerOpt = sellerRepository.findById(sellerId);
        if (!sellerOpt.isPresent()) {
            throw new IllegalArgumentException("Seller not found");
        }

        Seller seller = sellerOpt.get();
        product.setSeller(seller);
        return productRepository.save(product);
    }

    /**
     * Update seller's product
     */
    public Product updateProduct(Long sellerId, Long productId, Product updatedProduct) {
        Optional<Seller> sellerOpt = sellerRepository.findById(sellerId);
        if (!sellerOpt.isPresent()) {
            throw new IllegalArgumentException("Seller not found");
        }

        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            throw new IllegalArgumentException("Product not found");
        }

        Product product = productOpt.get();

        // Verify seller owns this product
        if (!product.getSeller().getId().equals(sellerId)) {
            throw new IllegalArgumentException("Unauthorized: You don't own this product");
        }

        // Update fields
        if (updatedProduct.getName() != null) {
            product.setName(updatedProduct.getName());
        }
        if (updatedProduct.getDescription() != null) {
            product.setDescription(updatedProduct.getDescription());
        }
        if (updatedProduct.getUnitPrice() != null) {
            product.setUnitPrice(updatedProduct.getUnitPrice());
        }
        if (updatedProduct.getImageUrl() != null) {
            product.setImageUrl(updatedProduct.getImageUrl());
        }
        product.setUnitsInStock(updatedProduct.getUnitsInStock());
        product.setActive(updatedProduct.isActive());
        if (updatedProduct.getCategory() != null) {
            product.setCategory(updatedProduct.getCategory());
        }

        return productRepository.save(product);
    }

    /**
     * Delete seller's product
     */
    public void deleteProduct(Long sellerId, Long productId) {
        Optional<Seller> sellerOpt = sellerRepository.findById(sellerId);
        if (!sellerOpt.isPresent()) {
            throw new IllegalArgumentException("Seller not found");
        }

        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            throw new IllegalArgumentException("Product not found");
        }

        Product product = productOpt.get();

        // Verify seller owns this product
        if (!product.getSeller().getId().equals(sellerId)) {
            throw new IllegalArgumentException("Unauthorized: You don't own this product");
        }

        productRepository.delete(product);
    }

    /**
     * Update seller profile
     */
    public Seller updateSellerProfile(Long sellerId, Seller updatedSeller) {
        Optional<Seller> sellerOpt = sellerRepository.findById(sellerId);
        if (!sellerOpt.isPresent()) {
            throw new IllegalArgumentException("Seller not found");
        }

        Seller seller = sellerOpt.get();

        if (updatedSeller.getShopDescription() != null) {
            seller.setShopDescription(updatedSeller.getShopDescription());
        }
        if (updatedSeller.getPhoneNumber() != null) {
            seller.setPhoneNumber(updatedSeller.getPhoneNumber());
        }
        if (updatedSeller.getBusinessAddress() != null) {
            seller.setBusinessAddress(updatedSeller.getBusinessAddress());
        }
        if (updatedSeller.getCity() != null) {
            seller.setCity(updatedSeller.getCity());
        }
        if (updatedSeller.getState() != null) {
            seller.setState(updatedSeller.getState());
        }
        if (updatedSeller.getZipCode() != null) {
            seller.setZipCode(updatedSeller.getZipCode());
        }
        if (updatedSeller.getCountry() != null) {
            seller.setCountry(updatedSeller.getCountry());
        }

        return sellerRepository.save(seller);
    }

    /**
     * Get seller dashboard stats
     */
    public Seller getSellerDashboard(Long sellerId) {
        Optional<Seller> seller = sellerRepository.findById(sellerId);
        if (!seller.isPresent()) {
            throw new IllegalArgumentException("Seller not found");
        }
        return seller.get();
    }

    /**
     * Get all sellers (for admin)
     */
    public List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }

    /**
     * Verify seller (admin only)
     */
    public Seller verifySeller(Long sellerId) {
        Optional<Seller> sellerOpt = sellerRepository.findById(sellerId);
        if (!sellerOpt.isPresent()) {
            throw new IllegalArgumentException("Seller not found");
        }

        Seller seller = sellerOpt.get();
        seller.setVerificationStatus("verified");
        return sellerRepository.save(seller);
    }

    /**
     * Reject seller (admin only)
     */
    public Seller rejectSeller(Long sellerId, String reason) {
        Optional<Seller> sellerOpt = sellerRepository.findById(sellerId);
        if (!sellerOpt.isPresent()) {
            throw new IllegalArgumentException("Seller not found");
        }

        Seller seller = sellerOpt.get();
        seller.setVerificationStatus("rejected");
        return sellerRepository.save(seller);
    }
}
