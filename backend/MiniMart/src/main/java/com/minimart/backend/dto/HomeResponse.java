package com.minimart.backend.dto;

import com.minimart.backend.entity.Category;
import com.minimart.backend.entity.Product;
import com.minimart.backend.entity.Slider;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class HomeResponse {
    private List<Slider> sliders;
    private List<Category> categories;
    private List<Product> featuredProducts;
}