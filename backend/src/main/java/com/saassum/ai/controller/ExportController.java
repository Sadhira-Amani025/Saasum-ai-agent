package com.saassum.ai.controller;

import com.saassum.ai.model.WebsiteConfiguration;
import com.saassum.ai.service.ExportService;
import com.saassum.ai.service.ProjectService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ExportService exportService;
    private final ProjectService projectService;

    public ExportController(ExportService exportService, ProjectService projectService) {
        this.exportService = exportService;
        this.projectService = projectService;
    }

    @PostMapping("/zip")
    public ResponseEntity<byte[]> exportZipDirect(@RequestBody Map<String, String> payload) {
        try {
            String configJson = payload.getOrDefault("configJson", "{}");
            byte[] zipBytes = exportService.generateExportZip(configJson);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"saassum-website.zip\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<byte[]> exportProjectZip(@PathVariable UUID projectId) {
        try {
            WebsiteConfiguration config = projectService.getConfiguration(projectId)
                    .orElseThrow(() -> new IllegalArgumentException("Project configuration not found: " + projectId));

            byte[] zipBytes = exportService.generateExportZip(config.getConfigData());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"project-" + projectId + "-website.zip\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
