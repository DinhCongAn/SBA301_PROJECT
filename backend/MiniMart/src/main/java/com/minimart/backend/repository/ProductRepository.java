package com.minimart.backend.repository;

import com.minimart.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findTop8ByStatusOrderByProductIdDesc(String status);

    @Query(value = "SELECT * FROM products p WHERE p.status = 'active' AND (" +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            /* Hàm loại bỏ dấu tiếng Việt giả lập bằng REPLACE */
            "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(p.name, 'á', 'a'), 'à', 'a'), 'ả', 'a'), 'ã', 'a'), 'ạ', 'a'), 'ă', 'a'), 'ắ', 'a'), 'ằ', 'a'), 'ẳ', 'a'), 'ẵ', 'a'), 'ặ', 'a')) " +
            "LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            ")", nativeQuery = true)
    List<Product> searchProducts(@Param("keyword") String keyword);
}
