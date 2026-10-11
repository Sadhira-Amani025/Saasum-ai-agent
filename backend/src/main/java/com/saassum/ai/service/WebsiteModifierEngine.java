package com.saassum.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.saassum.ai.dto.ChangeOperation;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WebsiteModifierEngine {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public static final Set<String> ALLOWED_SECTIONS = Set.of(
            "Navbar", "Hero", "About", "Features", "Gallery", "Portfolio", "CTA", "CtaSection",
            "TextSection", "ImageSection", "ProductCards", "ServiceCards", "ContactForm",
            "SearchInput", "Newsletter", "Testimonials", "FAQ", "PricingCards", "Footer"
    );

    public static final Set<String> ALLOWED_OPERATIONS = Set.of(
            "UPDATE_THEME", "UPDATE_TEXT", "ADD_SECTION", "REMOVE_SECTION",
            "REORDER_SECTION", "ADD_BUTTON", "UPDATE_BUTTON", "ADD_FORM_FIELD",
            "REMOVE_COMPONENT", "UPDATE_LAYOUT", "ADD_PRODUCT", "UPDATE_COMPONENT_STYLE"
    );

    /**
     * Applies a list of ChangeOperations sequentially to an existing website JSON configuration.
     * Guarantees preservation of all unrelated content.
     */
    public String applyOperations(String currentConfigJson, List<ChangeOperation> operations) throws Exception {
        if (currentConfigJson == null || currentConfigJson.isBlank()) {
            throw new IllegalArgumentException("Current website configuration cannot be empty.");
        }

        JsonNode rootNode = objectMapper.readTree(currentConfigJson);
        if (!rootNode.isObject()) {
            throw new IllegalArgumentException("Invalid website configuration format (expected JSON object).");
        }

        ObjectNode config = (ObjectNode) rootNode;

        for (ChangeOperation op : operations) {
            if (op == null || op.getType() == null) {
                continue;
            }

            String opType = op.getType().toUpperCase().trim();
            Map<String, Object> payload = op.getPayload() != null ? op.getPayload() : Collections.emptyMap();
            String targetId = op.getTargetId();

            switch (opType) {
                case "UPDATE_THEME" -> applyUpdateTheme(config, payload);
                case "UPDATE_TEXT" -> applyUpdateText(config, targetId, payload);
                case "ADD_SECTION" -> applyAddSection(config, payload);
                case "REMOVE_SECTION" -> applyRemoveSection(config, targetId, payload);
                case "REORDER_SECTION" -> applyReorderSection(config, targetId, payload);
                case "ADD_BUTTON" -> applyAddButton(config, targetId, payload);
                case "UPDATE_BUTTON" -> applyUpdateButton(config, targetId, payload);
                case "ADD_FORM_FIELD" -> applyAddFormField(config, targetId, payload);
                case "REMOVE_COMPONENT" -> applyRemoveComponent(config, targetId, payload);
                case "UPDATE_LAYOUT" -> applyUpdateLayout(config, targetId, payload);
                case "ADD_PRODUCT" -> applyAddProduct(config, targetId, payload);
                case "UPDATE_COMPONENT_STYLE" -> applyUpdateComponentStyle(config, targetId, payload);
                default -> {
                    // Ignore unrecognized operation safely
                }
            }
        }

        return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(config);
    }

    private void applyUpdateTheme(ObjectNode config, Map<String, Object> payload) {
        ObjectNode theme = config.has("theme") && config.get("theme").isObject()
                ? (ObjectNode) config.get("theme")
                : config.putObject("theme");

        payload.forEach((key, value) -> {
            if (value instanceof String str) {
                theme.put(key, str);
            } else if (value instanceof Boolean b) {
                theme.put(key, b);
            } else if (value instanceof Number num) {
                theme.put(key, num.doubleValue());
            }
        });

        // Automatically synchronize contrast when background or dark mode changes
        if (payload.containsKey("backgroundColor")) {
            String bg = String.valueOf(payload.get("backgroundColor")).toLowerCase().trim();
            boolean isLightBg = isLightColorHex(bg);
            if (isLightBg) {
                theme.put("isDark", false);
                if (!payload.containsKey("textColor")) theme.put("textColor", "#111827");
                if (!payload.containsKey("cardBackground")) theme.put("cardBackground", "#ffffff");
            } else {
                theme.put("isDark", true);
                if (!payload.containsKey("textColor")) theme.put("textColor", "#f9fafb");
                if (!payload.containsKey("cardBackground")) theme.put("cardBackground", "#111827");
            }
        } else if (payload.containsKey("isDark")) {
            boolean dark = Boolean.parseBoolean(String.valueOf(payload.get("isDark")));
            if (!dark) {
                if (!payload.containsKey("backgroundColor")) theme.put("backgroundColor", "#ffffff");
                if (!payload.containsKey("textColor")) theme.put("textColor", "#111827");
                if (!payload.containsKey("cardBackground")) theme.put("cardBackground", "#f9fafb");
            } else {
                if (!payload.containsKey("backgroundColor")) theme.put("backgroundColor", "#0b0f19");
                if (!payload.containsKey("textColor")) theme.put("textColor", "#f9fafb");
                if (!payload.containsKey("cardBackground")) theme.put("cardBackground", "#111827");
            }
        }
    }

    private boolean isLightColorHex(String hex) {
        if (hex == null) return false;
        String clean = hex.trim().replace("#", "");
        if (clean.length() == 3) {
            clean = "" + clean.charAt(0) + clean.charAt(0)
                    + clean.charAt(1) + clean.charAt(1)
                    + clean.charAt(2) + clean.charAt(2);
        }
        if (clean.length() != 6) return false;
        try {
            int r = Integer.parseInt(clean.substring(0, 2), 16);
            int g = Integer.parseInt(clean.substring(2, 4), 16);
            int b = Integer.parseInt(clean.substring(4, 6), 16);
            double luminance = (0.299 * r + 0.587 * g + 0.114 * b);
            return luminance > 140;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isSectionMatching(String id, String type, String targetId) {
        if (targetId == null || targetId.isBlank()) return false;
        String t = targetId.toLowerCase().trim();
        String i = (id != null ? id : "").toLowerCase().trim();
        String sType = (type != null ? type : "").toLowerCase().trim();

        if (i.equals(t) || sType.equals(t)) return true;
        if (t.contains(sType) || sType.contains(t)) return true;
        if (t.contains("hero") && sType.contains("hero")) return true;
        if (t.contains("contact") && sType.contains("contact")) return true;
        if (t.contains("nav") && sType.contains("nav")) return true;
        if (t.contains("faq") && sType.contains("faq")) return true;
        if (t.contains("price") && sType.contains("price")) return true;
        if (t.contains("product") && sType.contains("product")) return true;
        if (t.contains("about") && sType.contains("about")) return true;
        if (t.contains("gallery") && sType.contains("gallery")) return true;
        if (t.contains("portfolio") && sType.contains("portfolio")) return true;
        if (t.contains("feature") && sType.contains("feature")) return true;
        if (t.contains("cta") && sType.contains("cta")) return true;
        if (t.contains("news") && sType.contains("news")) return true;
        if (t.contains("search") && sType.contains("search")) return true;
        return false;
    }

    private void applyUpdateText(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        boolean matched = false;

        for (JsonNode secNode : sections) {
            if (secNode.isObject()) {
                ObjectNode sec = (ObjectNode) secNode;
                String id = sec.path("id").asText("");
                String type = sec.path("type").asText("");

                if (isSectionMatching(id, type, targetId) || (targetId == null && "Hero".equalsIgnoreCase(type))) {
                    ObjectNode props = sec.has("props") && sec.get("props").isObject()
                            ? (ObjectNode) sec.get("props")
                            : sec.putObject("props");

                    payload.forEach((k, v) -> {
                        if (v != null) {
                            String val = String.valueOf(v);
                            props.put(k, val);
                            if ("heading".equalsIgnoreCase(k) || "headline".equalsIgnoreCase(k)) {
                                props.put("title", val);
                            } else if ("subheading".equalsIgnoreCase(k) || "sub_headline".equalsIgnoreCase(k)) {
                                props.put("subtitle", val);
                            }
                        }
                    });

                    matched = true;
                    break;
                }
            }
        }

        // If targetId was not found in sections, check root meta
        if (!matched && config.has("meta")) {
            ObjectNode meta = (ObjectNode) config.get("meta");
            payload.forEach((k, v) -> {
                if (v != null && meta.has(k)) meta.put(k, String.valueOf(v));
            });
        }
    }

    private void applyAddSection(ObjectNode config, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        String sectionType = String.valueOf(payload.getOrDefault("type", payload.getOrDefault("sectionType", "TextSection")));

        // Validate section type
        if (!ALLOWED_SECTIONS.contains(sectionType)) {
            sectionType = "TextSection";
        }

        ObjectNode newSection = objectMapper.createObjectNode();
        String generatedId = "sec-" + sectionType.toLowerCase() + "-" + System.currentTimeMillis();
        newSection.put("id", String.valueOf(payload.getOrDefault("id", generatedId)));
        newSection.put("type", sectionType);

        Object propsObj = payload.get("props");
        if (propsObj != null) {
            newSection.set("props", objectMapper.valueToTree(propsObj));
        } else {
            ObjectNode defaultProps = createDefaultPropsForSection(sectionType);
            newSection.set("props", defaultProps);
        }

        Object posObj = payload.get("position");
        int targetIdx = sections.size();
        if (posObj instanceof Number num) {
            targetIdx = Math.max(0, Math.min(num.intValue(), sections.size()));
        } else if ("top".equalsIgnoreCase(String.valueOf(posObj))) {
            targetIdx = sections.size() > 0 && "Navbar".equalsIgnoreCase(sections.get(0).path("type").asText()) ? 1 : 0;
        } else if ("bottom".equalsIgnoreCase(String.valueOf(posObj))) {
            targetIdx = sections.size() > 0 && "Footer".equalsIgnoreCase(sections.get(sections.size() - 1).path("type").asText())
                    ? sections.size() - 1
                    : sections.size();
        }

        sections.insert(targetIdx, newSection);
    }

    private void applyRemoveSection(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        String typeToRemove = payload.get("type") != null ? String.valueOf(payload.get("type")) : "";

        for (int i = sections.size() - 1; i >= 0; i--) {
            JsonNode sec = sections.get(i);
            String id = sec.path("id").asText("");
            String type = sec.path("type").asText("");

            if (isSectionMatching(id, type, targetId)
                    || (!typeToRemove.isBlank() && (type.equalsIgnoreCase(typeToRemove) || type.toLowerCase().contains(typeToRemove.toLowerCase())))) {
                sections.remove(i);
                break;
            }
        }
    }

    private void applyReorderSection(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        int fromIdx = -1;
        for (int i = 0; i < sections.size(); i++) {
            JsonNode sec = sections.get(i);
            if (isSectionMatching(sec.path("id").asText(""), sec.path("type").asText(""), targetId)) {
                fromIdx = i;
                break;
            }
        }

        if (fromIdx != -1) {
            Object newIdxObj = payload.get("newIndex");
            int toIdx = fromIdx;
            if (newIdxObj instanceof Number num) {
                toIdx = Math.max(0, Math.min(num.intValue(), sections.size() - 1));
            } else if ("up".equalsIgnoreCase(String.valueOf(newIdxObj))) {
                toIdx = Math.max(0, fromIdx - 1);
            } else if ("down".equalsIgnoreCase(String.valueOf(newIdxObj))) {
                toIdx = Math.min(sections.size() - 1, fromIdx + 1);
            }

            if (fromIdx != toIdx) {
                JsonNode item = sections.remove(fromIdx);
                sections.insert(toIdx, item);
            }
        }
    }

    private void applyAddButton(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        boolean added = false;

        for (JsonNode secNode : sections) {
            ObjectNode sec = (ObjectNode) secNode;
            String id = sec.path("id").asText("");
            String type = sec.path("type").asText("");

            if (isSectionMatching(id, type, targetId) || (targetId == null && "Hero".equalsIgnoreCase(type))) {
                ObjectNode props = sec.has("props") && sec.get("props").isObject()
                        ? (ObjectNode) sec.get("props")
                        : sec.putObject("props");

                ArrayNode extraButtons = props.has("extraButtons") && props.get("extraButtons").isArray()
                        ? (ArrayNode) props.get("extraButtons")
                        : props.putArray("extraButtons");

                ObjectNode btn = objectMapper.createObjectNode();
                btn.put("text", String.valueOf(payload.getOrDefault("text", "Click Here")));
                btn.put("href", String.valueOf(payload.getOrDefault("href", "#")));
                btn.put("variant", String.valueOf(payload.getOrDefault("variant", "primary")));
                extraButtons.add(btn);
                added = true;
                break;
            }
        }

        // If not added to Hero, fallback to the first section
        if (!added && sections.size() > 0) {
            ObjectNode sec = (ObjectNode) sections.get(0);
            ObjectNode props = (ObjectNode) sec.path("props");
            ArrayNode extraButtons = props.has("extraButtons") && props.get("extraButtons").isArray()
                    ? (ArrayNode) props.get("extraButtons")
                    : props.putArray("extraButtons");
            ObjectNode btn = objectMapper.createObjectNode();
            btn.put("text", String.valueOf(payload.getOrDefault("text", "Action")));
            btn.put("href", String.valueOf(payload.getOrDefault("href", "#")));
            btn.put("variant", String.valueOf(payload.getOrDefault("variant", "primary")));
            extraButtons.add(btn);
        }
    }

    private void applyUpdateButton(ObjectNode config, String targetId, Map<String, Object> payload) {
        applyUpdateText(config, targetId, payload);
    }

    private void applyAddFormField(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        boolean added = false;

        for (JsonNode secNode : sections) {
            ObjectNode sec = (ObjectNode) secNode;
            String type = sec.path("type").asText("");

            if (type.equalsIgnoreCase("ContactForm") || type.equalsIgnoreCase("Newsletter")) {
                ObjectNode props = (ObjectNode) sec.path("props");
                ArrayNode fields = props.has("fields") && props.get("fields").isArray()
                        ? (ArrayNode) props.get("fields")
                        : props.putArray("fields");

                ObjectNode fld = objectMapper.createObjectNode();
                fld.put("label", String.valueOf(payload.getOrDefault("label", "Field")));
                fld.put("type", String.valueOf(payload.getOrDefault("type", "text")));
                fld.put("name", String.valueOf(payload.getOrDefault("name", "customField")));
                fld.put("required", Boolean.parseBoolean(String.valueOf(payload.getOrDefault("required", false))));
                fields.add(fld);
                added = true;
                break;
            }
        }

        // If no contact form exists, create one with the field
        if (!added) {
            ObjectNode newContact = objectMapper.createObjectNode();
            newContact.put("id", "sec-contact-" + System.currentTimeMillis());
            newContact.put("type", "ContactForm");
            ObjectNode props = createDefaultPropsForSection("ContactForm");
            ArrayNode fields = (ArrayNode) props.get("fields");

            ObjectNode fld = objectMapper.createObjectNode();
            fld.put("label", String.valueOf(payload.getOrDefault("label", "Phone / Contact")));
            fld.put("type", String.valueOf(payload.getOrDefault("type", "tel")));
            fld.put("name", String.valueOf(payload.getOrDefault("name", "phone")));
            fld.put("required", Boolean.parseBoolean(String.valueOf(payload.getOrDefault("required", false))));
            fields.add(fld);
            newContact.set("props", props);

            int insertIdx = sections.size() > 0 && "Footer".equalsIgnoreCase(sections.get(sections.size() - 1).path("type").asText())
                    ? sections.size() - 1
                    : sections.size();
            sections.insert(insertIdx, newContact);
        }
    }

    private void applyRemoveComponent(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        String toRemove = String.valueOf(payload.getOrDefault("name", payload.getOrDefault("text", payload.getOrDefault("label", ""))));

        for (JsonNode secNode : sections) {
            ObjectNode sec = (ObjectNode) secNode;
            String id = sec.path("id").asText("");
            if (targetId == null || id.equalsIgnoreCase(targetId)) {
                ObjectNode props = (ObjectNode) sec.path("props");

                // Remove from extraButtons
                if (props.has("extraButtons") && props.get("extraButtons").isArray()) {
                    ArrayNode btns = (ArrayNode) props.get("extraButtons");
                    for (int i = btns.size() - 1; i >= 0; i--) {
                        if (btns.get(i).path("text").asText("").toLowerCase().contains(toRemove.toLowerCase())) {
                            btns.remove(i);
                        }
                    }
                }

                // Remove from form fields
                if (props.has("fields") && props.get("fields").isArray()) {
                    ArrayNode fields = (ArrayNode) props.get("fields");
                    for (int i = fields.size() - 1; i >= 0; i--) {
                        String fName = fields.get(i).path("name").asText("");
                        String fLabel = fields.get(i).path("label").asText("");
                        if (fName.equalsIgnoreCase(toRemove) || fLabel.toLowerCase().contains(toRemove.toLowerCase())) {
                            fields.remove(i);
                        }
                    }
                }

                // Remove from products
                if (props.has("products") && props.get("products").isArray()) {
                    ArrayNode prods = (ArrayNode) props.get("products");
                    for (int i = prods.size() - 1; i >= 0; i--) {
                        if (prods.get(i).path("name").asText("").toLowerCase().contains(toRemove.toLowerCase())) {
                            prods.remove(i);
                        }
                    }
                }
            }
        }
    }

    private void applyUpdateLayout(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        for (JsonNode secNode : sections) {
            ObjectNode sec = (ObjectNode) secNode;
            if (sec.path("id").asText("").equalsIgnoreCase(targetId)) {
                ObjectNode props = (ObjectNode) sec.path("props");
                payload.forEach((k, v) -> {
                    if (v != null) props.put("layout_" + k, String.valueOf(v));
                });
                break;
            }
        }
    }

    private void applyAddProduct(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        for (JsonNode secNode : sections) {
            ObjectNode sec = (ObjectNode) secNode;
            if (sec.path("type").asText("").equalsIgnoreCase("ProductCards")) {
                ObjectNode props = (ObjectNode) sec.path("props");
                ArrayNode products = props.has("products") && props.get("products").isArray()
                        ? (ArrayNode) props.get("products")
                        : props.putArray("products");

                ObjectNode prod = objectMapper.createObjectNode();
                prod.put("name", String.valueOf(payload.getOrDefault("name", "New Product")));
                prod.put("price", String.valueOf(payload.getOrDefault("price", "$49.00")));
                prod.put("description", String.valueOf(payload.getOrDefault("description", "Premium product description")));
                prod.put("badge", String.valueOf(payload.getOrDefault("badge", "New")));
                products.add(prod);
                break;
            }
        }
    }

    private void applyUpdateComponentStyle(ObjectNode config, String targetId, Map<String, Object> payload) {
        ArrayNode sections = getSectionsArray(config);
        for (JsonNode secNode : sections) {
            ObjectNode sec = (ObjectNode) secNode;
            if (sec.path("id").asText("").equalsIgnoreCase(targetId)) {
                ObjectNode style = sec.has("customStyle") && sec.get("customStyle").isObject()
                        ? (ObjectNode) sec.get("customStyle")
                        : sec.putObject("customStyle");

                payload.forEach((k, v) -> {
                    if (v != null) style.put(k, String.valueOf(v));
                });
                break;
            }
        }
    }

    private ArrayNode getSectionsArray(ObjectNode config) {
        if (!config.has("sections") || !config.get("sections").isArray()) {
            return config.putArray("sections");
        }
        return (ArrayNode) config.get("sections");
    }

    private ObjectNode createDefaultPropsForSection(String type) {
        ObjectNode p = objectMapper.createObjectNode();
        switch (type) {
            case "FAQ" -> {
                p.put("title", "Frequently Asked Questions");
                ArrayNode items = p.putArray("items");
                ObjectNode q1 = items.addObject();
                q1.put("question", "How fast can we launch?");
                q1.put("answer", "You can be fully live and accepting customers in under 5 minutes.");
                ObjectNode q2 = items.addObject();
                q2.put("question", "Can we customize colors and layout?");
                q2.put("answer", "Yes! Just ask the conversational AI assistant to adjust any section, color, or component.");
            }
            case "ProductCards" -> {
                p.put("title", "Featured Products");
                p.put("subtitle", "Explore our most popular offerings.");
                ArrayNode prods = p.putArray("products");
                ObjectNode p1 = prods.addObject();
                p1.put("name", "Signature Edition");
                p1.put("price", "$59.00");
                p1.put("description", "Designed for exceptional everyday performance.");
                p1.put("badge", "Popular");
            }
            case "ContactForm" -> {
                p.put("title", "Get in Touch");
                p.put("subtitle", "Have questions or need a custom plan? Send us a message.");
                ArrayNode fields = p.putArray("fields");
                fields.addObject().put("label", "Full Name").put("type", "text").put("name", "fullName").put("required", true);
                fields.addObject().put("label", "Email Address").put("type", "email").put("name", "email").put("required", true);
                fields.addObject().put("label", "Message").put("type", "textarea").put("name", "message").put("required", true);
            }
            case "SearchInput" -> {
                p.put("placeholder", "Search products, articles, or services...");
                p.put("buttonText", "Search");
            }
            case "Newsletter" -> {
                p.put("title", "Join Our Exclusive Newsletter");
                p.put("subtitle", "Get weekly updates, product drops, and exclusive discounts.");
                p.put("buttonText", "Subscribe");
            }
            case "About" -> {
                p.put("badge", "Our Heritage");
                p.put("title", "Crafted with Passion & Purpose");
                p.put("content", "Founded with a passion for quality, we deliver unmatched craftsmanship and personalized care to our patrons.");
            }
            case "Features" -> {
                p.put("badge", "Why Choose Us");
                p.put("title", "Engineered for Excellence");
                p.put("subtitle", "Every detail designed with precision and care.");
                ArrayNode fts = p.putArray("features");
                fts.addObject().put("icon", "✨").put("title", "Unmatched Quality").put("description", "Premium materials and meticulous attention to detail.");
                fts.addObject().put("icon", "⚡").put("title", "Fast & Reliable").put("description", "Rapid delivery and responsive support whenever needed.");
                fts.addObject().put("icon", "🌱").put("title", "Sustainable Sourcing").put("description", "Ethical practices and environmentally responsible sourcing.");
            }
            case "Gallery", "Portfolio" -> {
                p.put("title", "Visual Showcase & Gallery");
                p.put("subtitle", "A visual tour of our finest craftsmanship.");
                ArrayNode items = p.putArray("items");
                items.addObject().put("title", "Signature Craftsmanship").put("category", "Showcase").put("imageUrl", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80");
                items.addObject().put("title", "Atmospheric Space").put("category", "Ambiance").put("imageUrl", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80");
                items.addObject().put("title", "Studio Creation").put("category", "Process").put("imageUrl", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80");
            }
            default -> {
                p.put("title", "Section Title");
                p.put("content", "Descriptive text highlighting key value propositions and details.");
            }
        }
        return p;
    }
}
