package com.saassum.ai.controller;

import com.saassum.ai.dto.ApiResponse;
import com.saassum.ai.dto.SaveConfigRequest;
import com.saassum.ai.model.Project;
import com.saassum.ai.model.WebsiteConfiguration;
import com.saassum.ai.model.WebsiteVersion;
import com.saassum.ai.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ApiResponse<List<Project>> listProjects() {
        return ApiResponse.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ApiResponse<Project> getProject(@PathVariable UUID id) {
        return projectService.getProjectById(id)
                .map(ApiResponse::ok)
                .orElse(ApiResponse.error("Project not found with id: " + id));
    }

    @GetMapping("/{id}/config")
    public ApiResponse<WebsiteConfiguration> getConfiguration(@PathVariable UUID id) {
        return projectService.getConfiguration(id)
                .map(ApiResponse::ok)
                .orElse(ApiResponse.error("Website configuration not found for project: " + id));
    }

    @PutMapping("/{id}/config")
    public ApiResponse<WebsiteConfiguration> saveConfigurationPut(
            @PathVariable UUID id,
            @Valid @RequestBody SaveConfigRequest request) {
        WebsiteConfiguration saved = projectService.saveDirectConfiguration(id, request);
        return ApiResponse.ok("Website configuration saved successfully.", saved);
    }

    @PostMapping("/{id}/config")
    public ApiResponse<WebsiteConfiguration> saveConfigurationPost(
            @PathVariable UUID id,
            @Valid @RequestBody SaveConfigRequest request) {
        WebsiteConfiguration saved = projectService.saveDirectConfiguration(id, request);
        return ApiResponse.ok("Website configuration saved successfully.", saved);
    }

    @GetMapping("/{id}/versions")
    public ApiResponse<List<WebsiteVersion>> getVersions(@PathVariable UUID id) {
        return ApiResponse.ok(projectService.getVersionHistory(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ApiResponse.ok("Project and associated configurations deleted successfully.", id.toString());
    }
}
