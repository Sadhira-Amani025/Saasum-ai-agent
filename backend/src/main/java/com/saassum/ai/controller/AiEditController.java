package com.saassum.ai.controller;

import com.saassum.ai.dto.ApiResponse;
import com.saassum.ai.dto.ChangePlanResponse;
import com.saassum.ai.dto.EditInstructionRequest;
import com.saassum.ai.model.WebsiteConfiguration;
import com.saassum.ai.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
public class AiEditController {

    private final ProjectService projectService;

    public AiEditController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/edit")
    public ApiResponse<ChangePlanResponse> editWebsite(@Valid @RequestBody EditInstructionRequest request) {
        try {
            if (request.getProjectId() == null) {
                return ApiResponse.error("Project ID is required for conversational modifications.");
            }

            ChangePlanResponse plan = projectService.applyEditInstruction(
                    request.getProjectId(),
                    request.getInstruction(),
                    request.getCurrentConfigJson()
            );

            return ApiResponse.ok("Modification applied successfully", plan);
        } catch (Exception e) {
            return ApiResponse.error("Failed to apply edit instruction: " + e.getMessage());
        }
    }

    @PostMapping("/undo/{projectId}")
    public ApiResponse<Map<String, Object>> undo(@PathVariable UUID projectId) {
        try {
            WebsiteConfiguration restored = projectService.undoLastChange(projectId)
                    .orElseThrow(() -> new IllegalArgumentException("No earlier version available to undo."));

            return ApiResponse.ok("Undo successful", Map.of(
                    "configuration", restored.getConfigData(),
                    "version", restored.getVersion()
            ));
        } catch (Exception e) {
            return ApiResponse.error("Undo failed: " + e.getMessage());
        }
    }

    @PostMapping("/restore/{projectId}/{versionNumber}")
    public ApiResponse<Map<String, Object>> restoreVersion(@PathVariable UUID projectId, @PathVariable int versionNumber) {
        try {
            WebsiteConfiguration restored = projectService.restoreVersion(projectId, versionNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Version " + versionNumber + " not found."));

            return ApiResponse.ok("Restored version " + versionNumber + " successfully", Map.of(
                    "configuration", restored.getConfigData(),
                    "version", restored.getVersion()
            ));
        } catch (Exception e) {
            return ApiResponse.error("Restore failed: " + e.getMessage());
        }
    }
}
