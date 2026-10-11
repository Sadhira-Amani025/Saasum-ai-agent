package com.saassum.ai.controller;

import com.saassum.ai.dto.ApiResponse;
import com.saassum.ai.service.GeminiAiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final GeminiAiService geminiService;

    public HealthController(GeminiAiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok(Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "service", "SaaSsum AI Commerce Backend (Spring Boot 3)"
        ));
    }

    @GetMapping("/status")
    public ApiResponse<Map<String, Object>> status() {
        boolean configured = geminiService.isConfigured();
        return ApiResponse.ok(Map.of(
                "aiConfigured", configured,
                "aiProvider", configured ? geminiService.getActiveProviderName() : "Demo Mode / Offline",
                "database", "Active (JPA/Supabase)",
                "supportedOperations", List.of(
                        "UPDATE_THEME", "UPDATE_TEXT", "ADD_SECTION", "REMOVE_SECTION",
                        "REORDER_SECTION", "ADD_BUTTON", "UPDATE_BUTTON", "ADD_FORM_FIELD",
                        "REMOVE_COMPONENT", "UPDATE_LAYOUT", "ADD_PRODUCT", "UPDATE_COMPONENT_STYLE"
                )
        ));
    }
}
