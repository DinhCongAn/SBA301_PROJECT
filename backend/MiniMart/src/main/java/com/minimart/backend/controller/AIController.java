package com.minimart.backend.controller;

import com.minimart.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public Map<String, String> chatWithAI(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String aiResponse = aiService.getShoppingAdvice(userMessage);
        return Map.of("reply", aiResponse);
    }
}