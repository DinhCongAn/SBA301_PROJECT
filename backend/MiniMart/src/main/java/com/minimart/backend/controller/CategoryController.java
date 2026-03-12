//package com.minimart.backend.controller;
//
//import com.minimart.backend.entity.Category;
//import com.minimart.backend.service.CategoryService;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/categories")
//@CrossOrigin(origins = "http://localhost:5173")
//public class CategoryController {
//    private final CategoryService categoryService;
//
//    public CategoryController(CategoryService categoryService) {
//        this.categoryService = categoryService;
//    }
//
//    @GetMapping
//    public List<Category> getAll() {
//        return categoryService.getAllCategories();
//    }
//}