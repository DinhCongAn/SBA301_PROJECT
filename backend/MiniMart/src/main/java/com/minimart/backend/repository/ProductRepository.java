package com.minimart.backend.repository;

import com.minimart.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findTop8ByStatusOrderByProductIdDesc(String status);

    @Query(value = "SELECT * FROM Products WHERE status = 'active' " +
            "AND (:keyword IS NULL OR name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :keyword + '%') " +
            "AND (:categoryId IS NULL OR category_id = :categoryId) " +
            "AND (:minPrice IS NULL OR price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR price <= :maxPrice)",

            countQuery = "SELECT COUNT(*) FROM Products WHERE status = 'active' " +
                    "AND (:keyword IS NULL OR name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :keyword + '%') " +
                    "AND (:categoryId IS NULL OR category_id = :categoryId) " +
                    "AND (:minPrice IS NULL OR price >= :minPrice) " +
                    "AND (:maxPrice IS NULL OR price <= :maxPrice)",
            nativeQuery = true)
    Page<Product> searchAndFilterProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );
}
