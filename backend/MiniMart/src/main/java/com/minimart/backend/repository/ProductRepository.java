package com.minimart.backend.repository;

import com.minimart.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findTop10ByStatusOrderByProductIdDesc(String status);

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

    @Query(value = "SELECT * FROM products p WHERE " +
            "(:search IS NULL OR p.name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%') AND " +
            "(:categoryId IS NULL OR p.category_id = :categoryId) AND " +
            "(p.status = :status)",

            countQuery = "SELECT count(*) FROM products p WHERE " +
                    "(:search IS NULL OR p.name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%') AND " +
                    "(:categoryId IS NULL OR p.category_id = :categoryId) AND " +
                    "(p.status = :status)",

            nativeQuery = true)
    Page<Product> findWithFilters(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("status") String status,
            Pageable pageable);

    // Kiểm tra xem tên đã tồn tại chưa
    boolean existsByName(String name);

    Optional<Product> findByName(String name);

    @Query(value = "SELECT TOP 4 * FROM products WHERE category_id = :categoryId AND product_id != :productId AND status = 'active' ORDER BY NEWID()", nativeQuery = true)
    List<Product> findSimilarProducts(@Param("categoryId") Long categoryId, @Param("productId") Long productId);
}
