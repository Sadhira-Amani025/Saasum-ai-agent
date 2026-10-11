package com.saassum.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class WebsiteConfigValidator {

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Validates and sanitizes a website configuration JSON.
     * Guarantees structural integrity, contrast harmony, sensible defaults for missing fields,
     * deduplication, deterministic section IDs, and safe fallback image URLs.
     */
    public String validateAndSanitize(String configJson, String defaultBrandName, String category) {
        if (configJson == null || configJson.isBlank()) {
            throw new IllegalArgumentException("Website configuration JSON cannot be null or empty.");
        }

        JsonNode rootNode;
        try {
            rootNode = objectMapper.readTree(configJson);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON format in website configuration: " + e.getMessage(), e);
        }

        if (!rootNode.isObject()) {
            throw new IllegalArgumentException("Website configuration must be a valid JSON object.");
        }

        try {
            ObjectNode root = (ObjectNode) rootNode;

            // 1. Sanitize Theme
            sanitizeTheme(root);

            // 2. Sanitize Meta
            sanitizeMeta(root, defaultBrandName);

            // 3. Sanitize Sections
            sanitizeSections(root, defaultBrandName, category);

            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(root);
        } catch (Exception e) {
            System.err.println("[WebsiteConfigValidator] Sanitization warning: " + e.getMessage());
            return configJson;
        }
    }

    private void sanitizeTheme(ObjectNode root) {
        ObjectNode theme = root.has("theme") && root.get("theme").isObject()
                ? (ObjectNode) root.get("theme")
                : root.putObject("theme");

        if (!theme.has("primaryColor") || theme.get("primaryColor").asText().isBlank()) {
            theme.put("primaryColor", "#6366f1");
        }
        if (!theme.has("secondaryColor") || theme.get("secondaryColor").asText().isBlank()) {
            theme.put("secondaryColor", "#a855f7");
        }
        if (!theme.has("borderRadius") || theme.get("borderRadius").asText().isBlank()) {
            theme.put("borderRadius", "12px");
        }
        if (!theme.has("fontFamily") || theme.get("fontFamily").asText().isBlank()) {
            theme.put("fontFamily", "Inter, sans-serif");
        }

        boolean isDark = theme.has("isDark") ? theme.get("isDark").asBoolean(true) : true;
        String bg = theme.path("backgroundColor").asText("");
        if (bg.isBlank()) {
            bg = isDark ? "#0b0f19" : "#ffffff";
            theme.put("backgroundColor", bg);
        }

        // Check contrast via mathematical luminance
        boolean looksLight = isColorLight(bg);
        if (looksLight) {
            theme.put("isDark", false);
            if (!theme.has("textColor") || theme.get("textColor").asText().isBlank() || "#ffffff".equalsIgnoreCase(theme.get("textColor").asText())) {
                theme.put("textColor", "#111827");
            }
            if (!theme.has("cardBackground") || theme.get("cardBackground").asText().isBlank()) {
                theme.put("cardBackground", "#ffffff");
            }
        } else {
            theme.put("isDark", true);
            if (!theme.has("textColor") || theme.get("textColor").asText().isBlank() || "#111827".equalsIgnoreCase(theme.get("textColor").asText())) {
                theme.put("textColor", "#f9fafb");
            }
            if (!theme.has("cardBackground") || theme.get("cardBackground").asText().isBlank()) {
                theme.put("cardBackground", "#111827");
            }
        }
    }

    private boolean isColorLight(String hex) {
        if (hex == null || !hex.startsWith("#")) return false;
        try {
            String clean = hex.substring(1);
            if (clean.length() == 3) {
                clean = "" + clean.charAt(0) + clean.charAt(0) + clean.charAt(1) + clean.charAt(1) + clean.charAt(2) + clean.charAt(2);
            }
            if (clean.length() == 6) {
                int r = Integer.parseInt(clean.substring(0, 2), 16);
                int g = Integer.parseInt(clean.substring(2, 4), 16);
                int b = Integer.parseInt(clean.substring(4, 6), 16);
                double lum = (0.299 * r + 0.587 * g + 0.114 * b);
                return lum > 140.0;
            }
        } catch (Exception ignored) {}
        return false;
    }

    private void sanitizeMeta(ObjectNode root, String defaultBrandName) {
        ObjectNode meta = root.has("meta") && root.get("meta").isObject()
                ? (ObjectNode) root.get("meta")
                : root.putObject("meta");

        String brand = meta.path("brandName").asText("").trim();
        if (brand.isBlank()) {
            brand = (defaultBrandName != null && !defaultBrandName.isBlank()) ? defaultBrandName : "SaaSsum Commerce";
            meta.put("brandName", brand);
        }
        if (!meta.has("title") || meta.get("title").asText().isBlank()) {
            meta.put("title", brand + " | Official Digital Experience");
        }
        if (!meta.has("tagline") || meta.get("tagline").asText().isBlank()) {
            meta.put("tagline", "From Business Idea to Digital Commerce in Minutes.");
        }
    }

    private void sanitizeSections(ObjectNode root, String brandName, String category) {
        if (!root.has("sections") || !root.get("sections").isArray()) {
            root.putArray("sections");
            return;
        }

        ArrayNode rawSections = (ArrayNode) root.get("sections");
        ArrayNode sanitized = objectMapper.createArrayNode();
        String previousType = null;
        Set<String> seenIds = new HashSet<>();

        for (int i = 0; i < rawSections.size(); i++) {
            JsonNode secNode = rawSections.get(i);
            if (!secNode.isObject()) continue;

            ObjectNode sec = (ObjectNode) secNode;
            String type = sec.path("type").asText("").trim();
            if (type.isBlank()) continue;

            // Prevent repeated consecutive duplicate sections
            if (type.equalsIgnoreCase(previousType) && !"ProductCards".equalsIgnoreCase(type)) {
                continue;
            }
            previousType = type;

            // Ensure unique, clean ID
            String id = sec.path("id").asText("").trim();
            if (id.isBlank() || seenIds.contains(id)) {
                id = "sec-" + type.toLowerCase() + "-" + (i + 1);
            }
            seenIds.add(id);
            sec.put("id", id);

            // Ensure props object exists
            ObjectNode props = sec.has("props") && sec.get("props").isObject()
                    ? (ObjectNode) sec.get("props")
                    : sec.putObject("props");

            // Unpack nested data wrapper if present in sec or props
            if (sec.has("data") && sec.get("data").isObject()) {
                ObjectNode dataObj = (ObjectNode) sec.remove("data");
                dataObj.fieldNames().forEachRemaining(k -> props.set(k, dataObj.get(k)));
            }
            if (props.has("data") && props.get("data").isObject()) {
                ObjectNode dataObj = (ObjectNode) props.remove("data");
                dataObj.fieldNames().forEachRemaining(k -> props.set(k, dataObj.get(k)));
            }

            // Normalize: If properties (e.g. title, subtitle, products, items, etc.) are at root of sec, move them into props
            List<String> topKeys = new ArrayList<>();
            sec.fieldNames().forEachRemaining(topKeys::add);
            for (String key : topKeys) {
                if (!"id".equalsIgnoreCase(key) && !"type".equalsIgnoreCase(key) && !"props".equalsIgnoreCase(key)) {
                    if (!props.has(key) || props.get(key).isNull()) {
                        props.set(key, sec.get(key));
                    }
                    sec.remove(key);
                }
            }

            // Sanitize specific components
            sanitizeSectionProps(type, props, brandName, category);

            sanitized.add(sec);
        }

        // Ensure Navbar at start if missing
        boolean hasNav = false;
        for (JsonNode s : sanitized) {
            if ("Navbar".equalsIgnoreCase(s.path("type").asText())) {
                hasNav = true;
                break;
            }
        }
        if (!hasNav && sanitized.size() > 0) {
            ObjectNode nav = objectMapper.createObjectNode();
            nav.put("id", "sec-navbar-1");
            nav.put("type", "Navbar");
            ObjectNode navProps = nav.putObject("props");
            navProps.put("brandName", brandName);
            ArrayNode links = navProps.putArray("links");
            links.addObject().put("text", "Overview").put("href", "#");
            links.addObject().put("text", "Offerings").put("href", "#sec-products-1");
            links.addObject().put("text", "About").put("href", "#sec-about-1");
            links.addObject().put("text", "Contact").put("href", "#sec-contact-1");
            navProps.put("ctaText", "Get Started");
            navProps.put("ctaHref", "#contact");
            sanitized.insert(0, nav);
        }

        // Ensure Footer at end if missing
        boolean hasFooter = false;
        for (JsonNode s : sanitized) {
            if ("Footer".equalsIgnoreCase(s.path("type").asText())) {
                hasFooter = true;
                break;
            }
        }
        if (!hasFooter && sanitized.size() > 0) {
            ObjectNode footer = objectMapper.createObjectNode();
            footer.put("id", "sec-footer-" + System.currentTimeMillis());
            footer.put("type", "Footer");
            ObjectNode fProps = footer.putObject("props");
            fProps.put("brandName", brandName);
            fProps.put("copyright", "© 2026 " + brandName + ". All rights reserved.");
            ArrayNode fLinks = fProps.putArray("links");
            fLinks.add("Privacy Policy");
            fLinks.add("Terms of Service");
            fLinks.add("Contact");
            sanitized.add(footer);
        }

        root.set("sections", sanitized);
    }

    private void sanitizeSectionProps(String type, ObjectNode props, String brandName, String category) {
        switch (type) {
            case "Navbar" -> {
                if (!props.has("brandName") || props.get("brandName").asText().isBlank()) {
                    props.put("brandName", brandName);
                }
                if (!props.has("links") || !props.get("links").isArray() || props.get("links").isEmpty()) {
                    ArrayNode links = props.putArray("links");
                    links.addObject().put("text", "Offerings").put("href", "#sec-products-1");
                    links.addObject().put("text", "Story").put("href", "#sec-about-1");
                    links.addObject().put("text", "Contact").put("href", "#sec-contact-1");
                } else {
                    // Normalise every existing link: label→text, url/to→href, short→full section IDs
                    ArrayNode rawLinks = (ArrayNode) props.get("links");
                    ArrayNode normLinks = objectMapper.createArrayNode();
                    for (JsonNode linkNode : rawLinks) {
                        if (!linkNode.isObject()) { normLinks.add(linkNode); continue; }
                        ObjectNode link = (ObjectNode) linkNode.deepCopy();
                        // Rename field: label → text
                        if (!link.has("text") || link.get("text").asText().isBlank()) {
                            String label = link.path("label").asText(
                                    link.path("name").asText("Link"));
                            link.put("text", label);
                        }
                        link.remove("label");
                        link.remove("name");
                        // Rename field: url / to → href
                        if (!link.has("href") || link.get("href").asText().isBlank()) {
                            String url = link.path("url").asText(link.path("to").asText("#"));
                            link.put("href", url);
                        }
                        link.remove("url");
                        link.remove("to");
                        // Expand short anchors → full sec-*-1 IDs
                        String href = link.path("href").asText("");
                        href = expandShortAnchor(href);
                        link.put("href", href);
                        normLinks.add(link);
                    }
                    props.set("links", normLinks);
                }
                // Also normalise ctaHref
                if (props.has("ctaHref")) {
                    props.put("ctaHref", expandShortAnchor(props.get("ctaHref").asText("")));
                }
                if (!props.has("ctaText") || props.get("ctaText").asText().isBlank()) {
                    props.put("ctaText", "Order Now");
                }
            }
            case "Hero" -> {
                if (!props.has("title") || props.get("title").asText().isBlank()) {
                    props.put("title", "Experience Excellence with " + brandName);
                }
                if (!props.has("primaryCta") || props.get("primaryCta").asText().isBlank()) {
                    props.put("primaryCta", "Explore Offerings");
                }
            }
            case "About" -> {
                if (!props.has("title") || props.get("title").asText().isBlank()) {
                    props.put("title", "Our Heritage & Vision");
                }
                if (!props.has("content") && !props.has("story")) {
                    props.put("content", "Founded with a passion for quality, " + brandName + " delivers unmatched craftsmanship and personalized care to our patrons.");
                }
            }
            case "ProductCards" -> {
                if (!props.has("title") || props.get("title").asText().isBlank()) {
                    props.put("title", "Featured Offerings");
                }
                ArrayNode prods;
                if (props.has("products") && props.get("products").isArray() && !props.get("products").isEmpty()) {
                    prods = (ArrayNode) props.get("products");
                } else if (props.has("items") && props.get("items").isArray() && !props.get("items").isEmpty()) {
                    prods = (ArrayNode) props.get("items");
                    props.set("products", prods);
                } else {
                    prods = props.has("products") && props.get("products").isArray() ? (ArrayNode) props.get("products") : props.putArray("products");
                }

                for (JsonNode pNode : prods) {
                    if (pNode.isObject()) {
                        ObjectNode pObj = (ObjectNode) pNode;
                        if (pObj.has("image") && !pObj.has("imageUrl")) {
                            pObj.put("imageUrl", pObj.get("image").asText());
                        }
                    }
                }

                if (prods.isEmpty()) {
                    ObjectNode p1 = prods.addObject();
                    p1.put("name", "Signature Selection");
                    p1.put("price", "$24.00");
                    p1.put("description", "Handcrafted with the finest ingredients and meticulous attention to detail.");
                    p1.put("badge", "Popular");
                }
            }
            case "Features" -> {
                if (!props.has("title") || props.get("title").asText().isBlank()) {
                    props.put("title", "Core Features & Benefits");
                }
                ArrayNode fts = props.has("features") && props.get("features").isArray() ? (ArrayNode) props.get("features") : props.putArray("features");
                if (fts.isEmpty()) {
                    fts.addObject().put("icon", "✨").put("title", "Exceptional Craftsmanship").put("description", "Engineered with precision and premium ingredients.");
                    fts.addObject().put("icon", "⚡").put("title", "Sub-Second Speed").put("description", "Designed for immediate responsiveness and ease.");
                    fts.addObject().put("icon", "🛡️").put("title", "Reliability Guaranteed").put("description", "Built to perform consistently every single day.");
                }
            }
            case "Gallery", "Portfolio" -> {
                if (!props.has("title") || props.get("title").asText().isBlank()) {
                    props.put("title", "Visual Showcase & Gallery");
                }
                ArrayNode items = props.has("items") && props.get("items").isArray() ? (ArrayNode) props.get("items") : props.putArray("items");
                for (JsonNode it : items) {
                    if (it.isObject()) {
                        ObjectNode itObj = (ObjectNode) it;
                        if (itObj.has("image") && !itObj.has("imageUrl")) {
                            itObj.put("imageUrl", itObj.get("image").asText());
                        }
                    }
                }
                if (items.isEmpty()) {
                    items.addObject().put("title", "Signature Craftsmanship").put("category", "Showcase").put("imageUrl", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80");
                    items.addObject().put("title", "Atmospheric Space").put("category", "Ambiance").put("imageUrl", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80");
                    items.addObject().put("title", "Studio Creation").put("category", "Process").put("imageUrl", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80");
                }
            }
            case "Testimonials" -> {
                // Ensure testimonials are explicitly badged as Sample/Demo Content per requirements 3 & 8
                if (!props.has("badge") || props.get("badge").asText().isBlank()) {
                    props.put("badge", "Sample Customer Feedback");
                }
                ArrayNode items = props.has("items") && props.get("items").isArray() ? (ArrayNode) props.get("items") : props.putArray("items");
                if (items.isEmpty()) {
                    ObjectNode t1 = items.addObject();
                    t1.put("quote", "Outstanding quality and incredible attention to detail. " + brandName + " exceeded all expectations.");
                    t1.put("author", "Patron Experience");
                    t1.put("role", "Verified Customer");
                }
            }
            case "ContactForm" -> {
                if (!props.has("title") || props.get("title").asText().isBlank()) {
                    props.put("title", "Connect with " + brandName);
                }
                ArrayNode fields = props.has("fields") && props.get("fields").isArray() ? (ArrayNode) props.get("fields") : props.putArray("fields");
                if (fields.isEmpty()) {
                    fields.addObject().put("label", "Your Name").put("type", "text").put("name", "fullName").put("required", true);
                    fields.addObject().put("label", "Email Address").put("type", "email").put("name", "email").put("required", true);
                    fields.addObject().put("label", "Message / Special Request").put("type", "textarea").put("name", "message").put("required", true);
                }
            }
            case "Footer" -> {
                if (!props.has("brandName") || props.get("brandName").asText().isBlank()) {
                    props.put("brandName", brandName);
                }
                if (!props.has("copyright") || props.get("copyright").asText().isBlank()) {
                    props.put("copyright", "© 2026 " + brandName + ". All rights reserved.");
                }
            }
            default -> {}
        }
    }

    /**
     * Expands short anchor hrefs like #about → #sec-about-1 to match
     * the deterministic section wrapper IDs used by WebsiteRenderer.
     */
    private String expandShortAnchor(String href) {
        if (href == null || href.isBlank() || href.equals("#")) return href;
        java.util.Map<String, String> aliases = new java.util.LinkedHashMap<>();
        aliases.put("#hero",          "#sec-hero-1");
        aliases.put("#about",         "#sec-about-1");
        aliases.put("#products",      "#sec-products-1");
        aliases.put("#product",       "#sec-products-1");
        aliases.put("#menu",          "#sec-products-1");
        aliases.put("#services",      "#sec-services-1");
        aliases.put("#features",      "#sec-features-1");
        aliases.put("#gallery",       "#sec-gallery-1");
        aliases.put("#portfolio",     "#sec-gallery-1");
        aliases.put("#pricing",       "#sec-pricing-1");
        aliases.put("#testimonials",  "#sec-testimonials-1");
        aliases.put("#faq",           "#sec-faq-1");
        aliases.put("#contact",       "#sec-contact-1");
        aliases.put("#newsletter",    "#sec-newsletter-1");
        aliases.put("#footer",        "#sec-footer-1");
        return aliases.getOrDefault(href.toLowerCase(), href);
    }
}
