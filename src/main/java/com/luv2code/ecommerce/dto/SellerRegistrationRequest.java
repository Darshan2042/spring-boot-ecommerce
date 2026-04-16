package com.luv2code.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerRegistrationRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Shop name is required")
    private String shopName;

    private String shopDescription;

    @NotBlank(message = "Business email is required")
    @Email(message = "Business email should be valid")
    private String businessEmail;

    private String phoneNumber;

    @NotBlank(message = "Business address is required")
    private String businessAddress;

    private String city;

    private String state;

    private String zipCode;

    private String country;

    private String bankAccount;
}
