package com.minimart.backend.repository;

import com.minimart.backend.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    @Query(value = "SELECT r.* FROM product_reviews r " +
            "LEFT JOIN users u ON r.user_id = u.user_id " +
            "LEFT JOIN products p ON r.product_id = p.product_id " +
            "WHERE (:rating IS NULL OR r.rating = :rating) AND " +
            "(:search IS NULL OR " +
            "r.comment COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%' OR " +
            "u.full_name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%' OR " +
            "p.name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%')",

            countQuery = "SELECT count(*) FROM product_reviews r " +
                    "LEFT JOIN users u ON r.user_id = u.user_id " +
                    "LEFT JOIN products p ON r.product_id = p.product_id " +
                    "WHERE (:rating IS NULL OR r.rating = :rating) AND " +
                    "(:search IS NULL OR " +
                    "r.comment COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%' OR " +
                    "u.full_name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%' OR " +
                    "p.name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%')",

            nativeQuery = true)
    Page<ProductReview> findByAdminFilters(
            @Param("search") String search,
            @Param("rating") Integer rating,
            Pageable pageable);
}