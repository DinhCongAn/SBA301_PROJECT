package com.minimart.backend.controller;

import com.minimart.backend.entity.Product;
import com.minimart.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // API nhận request dạng: /api/products?search=chuối
    @GetMapping
    public List<Product> getProducts(@RequestParam(required = false) String search) {
        return productRepository.searchProducts(search);
    }
}


