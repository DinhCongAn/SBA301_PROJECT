package com.minimart.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 🚀 QUY TẮC BẢO MẬT API
                .authorizeHttpRequests(auth -> auth
                        // 1. Khu vực công cộng: Ai cũng được vào (Xem SP, Đăng nhập, Trang chủ...)
                        .requestMatchers("/api/auth/**", "/api/products/**", "/api/categories/**", "/api/sliders/**", "/api/home/**").permitAll()

                        // 2. Khu vực tuyệt mật: BẮT BUỘC phải có thẻ ADMIN mới được chui vào link có chữ /api/admin/
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")

                        // 3. Khu vực khách hàng: Các API còn lại (Giỏ hàng, Hồ sơ, Đặt hàng...) cần phải đăng nhập (USER hay ADMIN đều được)
                        .anyRequest().authenticated()
                )
                // Đặt anh bảo vệ JwtAuthFilter đứng trước cửa để kiểm tra thẻ
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}