package com.minimart.backend.controller;

import com.minimart.backend.entity.Product;
import com.minimart.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public Page<Product> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        if (search != null && search.trim().isEmpty()) search = null;

        // Xử lý logic Sắp xếp (Sort)
        Sort sortObj = Sort.by(Sort.Direction.DESC, "product_id");
        if ("price_asc".equals(sort)) {
            sortObj = Sort.by(Sort.Direction.ASC, "price"); // Giá thấp đến cao
        } else if ("price_desc".equals(sort)) {
            sortObj = Sort.by(Sort.Direction.DESC, "price"); // Giá cao đến thấp
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);

        return productRepository.searchAndFilterProducts(search, category, minPrice, maxPrice, pageable);
    }
}