package com.saassum.ai;

import com.saassum.ai.dto.ChangeOperation;
import com.saassum.ai.dto.InitialGenerationRequest;
import com.saassum.ai.service.DemoGenerationService;
import com.saassum.ai.service.ExportService;
import com.saassum.ai.service.WebsiteModifierEngine;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SaassumBackendTests {

    @Autowired
    private WebsiteModifierEngine modifierEngine;

    @Autowired
    private DemoGenerationService demoService;

    @Autowired
    private ExportService exportService;

    @Test
    void testInitialDemoGeneration() {
        InitialGenerationRequest req = new InitialGenerationRequest();
        req.setBusinessName("Test Studio");
        req.setDescription("Creative digital agency");
        req.setTheme("Modern");

        String json = demoService.generateDemoInitialConfig(req);
        assertNotNull(json);
        assertTrue(json.contains("Test Studio"));
        assertTrue(json.contains("Navbar"));
        assertTrue(json.contains("Hero"));
    }

    @Test
    void testModifierEngineUpdateTheme() throws Exception {
        InitialGenerationRequest req = new InitialGenerationRequest();
        req.setBusinessName("Alpha Shop");
        String baseJson = demoService.generateDemoInitialConfig(req);

        ChangeOperation op = new ChangeOperation(
                "UPDATE_THEME",
                null,
                "Change to purple and gold",
                Map.of("primaryColor", "#8b5cf6", "secondaryColor", "#f59e0b")
        );

        String updated = modifierEngine.applyOperations(baseJson, List.of(op));
        assertNotNull(updated);
        assertTrue(updated.contains("#8b5cf6"));
        assertTrue(updated.contains("#f59e0b"));
    }

    @Test
    void testExportZipGeneration() throws Exception {
        InitialGenerationRequest req = new InitialGenerationRequest();
        req.setBusinessName("Export Brand");
        String json = demoService.generateDemoInitialConfig(req);

        byte[] zipBytes = exportService.generateExportZip(json);
        assertNotNull(zipBytes);
        assertTrue(zipBytes.length > 500, "ZIP should contain index.html, style.css, script.js");
    }
}
