package com.saassum.ai.controller;

import com.saassum.ai.dto.ApiResponse;
import com.saassum.ai.dto.InitialGenerationRequest;
import com.saassum.ai.model.Project;
import com.saassum.ai.model.WebsiteConfiguration;
import com.saassum.ai.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiGenerationController {

    private final ProjectService projectService;

    public AiGenerationController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/generate")
    public ApiResponse<Map<String, Object>> generateInitialWebsite(@Valid @RequestBody InitialGenerationRequest request) {
        try {
            Project project = projectService.createProjectWithWebsite(request);
            WebsiteConfiguration config = projectService.getConfiguration(project.getId()).orElse(null);

            return ApiResponse.ok("Website generated successfully", Map.of(
                    "project", project,
                    "configuration", config != null ? config.getConfigData() : "{}",
                    "version", config != null ? config.getVersion() : 1
            ));
        } catch (Exception e) {
            return ApiResponse.error("Failed to generate website: " + e.getMessage());
        }
    }
}
