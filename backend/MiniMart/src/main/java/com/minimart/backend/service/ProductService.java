package com.minimart.backend.service;

import com.minimart.backend.entity.Product;
import com.minimart.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 1. Đọc (Read)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 2. Thêm & Sửa (Create & Update)
    // Nếu product có ID -> Update. Nếu không có ID -> Create
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // 3. Xóa (Delete)
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
