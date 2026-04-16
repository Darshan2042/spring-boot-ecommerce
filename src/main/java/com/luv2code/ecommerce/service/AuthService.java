package com.luv2code.ecommerce.service;

import com.luv2code.ecommerce.entity.User;
import com.luv2code.ecommerce.entity.Cart;
import com.luv2code.ecommerce.dao.UserRepository;
import com.luv2code.ecommerce.dao.CartRepository;
import com.luv2code.ecommerce.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String password, String firstName, String lastName) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username taken");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);

        Set<String> roles = new HashSet<>();
        roles.add("USER");
        user.setRoles(roles);

        User saved = userRepository.save(user);

        Cart c = new Cart();
        c.setUser(saved);
        c.setCartItems(new HashSet<>());
        cartRepository.save(c);
        saved.setCart(c);
        return saved;
    }

    public String loginUser(String username, String password) {
        logger.info("Login attempt for username/email: {}", username);
        
        // Step 1: Try to find user by username or email
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username).orElse(null));
        
        if (user == null) {
            logger.warn("User not found with username or email: {}", username);
            throw new RuntimeException("Invalid username or password");
        }
        
        logger.info("User found: {}", user.getUsername());
        
        // Step 2: Verify password manually
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Password verification failed for user: {}", user.getUsername());
            throw new RuntimeException("Invalid username or password");
        }
        
        logger.info("Password verified successfully for user: {}", user.getUsername());
        
        // Step 3: Create authentication token
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), password)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtils.generateJwtToken(authentication);
            logger.info("JWT token generated successfully for user: {}", user.getUsername());
            return token;
        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", user.getUsername(), e);
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User updateUser(Long userId, String firstName, String lastName, String phoneNumber, 
                           String address, String city, String state, String zipCode, String country) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);
        if (address != null) user.setAddress(address);
        if (city != null) user.setCity(city);
        if (state != null) user.setState(state);
        if (zipCode != null) user.setZipCode(zipCode);
        if (country != null) user.setCountry(country);

        return userRepository.save(user);
    }

    public String generateTokenForUser(String username, String password) {
        try {
            // Authenticate the user with plain password to generate token
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtils.generateJwtToken(authentication);
            logger.info("JWT token generated for newly registered user: {}", username);
            return token;
        } catch (Exception e) {
            logger.error("Failed to generate token for user: {}", username, e);
            throw new RuntimeException("Failed to generate authentication token: " + e.getMessage());
        }
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username).orElse(null));
    }
}
