package com.luv2code.ecommerce.dto;

import lombok.Data;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class AddProductRequest {

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Unit price must be greater than or equal to 0")
    private BigDecimal unitPrice;

    private String imageUrl;

    private Boolean active = true;

    @NotNull(message = "Units in stock is required")
    @Min(value = 0, message = "Units in stock must be greater than or equal to 0")
    private Integer unitsInStock;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
