package com.minimart.backend.controller;

import com.minimart.backend.entity.Product;
import com.minimart.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Cho phép React gọi
public class ProductController {
    @Autowired
    private ProductService productService;

    // GET: Lấy danh sách
    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    // POST: Thêm mới
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    // PUT: Cập nhật (truyền ID trên URL)
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id); // Gán ID để đảm bảo update đúng dòng
        return productService.saveProduct(product);
    }

    // DELETE: Xóa
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}