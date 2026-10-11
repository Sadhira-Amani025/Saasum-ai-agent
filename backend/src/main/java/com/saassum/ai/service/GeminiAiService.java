package com.saassum.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saassum.ai.dto.ChangeOperation;
import com.saassum.ai.dto.ChangePlanResponse;
import com.saassum.ai.dto.InitialGenerationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiAiService implements AiService {

    @Value("${ai.gemini.api-key:}")
    private String apiKey;

    @Value("${ai.gemini.model:gemini-3.5-flash}")
    private String configuredModel;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final WebsiteModifierEngine modifierEngine;
    private final DemoGenerationService demoService;
    private final WebsiteConfigValidator validator;

    public GeminiAiService(WebsiteModifierEngine modifierEngine, DemoGenerationService demoService, WebsiteConfigValidator validator) {
        this.modifierEngine = modifierEngine;
        this.demoService = demoService;
        this.validator = validator;
    }

    @Override
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.contains("your_");
    }

    @Override
    public String getActiveProviderName() {
        return "Google Gemini (" + configuredModel + ")";
    }

    @Override
    public String generateInitialWebsite(InitialGenerationRequest request) throws Exception {
        if (!isConfigured() || request.isDemoMode()) {
            return demoService.generateDemoInitialConfig(request);
        }

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a world-renowned digital design director and web architect creating a complete, high-converting digital website configuration JSON.\n\n");
        prompt.append("INPUT REQUIREMENTS:\n");
        prompt.append("- Business Name: ").append(request.getBusinessName()).append("\n");
        prompt.append("- Category/Industry: ").append(request.getCategory() != null ? request.getCategory() : "General Commerce").append("\n");
        prompt.append("- Website Description & Vision: ").append(request.getDescription()).append("\n");
        prompt.append("- Selected Theme Style: ").append(request.getTheme() != null ? request.getTheme() : "Modern").append("\n");
        prompt.append("- Primary Brand Color: ").append(request.getPrimaryColor() != null ? request.getPrimaryColor() : "#6366f1").append("\n");
        prompt.append("- Secondary Accent Color: ").append(request.getSecondaryColor() != null ? request.getSecondaryColor() : "#a855f7").append("\n");

        if (request.getRequiredSections() != null && !request.getRequiredSections().isEmpty()) {
            prompt.append("- Required Sections to Include: ").append(String.join(", ", request.getRequiredSections())).append("\n");
        }
        if (request.getProductDetails() != null && !request.getProductDetails().isBlank()) {
            prompt.append("- Specific Product/Service Offerings: ").append(request.getProductDetails()).append("\n");
        }
        if (request.getContactDetails() != null && !request.getContactDetails().isBlank()) {
            prompt.append("- Contact Information: ").append(request.getContactDetails()).append("\n");
        }

        prompt.append("\nCRITICAL DOMAIN RULES:\n");
        prompt.append("1. ADAPT TO THE BUSINESS TYPE: If the business is a Bakery, Restaurant, Portfolio, Online Store, or Agency, DO NOT generate generic SaaS software copy (e.g. '99.9% uptime', 'API keys', 'Software plans'). Instead generate realistic, mouthwatering items, artisan bakes, case studies, or retail products with realistic prices.\n");
        prompt.append("2. COMPONENT SELECTION: Include an appropriate set of sections: Navbar, Hero, About (story and highlights), ProductCards (or ServiceCards), Features (benefits), Gallery (visual showcase), Testimonials (labeled as sample), ContactForm, and Footer. Include PricingCards ONLY if appropriate for the business model.\n");
        prompt.append("3. NO FAKE CLAIMS OR REVIEWS: Any testimonials MUST have \"badge\": \"Sample Customer Review\" or \"badge\": \"Sample Client Endorsement\". Do not claim real certifications, awards, or medical guarantees.\n");
        prompt.append("4. HIGH-RESOLUTION UNSPLASH IMAGES: Use working Unsplash CDN URLs (e.g. food/bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', portfolio: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', fashion: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'). Never output empty or broken image URLs.\n");
        prompt.append("5. DETERMINISTIC SECTION IDs: Every section must have an 'id' attribute (e.g. 'sec-navbar-1', 'sec-hero-1', 'sec-about-1', 'sec-products-1', 'sec-gallery-1', 'sec-contact-1', 'sec-footer-1').\n");
        prompt.append("6. NAVBAR LINKS FORMAT: In the Navbar section, links MUST be an array of objects with exactly two fields: \"text\" (visible link label) and \"href\" (anchor). The href MUST use the full section id (e.g. '#sec-about-1', '#sec-products-1', '#sec-contact-1'). Never use 'label', 'name', 'url', or 'to' as field names. Never use short anchors like '#about' or '#products'.\n");

        prompt.append("\nOUTPUT FORMAT SPECIFICATION:\n");
        prompt.append("Output STRICTLY a valid JSON object matching this schema:\n");
        prompt.append("{\n");
        prompt.append("  \"theme\": {\n");
        prompt.append("    \"id\": \"").append(request.getTheme() != null ? request.getTheme() : "Modern").append("\",\n");
        prompt.append("    \"primaryColor\": \"").append(request.getPrimaryColor() != null ? request.getPrimaryColor() : "#6366f1").append("\",\n");
        prompt.append("    \"secondaryColor\": \"").append(request.getSecondaryColor() != null ? request.getSecondaryColor() : "#a855f7").append("\",\n");
        prompt.append("    \"backgroundColor\": \"#0b0f19\",\n");
        prompt.append("    \"textColor\": \"#f9fafb\",\n");
        prompt.append("    \"cardBackground\": \"#111827\",\n");
        prompt.append("    \"fontFamily\": \"Inter, sans-serif\",\n");
        prompt.append("    \"borderRadius\": \"12px\",\n");
        prompt.append("    \"isDark\": true\n");
        prompt.append("  },\n");
        prompt.append("  \"meta\": {\n");
        prompt.append("    \"brandName\": \"").append(request.getBusinessName()).append("\",\n");
        prompt.append("    \"title\": \"").append(request.getBusinessName()).append(" | Official Digital Experience\",\n");
        prompt.append("    \"tagline\": \"High-impact tagline\"\n");
        prompt.append("  },\n");
        prompt.append("  \"sections\": [\n");
        prompt.append("    // Supported types: Navbar, Hero, About, ProductCards, ServiceCards, Features, Gallery, PricingCards, Testimonials, FAQ, ContactForm, Newsletter, Footer\n");
        prompt.append("  ]\n");
        prompt.append("}\n");

        String systemInstruction = "You are a world-class AI website architect. Generate rich, domain-specific copy appropriate to the user's business type. Output STRICTLY pure JSON with no markdown backticks, no comments, and no preamble.";

        try {
            String rawJson = callGeminiRaw(prompt.toString(), systemInstruction);
            String cleaned = extractJsonFromResponse(rawJson);
            JsonNode tree = objectMapper.readTree(cleaned);
            if (tree.has("sections") && tree.get("sections").isArray() && tree.get("sections").size() > 0) {
                String serialized = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(tree);
                return validator.validateAndSanitize(serialized, request.getBusinessName(), request.getCategory());
            }
        } catch (Exception e) {
            System.err.println("[GeminiAiService] Fallback to demo generator due to: " + e.getMessage());
        }

        return demoService.generateDemoInitialConfig(request);
    }

    @Override
    public ChangePlanResponse generateEditPlan(String instruction, String currentConfigJson) throws Exception {
        if (!isConfigured()) {
            return demoService.generateDemoEditPlan(instruction, currentConfigJson);
        }

        String prompt = "USER MODIFICATION REQUEST: \"" + instruction + "\"\n\n" +
                "CURRENT WEBSITE CONFIGURATION:\n" + currentConfigJson + "\n\n" +
                "Generate a structured change plan using only supported operation types:\n" +
                "- UPDATE_THEME: payload can include { primaryColor, secondaryColor, backgroundColor, textColor, cardBackground, borderRadius, isDark, fontFamily }\n" +
                "- UPDATE_TEXT: targetId (e.g. sec-hero-1), payload with updated prop keys { title, subtitle, badge, etc. }\n" +
                "- ADD_SECTION: payload { type: 'About'|'Gallery'|'Features'|'FAQ'|'SearchInput'|'Newsletter'|'ProductCards'|'ServiceCards'|'ContactForm', position: 'top'|'bottom'|number, props: {...} }\n" +
                "- REMOVE_SECTION: targetId or payload { type: 'SectionType' }\n" +
                "- REORDER_SECTION: targetId, payload { newIndex: number | 'up' | 'down' }\n" +
                "- ADD_BUTTON: targetId (e.g. sec-hero-1), payload { text: 'WhatsApp', href: 'https://...', variant: 'primary'|'outline' }\n" +
                "- ADD_FORM_FIELD: targetId (e.g. sec-contact-1), payload { label: 'Phone', type: 'tel', name: 'phone', required: false }\n" +
                "- ADD_PRODUCT: targetId, payload { name: 'Item', price: '$49', description: '...', badge: 'New' }\n" +
                "- UPDATE_COMPONENT_STYLE: targetId, payload { ... }\n\n" +
                "Return a JSON object in this format:\n" +
                "{\n" +
                "  \"summary\": \"Brief explanation of changes\",\n" +
                "  \"operations\": [\n" +
                "    { \"type\": \"OPERATION_TYPE\", \"targetId\": \"sec-hero-1\", \"description\": \"What changed\", \"payload\": { ... } }\n" +
                "  ]\n" +
                "}";

        String systemInstruction = "You are a precision website modification planner. Preserve all unrelated content. Output ONLY the JSON change plan object.";

        try {
            String rawJson = callGeminiRaw(prompt, systemInstruction);
            String cleaned = extractJsonFromResponse(rawJson);
            JsonNode planNode = objectMapper.readTree(cleaned);

            String summary = planNode.path("summary").asText("Applied changes: " + instruction);
            List<ChangeOperation> ops = new ArrayList<>();
            if (planNode.has("operations") && planNode.get("operations").isArray()) {
                ops = objectMapper.convertValue(planNode.get("operations"), new TypeReference<List<ChangeOperation>>() {});
            }

            if (!ops.isEmpty()) {
                String updatedConfig = modifierEngine.applyOperations(currentConfigJson, ops);
                String sanitized = validator.validateAndSanitize(updatedConfig, "SaaSsum Brand", "GENERAL");
                return new ChangePlanResponse(summary, ops, sanitized, null, "Google Gemini (" + configuredModel + ")");
            }
        } catch (Exception e) {
            System.err.println("[GeminiAiService] Error in edit plan: " + e.getMessage() + ". Using deterministic engine.");
        }

        return demoService.generateDemoEditPlan(instruction, currentConfigJson);
    }

    private String callGeminiRaw(String userPrompt, String systemPrompt) throws Exception {
        List<String> modelsToTry = List.of(configuredModel, "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-flash-latest");
        Exception lastError = null;

        for (String m : modelsToTry) {
            try {
                String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + m + ":generateContent?key=" + apiKey.trim();

                Map<String, Object> reqBody = Map.of(
                        "contents", List.of(
                                Map.of("role", "user", "parts", List.of(Map.of("text", userPrompt)))
                        ),
                        "generationConfig", Map.of(
                                "temperature", 0.7,
                                "maxOutputTokens", 8192,
                                "responseMimeType", "application/json"
                        ),
                        "systemInstruction", Map.of(
                                "parts", List.of(Map.of("text", systemPrompt))
                        )
                );

                String jsonPayload = objectMapper.writeValueAsString(reqBody);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .timeout(Duration.ofSeconds(45))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode respNode = objectMapper.readTree(response.body());
                    JsonNode textNode = respNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");
                    if (!textNode.isMissingNode() && !textNode.asText().isBlank()) {
                        return textNode.asText();
                    }
                } else {
                    lastError = new RuntimeException("Gemini returned " + response.statusCode() + ": " + response.body());
                }
            } catch (Exception e) {
                lastError = e;
            }
        }

        throw lastError != null ? lastError : new RuntimeException("Failed to call Gemini API across all models.");
    }

    private String extractJsonFromResponse(String raw) {
        if (raw == null || raw.isBlank()) return "{}";
        String s = raw.trim();

        if (s.startsWith("```json")) s = s.substring(7);
        else if (s.startsWith("```")) s = s.substring(3);
        if (s.endsWith("```")) s = s.substring(0, s.length() - 3);
        s = s.trim();

        int firstBrace = s.indexOf('{');
        int lastBrace = s.lastIndexOf('}');
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            return s.substring(firstBrace, lastBrace + 1);
        }

        return s;
    }
}
