package com.luv2code.ecommerce.security;

import com.luv2code.ecommerce.entity.User;
import com.luv2code.ecommerce.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isEnabled(),
                true,
                true,
                true,
                getAuthorities(user)
        );
    }

    private Set<GrantedAuthority> getAuthorities(User user) {
        if (user.getRoles() != null) {
            return user.getRoles().stream()
                    .map(role -> {
                        // Roles are already stored with "ROLE_" prefix, don't add it again
                        String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();
                        return new SimpleGrantedAuthority(authority);
                    })
                    .collect(Collectors.toSet());
        }
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }
}
