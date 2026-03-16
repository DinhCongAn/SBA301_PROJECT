package com.minimart.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // Chìa khóa bí mật để ký Token (Tuyệt đối không để lộ)
    private static final String SECRET_KEY_STRING = "MiniMartSecureKey2026ForJwtAuthenticationXYZ123!";
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

    // Thời gian sống của Token: 7 ngày
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;

    // 1. Tạo Token (Nhét Username và Role vào trong thẻ)
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. Trích xuất Username từ Token
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // 3. Trích xuất Quyền (Role) từ Token
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // 4. Kiểm tra Token có hợp lệ và còn hạn không
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}