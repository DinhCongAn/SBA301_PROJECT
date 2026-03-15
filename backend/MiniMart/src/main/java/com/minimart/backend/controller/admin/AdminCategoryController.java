package com.minimart.backend.controller.admin;

import com.minimart.backend.entity.Category;
import com.minimart.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@CrossOrigin("*")
public class AdminCategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // API lấy toàn bộ danh mục cho Dropdown bên Frontend
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}