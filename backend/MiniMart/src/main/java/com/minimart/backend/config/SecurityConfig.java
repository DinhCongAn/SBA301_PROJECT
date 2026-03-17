package com.minimart.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // 1. Cấu hình CORS: Cho phép Frontend (ReactJS) gọi API
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Tắt CSRF: Chuẩn bảo mật cho REST API sử dụng JWT (Stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Cấu hình Headers: Cho phép mở Popup đăng nhập của bên thứ 3 (Google OAuth2)
                .headers(headers -> headers
                        .crossOriginOpenerPolicy(coop -> coop.policy(
                                CrossOriginOpenerPolicyHeaderWriter.CrossOriginOpenerPolicy.SAME_ORIGIN_ALLOW_POPUPS
                        ))
                )

                // 4. Quản lý Session: Không lưu trạng thái phiên làm việc trên Server
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. Phân quyền truy cập API (Authorization)
                .authorizeHttpRequests(auth -> auth
                        // [Khu vực Public] - Không yêu cầu đăng nhập
                        .requestMatchers(
                                "/api/auth/**",       // API Đăng nhập, Đăng ký
                                "/api/products/**",   // Xem danh sách/chi tiết sản phẩm
                                "/api/categories/**", // Xem danh mục
                                "/api/sliders/**",    // Xem banner/slider
                                "/api/home/**",       // Dữ liệu trang chủ
                                "/ws/**",             // Kênh kết nối WebSocket (Thông báo Real-time)
                                "/error/**"           // Cho phép điều hướng đến các trang xử lý lỗi
                        ).permitAll()

                        // [Khu vực Admin] - Bắt buộc có quyền "ADMIN"
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")

                        // [Khu vực Khách hàng] - Yêu cầu Token hợp lệ (Đã đăng nhập)
                        .anyRequest().authenticated()
                )

                // 6. Chèn bộ lọc JWT: Kiểm tra Token trước khi vào hệ thống
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Cấu hình chi tiết bộ lọc CORS
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Cho phép nhận request từ ReactJS
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // Cho phép các phương thức gọi API chuẩn REST
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Chỉ định rõ các header được phép truyền qua lại
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

        // Cho phép gửi kèm thông tin xác thực (Credentials/Token)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Áp dụng luật CORS này cho toàn bộ endpoint

        return source;
    }
}