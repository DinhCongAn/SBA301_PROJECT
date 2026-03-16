package com.minimart.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.minimart.backend.config.JwtUtil;
import com.minimart.backend.dto.ForgotPasswordRequest;
import com.minimart.backend.dto.LoginRequest;
import com.minimart.backend.dto.RegisterRequest;
import com.minimart.backend.entity.User;
import com.minimart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Lấy Client ID từ biến môi trường application.properties
    @Value("${GOOGLE_CLIENT_ID}")
    private String googleClientId;

    // 1. ĐĂNG KÝ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) return ResponseEntity.badRequest().body("Username đã tồn tại!");
        if (userRepository.existsByEmail(request.getEmail())) return ResponseEntity.badRequest().body("Email đã được sử dụng!");

        User newUser = new User();
        newUser.setFullName(request.getFullName());
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPhone(request.getPhone());
        newUser.setRole("CUSTOMER");
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa MK

        userRepository.save(newUser);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // 2. ĐĂNG NHẬP THƯỜNG
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("user_id", user.getUserId());
            response.put("username", user.getUsername());
            response.put("full_name", user.getFullName());
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
            response.put("phone", user.getPhone());
            response.put("avatar_url", user.getAvatarUrl());

            // Kiểm tra mật khẩu (Dùng chung logic)
            boolean hasPassword = !passwordEncoder.matches("GOOGLE_DEFAULT_PASS", user.getPassword());
            response.put("has_password", hasPassword);

            // Tạo thẻ JWT
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            response.put("token", token); // Gửi thẻ về cho ReactJS cất vào localStorage

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tài khoản hoặc mật khẩu!");
    }

    // 3. ĐĂNG NHẬP BẰNG GOOGLE
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId)).build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String pictureUrl = (String) payload.get("picture");

                // TÌM HOẶC TẠO MỚI USER (Chỉ lưu Data ở đây)
                User user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName((String) payload.get("name"));
                    newUser.setUsername("gg_" + email.split("@")[0]);
                    newUser.setRole("CUSTOMER");
                    newUser.setAvatarUrl(pictureUrl);
                    newUser.setPassword(passwordEncoder.encode("GOOGLE_DEFAULT_PASS")); // Set mật khẩu ảo
                    return userRepository.save(newUser);
                });

                // ĐƯA BIẾN RESPONSE RA NGOÀI KHỐI LAMBDA NÀY
                Map<String, Object> response = new HashMap<>();
                response.put("user_id", user.getUserId());
                response.put("username", user.getUsername());
                response.put("full_name", user.getFullName());
                response.put("role", user.getRole());
                response.put("phone", user.getPhone());
                response.put("avatar_url", user.getAvatarUrl());
                response.put("email", user.getEmail());

                // Kiểm tra xem đã đổi mật khẩu thật bao giờ chưa
                boolean hasPassword = !passwordEncoder.matches("GOOGLE_DEFAULT_PASS", user.getPassword());
                response.put("has_password", hasPassword);

                // Tạo thẻ JWT cho tài khoản Google
                String jwtToken = jwtUtil.generateToken(user.getUsername(), user.getRole());
                response.put("token", jwtToken);

                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token Google không hợp lệ!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xác thực Google.");
        }
    }

    // 4. QUÊN MẬT KHẨU
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return ResponseEntity.ok("Cập nhật mật khẩu thành công!");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy tài khoản với email này!");
    }
}