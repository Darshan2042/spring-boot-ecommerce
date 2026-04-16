package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Seller;
import com.luv2code.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByUser(User user);
    Optional<Seller> findByShopName(String shopName);
    Optional<Seller> findByBusinessEmail(String businessEmail);
    Optional<Seller> findByUserId(Long userId);
}
