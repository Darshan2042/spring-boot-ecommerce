package com.luv2code.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration for Spring MVC to properly serve the Single Page Application (SPA)
 * Handles routing for React client-side pages
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Resource handlers are not needed - Spring Boot defaults work fine
     */

    /**
     * Forward requests to index.html for SPA routing
     * This allows all client-side routes (/home, /products, /cart, etc.) to work
     * The React router will handle the actual routing on the client side
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward root to index.html
        registry.addViewController("/").setViewName("forward:/index.html");
        
        // Forward all non-API routes to index.html for SPA routing
        registry.addViewController("/home").setViewName("forward:/index.html");
        registry.addViewController("/products").setViewName("forward:/index.html");
        registry.addViewController("/cart").setViewName("forward:/index.html");
        registry.addViewController("/orders").setViewName("forward:/index.html");
        registry.addViewController("/auth").setViewName("forward:/index.html");
        registry.addViewController("/checkout").setViewName("forward:/index.html");
    }
}
