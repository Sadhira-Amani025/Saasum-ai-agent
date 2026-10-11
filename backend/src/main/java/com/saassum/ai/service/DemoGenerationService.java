package com.saassum.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saassum.ai.dto.ChangeOperation;
import com.saassum.ai.dto.ChangePlanResponse;
import com.saassum.ai.dto.InitialGenerationRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DemoGenerationService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final WebsiteModifierEngine modifierEngine;
    private final WebsiteConfigValidator validator;

    public DemoGenerationService(WebsiteModifierEngine modifierEngine, WebsiteConfigValidator validator) {
        this.modifierEngine = modifierEngine;
        this.validator = validator;
    }

    public enum BusinessCategory {
        BAKERY,
        RESTAURANT,
        PORTFOLIO,
        ONLINE_STORE,
        DIGITAL_AGENCY,
        GENERAL_SAAS
    }

    public BusinessCategory detectCategory(InitialGenerationRequest req) {
        String combined = (
                (req.getCategory() != null ? req.getCategory() : "") + " " +
                (req.getBusinessName() != null ? req.getBusinessName() : "") + " " +
                (req.getDescription() != null ? req.getDescription() : "")
        ).toLowerCase();

        if (combined.contains("baker") || combined.contains("bread") || combined.contains("pastry")
                || combined.contains("croissant") || combined.contains("sourdough") || combined.contains("cake")
                || combined.contains("patisserie") || combined.contains("cookie") || combined.contains("roast")
                || combined.contains("coffee") || combined.contains("roastery") || combined.contains("cafe")) {
            return BusinessCategory.BAKERY;
        }

        if (combined.contains("restaurant") || combined.contains("bistro") || combined.contains("dining")
                || combined.contains("cuisine") || combined.contains("chef") || combined.contains("dinner")
                || combined.contains("steak") || combined.contains("bar & grill") || combined.contains("sushi")
                || combined.contains("pizza") || combined.contains("gourmet") || combined.contains("trattoria")) {
            return BusinessCategory.RESTAURANT;
        }

        if (combined.contains("portfolio") || combined.contains("architect") || combined.contains("photograph")
                || combined.contains("creative director") || combined.contains("designer") || combined.contains("personal site")
                || combined.contains("freelance") || combined.contains("artist")) {
            return BusinessCategory.PORTFOLIO;
        }

        if (combined.contains("store") || combined.contains("shop") || combined.contains("fashion")
                || combined.contains("apparel") || combined.contains("clothing") || combined.contains("retail")
                || combined.contains("boutique") || combined.contains("jewelry") || combined.contains("merch")
                || combined.contains("capsule") || combined.contains("electronic") || combined.contains("audio")
                || combined.contains("gadget") || combined.contains("gear") || combined.contains("hardware")) {
            return BusinessCategory.ONLINE_STORE;
        }

        if (combined.contains("agency") || combined.contains("studio") || combined.contains("consulting")
                || combined.contains("marketing") || combined.contains("dev shop") || combined.contains("branding")) {
            return BusinessCategory.DIGITAL_AGENCY;
        }

        return BusinessCategory.GENERAL_SAAS;
    }

    public String generateDemoInitialConfig(InitialGenerationRequest req) {
        BusinessCategory category = detectCategory(req);
        String name = req.getBusinessName() != null && !req.getBusinessName().isBlank() ? req.getBusinessName().trim() : "SaaSsum Brand";
        String description = req.getDescription() != null && !req.getDescription().isBlank() ? req.getDescription().trim() : "Delivering excellence with modern digital commerce.";

        Map<String, Object> root = new LinkedHashMap<>();

        // 1. Theme Configuration
        Map<String, Object> theme = buildThemeForCategory(category, req);
        root.put("theme", theme);

        // 2. Meta Information
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("brandName", name);
        meta.put("title", name + " | " + getTaglineForCategory(category));
        meta.put("tagline", description);
        root.put("meta", meta);

        // 3. Sections
        List<Map<String, Object>> sections = buildSectionsForCategory(category, name, description, req);

        // Respect requiredSections if specifically requested
        if (req.getRequiredSections() != null && !req.getRequiredSections().isEmpty()) {
            Set<String> reqSet = new HashSet<>(req.getRequiredSections());
            reqSet.add("Navbar");
            reqSet.add("Footer");
            sections.removeIf(s -> !reqSet.contains(String.valueOf(s.get("type"))));
        }

        root.put("sections", sections);

        try {
            String rawJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(root);
            return validator.validateAndSanitize(rawJson, name, category.name());
        } catch (Exception e) {
            return "{}";
        }
    }

    private Map<String, Object> buildThemeForCategory(BusinessCategory category, InitialGenerationRequest req) {
        Map<String, Object> theme = new LinkedHashMap<>();
        String themeName = req.getTheme() != null ? req.getTheme() : "Modern";
        boolean userCustomPrimary = req.getPrimaryColor() != null && !req.getPrimaryColor().isBlank() && !req.getPrimaryColor().equalsIgnoreCase("#6366f1");

        switch (category) {
            case BAKERY -> {
                theme.put("id", "Artisanal Warm");
                theme.put("primaryColor", userCustomPrimary ? req.getPrimaryColor() : "#d97706");
                theme.put("secondaryColor", req.getSecondaryColor() != null ? req.getSecondaryColor() : "#b45309");
                theme.put("backgroundColor", "#fdfbf7");
                theme.put("textColor", "#332211");
                theme.put("cardBackground", "#ffffff");
                theme.put("fontFamily", "'Playfair Display', Georgia, serif");
                theme.put("borderRadius", "16px");
                theme.put("isDark", false);
            }
            case RESTAURANT -> {
                theme.put("id", "Rustic Noir");
                theme.put("primaryColor", userCustomPrimary ? req.getPrimaryColor() : "#ea580c");
                theme.put("secondaryColor", req.getSecondaryColor() != null ? req.getSecondaryColor() : "#b45309");
                theme.put("backgroundColor", "#0e0d0c");
                theme.put("textColor", "#f8f5f2");
                theme.put("cardBackground", "#191614");
                theme.put("fontFamily", "'Playfair Display', Georgia, serif");
                theme.put("borderRadius", "12px");
                theme.put("isDark", true);
            }
            case PORTFOLIO -> {
                theme.put("id", "Swiss Editorial");
                theme.put("primaryColor", userCustomPrimary ? req.getPrimaryColor() : "#2563eb");
                theme.put("secondaryColor", req.getSecondaryColor() != null ? req.getSecondaryColor() : "#3b82f6");
                theme.put("backgroundColor", "#09090b");
                theme.put("textColor", "#fafafa");
                theme.put("cardBackground", "#141416");
                theme.put("fontFamily", "Inter, -apple-system, sans-serif");
                theme.put("borderRadius", "8px");
                theme.put("isDark", true);
            }
            case ONLINE_STORE -> {
                theme.put("id", "Minimal Luxury");
                theme.put("primaryColor", userCustomPrimary ? req.getPrimaryColor() : "#18181b");
                theme.put("secondaryColor", req.getSecondaryColor() != null ? req.getSecondaryColor() : "#4f46e5");
                theme.put("backgroundColor", "#fafafa");
                theme.put("textColor", "#18181b");
                theme.put("cardBackground", "#ffffff");
                theme.put("fontFamily", "Inter, sans-serif");
                theme.put("borderRadius", "8px");
                theme.put("isDark", false);
            }
            case DIGITAL_AGENCY -> {
                theme.put("id", "Cyber Violet");
                theme.put("primaryColor", userCustomPrimary ? req.getPrimaryColor() : "#6366f1");
                theme.put("secondaryColor", req.getSecondaryColor() != null ? req.getSecondaryColor() : "#06b6d4");
                theme.put("backgroundColor", "#090d16");
                theme.put("textColor", "#f8fafc");
                theme.put("cardBackground", "#111726");
                theme.put("fontFamily", "Inter, sans-serif");
                theme.put("borderRadius", "14px");
                theme.put("isDark", true);
            }
            default -> {
                boolean isDark = "Modern".equalsIgnoreCase(themeName);
                theme.put("id", themeName);
                theme.put("primaryColor", req.getPrimaryColor() != null ? req.getPrimaryColor() : "#6366f1");
                theme.put("secondaryColor", req.getSecondaryColor() != null ? req.getSecondaryColor() : "#a855f7");
                theme.put("backgroundColor", isDark ? "#0b0f19" : "#ffffff");
                theme.put("textColor", isDark ? "#f9fafb" : "#111827");
                theme.put("cardBackground", isDark ? "#111827" : "#f9fafb");
                theme.put("fontFamily", "Inter, sans-serif");
                theme.put("borderRadius", "12px");
                theme.put("isDark", isDark);
            }
        }
        return theme;
    }

    private String getTaglineForCategory(BusinessCategory category) {
        return switch (category) {
            case BAKERY -> "Artisanal Sourdough & Handcrafted Pastries";
            case RESTAURANT -> "Wood-Fired Seasonality & Intimate Dining";
            case PORTFOLIO -> "Digital Architecture & Interactive Experiences";
            case ONLINE_STORE -> "Conscious Everyday Luxury & Essentials";
            case DIGITAL_AGENCY -> "High-Performance Engineering & Digital Products";
            case GENERAL_SAAS -> "Autonomous Digital Commerce Platform";
        };
    }

    private List<Map<String, Object>> buildSectionsForCategory(
            BusinessCategory category, String name, String desc, InitialGenerationRequest req) {
        return switch (category) {
            case BAKERY -> buildBakerySections(name, desc, req);
            case RESTAURANT -> buildRestaurantSections(name, desc, req);
            case PORTFOLIO -> buildPortfolioSections(name, desc, req);
            case ONLINE_STORE -> buildOnlineStoreSections(name, desc, req);
            case DIGITAL_AGENCY -> buildAgencySections(name, desc, req);
            case GENERAL_SAAS -> buildSaasSections(name, desc, req);
        };
    }

    // ==========================================
    // 1. BAKERY & CAFE PRESET GENERATOR
    // ==========================================
    private List<Map<String, Object>> buildBakerySections(String name, String desc, InitialGenerationRequest req) {
        List<Map<String, Object>> list = new ArrayList<>();

        // Navbar
        list.add(createSection("sec-navbar-1", "Navbar", Map.of(
                "brandName", name,
                "links", List.of(
                        Map.of("text", "Daily Bakes", "href", "#sec-products-1"),
                        Map.of("text", "Our Story", "href", "#sec-about-1"),
                        Map.of("text", "Gallery", "href", "#sec-gallery-1"),
                        Map.of("text", "Order Ahead", "href", "#sec-contact-1")
                ),
                "ctaText", "Order for Pickup",
                "ctaHref", "#sec-contact-1"
        )));

        // Hero
        list.add(createSection("sec-hero-1", "Hero", Map.of(
                "badge", "🌾 Stone-Milled • 36-Hour Wild Fermentation",
                "title", "Fresh Artisanal Breads & Viennoiserie Baked at Dawn",
                "subtitle", desc,
                "primaryCta", "View Today's Bakes",
                "primaryCtaHref", "#sec-products-1",
                "secondaryCta", "Our Baking Process",
                "secondaryCtaHref", "#sec-about-1",
                "imageUrl", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
        )));

        // About Section
        list.add(createSection("sec-about-1", "About", Map.of(
                "badge", "Heritage Craftsmanship",
                "title", "The Art of Natural Slow Fermentation",
                "content", "Every loaf at " + name + " begins with single-origin heritage grains stone-milled cold to preserve vitality and natural oils. We leaven exclusively with our mature wild sourdough starter—never commercial yeast or artificial conditioners.",
                "highlights", List.of(
                        Map.of("label", "Fermentation Time", "value", "36 Hours"),
                        Map.of("label", "Organic Grains", "value", "100%"),
                        Map.of("label", "Oven Hearth", "value", "Baked at 5:00 AM")
                ),
                "imageUrl", "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80"
        )));

        // Product Cards (Menu)
        list.add(createSection("sec-products-1", "ProductCards", Map.of(
                "title", "Today's Oven Highlights",
                "subtitle", "Baked fresh every morning in limited quantities. Available until sold out.",
                "products", List.of(
                        Map.of("name", "Heritage Country Sourdough Loaf", "price", "$8.50", "description", "Dark blistered caramelized crust with an airy, pillowy custard crumb. Wild fermented 36 hours.", "badge", "Signature Loaf", "imageUrl", "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80"),
                        Map.of("name", "Double-Baked Almond Croissant", "price", "$5.75", "description", "Hand-laminated Normandy butter pastry filled with rich almond frangipane and toasted sliced almonds.", "badge", "Bestseller", "imageUrl", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"),
                        Map.of("name", "Cardamom Cinnamon Morning Bun", "price", "$4.95", "description", "Flaky laminated dough rolled with fresh stoneground green cardamom, Ceylon cinnamon, and pearl sugar.", "badge", "Favorite", "imageUrl", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80")
                )
        )));

        // Features & Benefits
        list.add(createSection("sec-features-1", "Features", Map.of(
                "badge", "Our Principles",
                "title", "Pure Ingredients, Zero Compromise",
                "subtitle", "Every ingredient is tracked directly back to sustainable family farms.",
                "features", List.of(
                        Map.of("icon", "🌾", "title", "100% Organic Flours", "description", "Stoneground cold on granite millstones to preserve rich nutty aroma and vital micronutrients."),
                        Map.of("icon", "⏳", "title", "Naturally Leavened", "description", "Fermented slowly with wild ambient cultures for gentle digestion and deep lactic complexity."),
                        Map.of("icon", "🧈", "title", "84% Cultured Butter", "description", "Slow-churned European cultured butter for paper-thin, shatteringly crisp laminations.")
                )
        )));

        // Gallery
        list.add(createSection("sec-gallery-1", "Gallery", Map.of(
                "title", "From Hearth to Counter",
                "subtitle", "A glimpse into our dawn baking shifts and warm bakery atmosphere.",
                "items", List.of(
                        Map.of("title", "Scoring Batards at Dawn", "category", "Artisan Bread", "imageUrl", "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Golden Honey Croissants", "category", "Viennoiserie", "imageUrl", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "The Stone Hearth Oven", "category", "Our Bakery", "imageUrl", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80")
                )
        )));

        // Testimonials (Sample labeled)
        list.add(createSection("sec-testimonials-1", "Testimonials", Map.of(
                "badge", "Sample Customer Feedback",
                "title", "Neighborhood Reflections",
                "subtitle", "What bread enthusiasts say about our morning bakes.",
                "items", List.of(
                        Map.of("quote", "The heritage country loaf has completely redefined bread for our family. Crackling crust and exquisite flavor.", "author", "Elena Vance", "role", "Local Resident"),
                        Map.of("quote", "The best laminated croissants outside of Paris. You can smell the butter from down the street every morning.", "author", "Marcus Thorne", "role", "Regular Patron")
                )
        )));

        // Contact & Hours
        String contactDetails = req.getContactDetails() != null && !req.getContactDetails().isBlank()
                ? req.getContactDetails()
                : "Bakery Hours: Tue–Sun 6:30 AM – 2:00 PM (or until sold out). Address: 142 Baker Street.";
        list.add(createSection("sec-contact-1", "ContactForm", Map.of(
                "title", "Pre-Orders & Custom Pastry Boxes",
                "subtitle", contactDetails,
                "fields", List.of(
                        Map.of("label", "Your Name", "type", "text", "name", "fullName", "required", true),
                        Map.of("label", "Contact Email", "type", "email", "name", "email", "required", true),
                        Map.of("label", "Pickup Date & Requested Items", "type", "textarea", "name", "message", "required", true)
                )
        )));

        // Footer
        list.add(createSection("sec-footer-1", "Footer", Map.of(
                "brandName", name,
                "copyright", "© 2026 " + name + ". Baked with love and wild sourdough.",
                "links", List.of("Allergen Info", "Wholesale Inquiries", "Daily Menu", "Directions")
        )));

        return list;
    }

    // ==========================================
    // 2. RESTAURANT & BISTRO PRESET GENERATOR
    // ==========================================
    private List<Map<String, Object>> buildRestaurantSections(String name, String desc, InitialGenerationRequest req) {
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createSection("sec-navbar-1", "Navbar", Map.of(
                "brandName", name,
                "links", List.of(
                        Map.of("text", "Seasonal Menu", "href", "#sec-products-1"),
                        Map.of("text", "The Hearth", "href", "#sec-about-1"),
                        Map.of("text", "Wine & Cellar", "href", "#sec-features-1"),
                        Map.of("text", "Reservations", "href", "#sec-contact-1")
                ),
                "ctaText", "Reserve a Table",
                "ctaHref", "#sec-contact-1"
        )));

        list.add(createSection("sec-hero-1", "Hero", Map.of(
                "badge", "🍷 Autumn Hearth Tasting Menu Now Live",
                "title", "Wood-Fired Seasonality & Regenerative Dining",
                "subtitle", desc,
                "primaryCta", "Reserve a Table",
                "primaryCtaHref", "#sec-contact-1",
                "secondaryCta", "Explore Menu",
                "secondaryCtaHref", "#sec-products-1",
                "imageUrl", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
        )));

        list.add(createSection("sec-about-1", "About", Map.of(
                "badge", "Our Philosophy",
                "title", "Rooted in Soil, Salt and White Oak Embers",
                "content", "At " + name + ", our dining room revolves around a 12-foot custom open hearth. We cook exclusively without fossil gas, harnessing glowing oak coals, heirloom cast iron, and vegetables harvested within 40 miles of our kitchen that very morning.",
                "highlights", List.of(
                        Map.of("label", "Farm Radius", "value", "< 40 Miles"),
                        Map.of("label", "Natural Wines", "value", "160+ Biodynamic Labels"),
                        Map.of("label", "Hearth Fire", "value", "100% White Oak")
                ),
                "imageUrl", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
        )));

        list.add(createSection("sec-products-1", "ProductCards", Map.of(
                "title", "Signature Courses & Seasonal Plates",
                "subtitle", "Crafted daily according to morning harvest arrivals from our partner regenerative farms.",
                "products", List.of(
                        Map.of("name", "Wood-Roasted Heritage Pork Chop", "price", "$38.00", "description", "Glazed in wild plum reduction with scorched baby turnips and chanterelle mushroom emulsion.", "badge", "Chef's Plate", "imageUrl", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"),
                        Map.of("name", "Hand-Cut Tagliolini & Black Truffle", "price", "$34.00", "description", "House-cultured butter, 36-month aged Parmigiano-Reggiano, and freshly shaved autumn truffles.", "badge", "Signature", "imageUrl", "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80"),
                        Map.of("name", "Plancha Dayboat Scallops", "price", "$36.00", "description", "Sunchoke silk, brown butter caper vinaigrette, and foraged sea purslane.", "badge", "Fresh Catch", "imageUrl", "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80")
                )
        )));

        list.add(createSection("sec-features-1", "Features", Map.of(
                "badge", "The Experience",
                "title", "Carefully Curated Dining Elements",
                "subtitle", "Every touchpoint is designed for presence and connection.",
                "features", List.of(
                        Map.of("icon", "🍷", "title", "Low-Intervention Cellar", "description", "Natural, organic, and biodynamic bottlings from independent small-lot vignerons."),
                        Map.of("icon", "🥩", "title", "Whole-Animal Butchery", "description", "Pasture-raised heritage livestock butchered and cured in-house for complete respect."),
                        Map.of("icon", "🕯️", "title", "Candlelit Atmosphere", "description", "A warm, intimate setting curated with acoustic clarity and relaxed hospitality.")
                )
        )));

        list.add(createSection("sec-gallery-1", "Gallery", Map.of(
                "title", "The Dining Room & Kitchen",
                "subtitle", "Candlelight, culinary precision, and the hum of hospitality.",
                "items", List.of(
                        Map.of("title", "The Dining Room", "category", "Ambiance", "imageUrl", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Wood-Fired Hearth", "category", "Kitchen", "imageUrl", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Natural Wine Selection", "category", "Cellar", "imageUrl", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80")
                )
        )));

        list.add(createSection("sec-testimonials-1", "Testimonials", Map.of(
                "badge", "Sample Diner Feedback",
                "title", "Guest Impressions",
                "subtitle", "Memories shared around our tables.",
                "items", List.of(
                        Map.of("quote", "An unforgettable evening. The wood-roasted heritage pork chop with the sommelier's pairing was extraordinary.", "author", "Julian Montgomery", "role", "Dinner Guest"),
                        Map.of("quote", "Unpretentious, deeply flavorful, and soulful hospitality. One of the best meals we have had this year.", "author", "Sarah Jenkins", "role", "Food Journalist")
                )
        )));

        String contactSub = req.getContactDetails() != null && !req.getContactDetails().isBlank()
                ? req.getContactDetails()
                : "Dinner: Wed–Sun 5:00 PM – 10:30 PM. Weekend Brunch: 10:00 AM – 2:30 PM. Location: 74 Kingfisher Row.";
        list.add(createSection("sec-contact-1", "ContactForm", Map.of(
                "title", "Table Reservations & Private Gatherings",
                "subtitle", contactSub,
                "fields", List.of(
                        Map.of("label", "Guest Name", "type", "text", "name", "fullName", "required", true),
                        Map.of("label", "Email Address", "type", "email", "name", "email", "required", true),
                        Map.of("label", "Party Size, Preferred Date & Dietary Notes", "type", "textarea", "name", "message", "required", true)
                )
        )));

        list.add(createSection("sec-footer-1", "Footer", Map.of(
                "brandName", name,
                "copyright", "© 2026 " + name + ". Hospitality with heart.",
                "links", List.of("Tasting Menus", "Private Dining", "Gift Cards", "Press Kit")
        )));

        return list;
    }

    // ==========================================
    // 3. PORTFOLIO & CREATIVE STUDIO GENERATOR
    // ==========================================
    private List<Map<String, Object>> buildPortfolioSections(String name, String desc, InitialGenerationRequest req) {
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createSection("sec-navbar-1", "Navbar", Map.of(
                "brandName", name,
                "links", List.of(
                        Map.of("text", "Selected Works", "href", "#sec-gallery-1"),
                        Map.of("text", "Capabilities", "href", "#sec-services-1"),
                        Map.of("text", "About", "href", "#sec-about-1"),
                        Map.of("text", "Contact", "href", "#sec-contact-1")
                ),
                "ctaText", "Let's Collaborate",
                "ctaHref", "#sec-contact-1"
        )));

        list.add(createSection("sec-hero-1", "Hero", Map.of(
                "badge", "⚡ Available for Select Q3/Q4 Projects",
                "title", "Senior Creative Technologist & Brand Architect",
                "subtitle", desc,
                "primaryCta", "View Selected Works",
                "primaryCtaHref", "#sec-gallery-1",
                "secondaryCta", "Core Capabilities",
                "secondaryCtaHref", "#sec-services-1",
                "imageUrl", "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
        )));

        list.add(createSection("sec-about-1", "About", Map.of(
                "badge", "Ethos & Approach",
                "title", "Design Systems Built for Speed and Longevity",
                "content", "With over 9 years working between brand identity, interactive user interfaces, and full-stack engineering, I collaborate with founders to turn complex technological systems into clean, human experiences that convert.",
                "highlights", List.of(
                        Map.of("label", "Years Experience", "value", "9+"),
                        Map.of("label", "Design Systems Built", "value", "40+"),
                        Map.of("label", "Recognition", "value", "Awwwards, Type01")
                ),
                "imageUrl", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
        )));

        list.add(createSection("sec-gallery-1", "Gallery", Map.of(
                "title", "Selected Client Case Studies",
                "subtitle", "Interactive web applications, brand architectures, and spatial design systems.",
                "items", List.of(
                        Map.of("title", "Aether Finance — Brand Identity & UI", "category", "Fintech / Web App", "imageUrl", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Kinetic Spatial — Spatial UI Architecture", "category", "Hardware / Spatial", "imageUrl", "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Studio Nord — E-Commerce Experience", "category", "Retail / Design System", "imageUrl", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80")
                )
        )));

        list.add(createSection("sec-services-1", "ServiceCards", Map.of(
                "title", "Capabilities & Advisory",
                "subtitle", "From early product validation to comprehensive enterprise design systems.",
                "services", List.of(
                        Map.of("icon", "📐", "title", "Brand Identity Systems", "description", "Typography scales, logos, responsive iconography, and digital guidelines built for rapid product expansion."),
                        Map.of("icon", "💻", "title", "High-Conversion Web UI", "description", "Modern frontends built on React, Next.js, and CSS architectures with sub-second page performance."),
                        Map.of("icon", "⚡", "title", "Interactive Prototyping", "description", "High-fidelity clickable interactive prototypes for user testing and investor presentations.")
                )
        )));

        list.add(createSection("sec-testimonials-1", "Testimonials", Map.of(
                "badge", "Sample Client Endorsement",
                "title", "Collaborator Feedback",
                "subtitle", "Reflections from visionary founders.",
                "items", List.of(
                        Map.of("quote", "Working with " + name + " transformed our brand. Our user conversion doubled within two weeks of deploying the new design system.", "author", "Marcus Vance", "role", "CEO, Flowstate Labs"),
                        Map.of("quote", "Rare ability to bridge high-aesthetic creative direction with pristine technical execution.", "author", "Elena Rostova", "role", "Partner, Archway Ventures")
                )
        )));

        list.add(createSection("sec-contact-1", "ContactForm", Map.of(
                "title", "Inquire for Project Availability",
                "subtitle", "Currently accepting inquiries for new client projects and architectural design advisory.",
                "fields", List.of(
                        Map.of("label", "Your Name", "type", "text", "name", "fullName", "required", true),
                        Map.of("label", "Work Email", "type", "email", "name", "email", "required", true),
                        Map.of("label", "Project Overview & Desired Timeline", "type", "textarea", "name", "message", "required", true)
                )
        )));

        list.add(createSection("sec-footer-1", "Footer", Map.of(
                "brandName", name,
                "copyright", "© 2026 " + name + ". All rights reserved.",
                "links", List.of("GitHub", "Dribbble", "LinkedIn", "Resume")
        )));

        return list;
    }

    // ==========================================
    // 4. ONLINE STORE & RETAIL PRESET GENERATOR
    // ==========================================
    private List<Map<String, Object>> buildOnlineStoreSections(String name, String desc, InitialGenerationRequest req) {
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createSection("sec-navbar-1", "Navbar", Map.of(
                "brandName", name,
                "links", List.of(
                        Map.of("text", "Capsule Drop", "href", "#sec-products-1"),
                        Map.of("text", "Materials", "href", "#sec-about-1"),
                        Map.of("text", "Lookbook", "href", "#sec-gallery-1"),
                        Map.of("text", "Contact", "href", "#sec-contact-1")
                ),
                "ctaText", "Bag (0)",
                "ctaHref", "#sec-products-1"
        )));

        list.add(createSection("sec-hero-1", "Hero", Map.of(
                "badge", "✨ Autumn Minimalist Capsule • Limited Release",
                "title", "Elevated Essentials Crafted for Everyday Longevity",
                "subtitle", desc,
                "primaryCta", "Shop the Capsule",
                "primaryCtaHref", "#sec-products-1",
                "secondaryCta", "View Lookbook",
                "secondaryCtaHref", "#sec-gallery-1",
                "imageUrl", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
        )));

        list.add(createSection("sec-products-1", "ProductCards", Map.of(
                "title", "Curated Wardrobe Pieces",
                "subtitle", "Small-batch ethical production. Carbon-neutral worldwide fulfillment.",
                "products", List.of(
                        Map.of("name", "Structured Wool Overshirt", "price", "$148.00", "description", "Recycled deadstock Italian wool with horn buttons and dropped shoulder cut.", "badge", "Bestseller", "imageUrl", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"),
                        Map.of("name", "Everyday Relaxed Linen Trouser", "price", "$115.00", "description", "Heavy-gauge Belgian flax linen with tailored drawcord waistband.", "badge", "Essential", "imageUrl", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80"),
                        Map.of("name", "Full-Grain Minimal Leather Tote", "price", "$185.00", "description", "Vegetable-tanned full-grain leather unlined with solid cast brass hardware.", "badge", "New Drop", "imageUrl", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80")
                )
        )));

        list.add(createSection("sec-about-1", "About", Map.of(
                "badge", "Conscious Production",
                "title", "Zero Waste Architectural Silhouettes",
                "content", "We design garments to outlive seasonal trend cycles. Every roll of fabric is salvaged from deadstock mill overruns or certified regenerative organic agriculture. Finished with hand-stitched reinforcements.",
                "highlights", List.of(
                        Map.of("label", "Virgin Plastics", "value", "0%"),
                        Map.of("label", "Repair Pledge", "value", "Free Lifetime Stitch Repair"),
                        Map.of("label", "Packaging", "value", "100% Home Compostable")
                ),
                "imageUrl", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80"
        )));

        list.add(createSection("sec-features-1", "Features", Map.of(
                "badge", "Our Guarantees",
                "title", "Crafted with Uncompromising Ethics",
                "subtitle", "Every piece carries our lifelong quality commitment.",
                "features", List.of(
                        Map.of("icon", "🌿", "title", "Zero Virgin Synthetics", "description", "Biodegradable fibers, organic dyes, and natural corozo nut buttons."),
                        Map.of("icon", "✂️", "title", "Free Lifetime Repairs", "description", "Send back any garment for free seam or button repairs whenever needed."),
                        Map.of("icon", "📦", "title", "Carbon-Neutral Shipping", "description", "Zero plastic packaging and verified carbon offsets on every ground shipment.")
                )
        )));

        list.add(createSection("sec-gallery-1", "Gallery", Map.of(
                "title", "Editorial Lookbook",
                "subtitle", "Shot on 35mm film in Berlin and Kyoto.",
                "items", List.of(
                        Map.of("title", "Look 01 — Heavyweight Overshirt", "category", "Outerwear", "imageUrl", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Look 02 — Studio Linen Ensemble", "category", "Separates", "imageUrl", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Look 03 — Minimal Carry Goods", "category", "Leather Goods", "imageUrl", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80")
                )
        )));

        list.add(createSection("sec-newsletter-1", "Newsletter", Map.of(
                "title", "Join the Private Studio Circle",
                "subtitle", "Subscribers receive 48-hour early access to small-batch drops and 15% off first order.",
                "buttonText", "Join the Circle"
        )));

        list.add(createSection("sec-contact-1", "ContactForm", Map.of(
                "title", "Concierge & Fit Advisory",
                "subtitle", "Have questions regarding garment measurements, material swatches, or international customs?",
                "fields", List.of(
                        Map.of("label", "Your Name", "type", "text", "name", "fullName", "required", true),
                        Map.of("label", "Email Address", "type", "email", "name", "email", "required", true),
                        Map.of("label", "Order Number (Optional)", "type", "text", "name", "orderId", "required", false),
                        Map.of("label", "Inquiry / Sizing Question", "type", "textarea", "name", "message", "required", true)
                )
        )));

        list.add(createSection("sec-footer-1", "Footer", Map.of(
                "brandName", name,
                "copyright", "© 2026 " + name + ". Ethical fashion crafted to endure.",
                "links", List.of("Shipping & Returns", "Sizing Guide", "Garment Care", "Terms of Sale")
        )));

        return list;
    }

    // ==========================================
    // 5. DIGITAL AGENCY & TECH STUDIO GENERATOR
    // ==========================================
    private List<Map<String, Object>> buildAgencySections(String name, String desc, InitialGenerationRequest req) {
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createSection("sec-navbar-1", "Navbar", Map.of(
                "brandName", name,
                "links", List.of(
                        Map.of("text", "Capabilities", "href", "#sec-services-1"),
                        Map.of("text", "Work", "href", "#sec-gallery-1"),
                        Map.of("text", "Sprint Pricing", "href", "#sec-pricing-1"),
                        Map.of("text", "Contact", "href", "#sec-contact-1")
                ),
                "ctaText", "Book Discovery Call",
                "ctaHref", "#sec-contact-1"
        )));

        list.add(createSection("sec-hero-1", "Hero", Map.of(
                "badge", "🚀 2-Week Production Sprint Guarantee",
                "title", "We Engineer High-Impact Digital Products & AI Architectures",
                "subtitle", desc,
                "primaryCta", "Explore Sprint Packages",
                "primaryCtaHref", "#sec-pricing-1",
                "secondaryCta", "View Case Studies",
                "secondaryCtaHref", "#sec-gallery-1",
                "imageUrl", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
        )));

        list.add(createSection("sec-services-1", "ServiceCards", Map.of(
                "title", "End-to-End Product Engineering",
                "subtitle", "From architectural design to autonomous AI agent deployments.",
                "services", List.of(
                        Map.of("icon", "⚡", "title", "Custom Full-Stack Web", "description", "React, Spring Boot, and cloud-native serverless systems engineered for sub-second responses."),
                        Map.of("icon", "🤖", "title", "AI Agents & Automation", "description", "Custom LLM integrations, tool-calling agents, and real-time knowledge retrieval pipelines."),
                        Map.of("icon", "📈", "title", "Conversion & Funnel Engineering", "description", "Data-driven checkout optimization and friction-free payment architectures.")
                )
        )));

        list.add(createSection("sec-gallery-1", "Gallery", Map.of(
                "title", "Featured Client Deployments",
                "subtitle", "Production systems delivering measurable commercial velocity.",
                "items", List.of(
                        Map.of("title", "OmniScale Cloud Dashboard", "category", "Enterprise SaaS", "imageUrl", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Apex Autonomous Agent Pipeline", "category", "AI Engineering", "imageUrl", "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"),
                        Map.of("title", "Lumina Direct-to-Consumer Platform", "category", "E-Commerce", "imageUrl", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80")
                )
        )));

        list.add(createSection("sec-pricing-1", "PricingCards", Map.of(
                "title", "Fixed-Scope Sprint Models",
                "subtitle", "No billing hourly ambiguities. Pure production deliverables.",
                "plans", List.of(
                        Map.of("name", "MVP Sprint", "price", "$4,800", "period", "/sprint", "description", "2-week rapid development sprint delivering production-ready MVP.", "popular", false, "ctaText", "Book Sprint", "features", List.of("Complete web application MVP", "Daily async video demos", "100% IP code ownership", "30 days post-launch warranty")),
                        Map.of("name", "Growth Squad", "price", "$9,500", "period", "/month", "description", "Dedicated engineering squad for scaling ventures.", "popular", true, "ctaText", "Deploy Squad", "features", List.of("Lead Architect + 2 Engineers", "Continuous CI/CD releases", "Custom AI agent pipelines", "24/7 incident response SLA")),
                        Map.of("name", "Architecture Advisory", "price", "$3,500", "period", "/engagement", "description", "Fractional CTO review and security audits.", "popular", false, "ctaText", "Consult Advisory", "features", List.of("Full codebase audit", "Infrastructure cost reduction", "SOC2 compliance guidance", "Executive roadmap"))
                )
        )));

        list.add(createSection("sec-testimonials-1", "Testimonials", Map.of(
                "badge", "Sample Client Endorsement",
                "title", "Client Endorsements",
                "subtitle", "What engineering leaders say about partnering with our studio.",
                "items", List.of(
                        Map.of("quote", "They delivered our customer portal in 3 weeks flat. The codebase was cleanly architected and effortless to extend.", "author", "Jordan Blake", "role", "CTO, CloudPulse"),
                        Map.of("quote", "The most disciplined and capable engineering agency we have partnered with in 8 years of venture building.", "author", "Samantha Reed", "role", "Partner, Horizon Capital")
                )
        )));

        list.add(createSection("sec-contact-1", "ContactForm", Map.of(
                "title", "Schedule an Architecture Review",
                "subtitle", "Tell us about your technical roadmap and delivery timeline.",
                "fields", List.of(
                        Map.of("label", "Full Name", "type", "text", "name", "fullName", "required", true),
                        Map.of("label", "Work Email", "type", "email", "name", "email", "required", true),
                        Map.of("label", "Current Tech Stack & Delivery Goals", "type", "textarea", "name", "message", "required", true)
                )
        )));

        list.add(createSection("sec-footer-1", "Footer", Map.of(
                "brandName", name,
                "copyright", "© 2026 " + name + ". Engineered for scale.",
                "links", List.of("Case Studies", "Security Audit", "Open Roles", "Privacy")
        )));

        return list;
    }

    // ==========================================
    // 6. GENERAL SAAS & TECH PLATFORM GENERATOR
    // ==========================================
    private List<Map<String, Object>> buildSaasSections(String name, String desc, InitialGenerationRequest req) {
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createSection("sec-navbar-1", "Navbar", Map.of(
                "brandName", name,
                "links", List.of(
                        Map.of("text", "Features", "href", "#sec-features-1"),
                        Map.of("text", "Solutions", "href", "#sec-services-1"),
                        Map.of("text", "Pricing", "href", "#sec-pricing-1"),
                        Map.of("text", "FAQ", "href", "#sec-faq-1")
                ),
                "ctaText", "Start Free Trial",
                "ctaHref", "#sec-pricing-1"
        )));

        list.add(createSection("sec-hero-1", "Hero", Map.of(
                "badge", "⚡ Launch Edition • Next-Gen Architecture",
                "title", "Empower Your Digital Business With " + name,
                "subtitle", desc,
                "primaryCta", "Start Free Trial",
                "primaryCtaHref", "#sec-pricing-1",
                "secondaryCta", "Explore Platform",
                "secondaryCtaHref", "#sec-features-1"
        )));

        list.add(createSection("sec-features-1", "Features", Map.of(
                "badge", "Core Innovations",
                "title", "Engineered for Autonomous Velocity",
                "subtitle", "Everything required to automate commerce, streamline customer operations, and scale effortlessly.",
                "features", List.of(
                        Map.of("icon", "⚡", "title", "Sub-Second Latency", "description", "Distributed edge execution delivers blistering fast response times."),
                        Map.of("icon", "🛡️", "title", "Enterprise Isolation", "description", "Bank-grade data encryption, automated backups, and 99.99% uptime guarantees."),
                        Map.of("icon", "📈", "title", "Conversion Intelligence", "description", "Real-time behavioral telemetry and autonomous recommendations to maximize checkout conversion.")
                )
        )));

        list.add(createSection("sec-products-1", "ProductCards", Map.of(
                "title", "Featured Products & Add-Ons",
                "subtitle", "Expand your digital capabilities with plug-and-play modules.",
                "products", List.of(
                        Map.of("name", "Starter Commerce Core", "price", "$49.00", "description", "Essential store builder with integrated payment checkout.", "badge", "Popular"),
                        Map.of("name", "AI Agent Suite Pro", "price", "$129.00", "description", "Autonomous tier-1 support agents with real-time knowledge retrieval.", "badge", "Best Value"),
                        Map.of("name", "Enterprise Analytics Gateway", "price", "$249.00", "description", "Custom revenue forecasting, BI integrations, and dedicated VPC sync.", "badge", "Scale")
                )
        )));

        list.add(createSection("sec-pricing-1", "PricingCards", Map.of(
                "title", "Transparent Subscription Tiers",
                "subtitle", "No hidden fees. Scale up or pause anytime with zero contract lock-in.",
                "plans", List.of(
                        Map.of("name", "Starter", "price", "$29", "period", "/month", "description", "Core essentials for small teams.", "popular", false, "ctaText", "Choose Starter", "features", List.of("Up to 1,000 visitors", "Core features included", "Community support")),
                        Map.of("name", "Professional", "price", "$79", "period", "/month", "description", "Everything scaling businesses demand.", "popular", true, "ctaText", "Get Pro", "features", List.of("Unlimited active visitors", "Advanced analytics", "24/7 Priority support", "Custom domain sync")),
                        Map.of("name", "Scale", "price", "$199", "period", "/month", "description", "Dedicated enterprise infrastructure.", "popular", false, "ctaText", "Contact Sales", "features", List.of("Custom SLAs", "Dedicated account manager", "Custom integrations", "Unlimited seats"))
                )
        )));

        list.add(createSection("sec-testimonials-1", "Testimonials", Map.of(
                "badge", "Sample Customer Review",
                "title", "Trusted by Forward-Thinking Brands",
                "subtitle", "What teams experience when migrating to " + name + ".",
                "items", List.of(
                        Map.of("quote", "Switching to " + name + " increased our digital conversions by 140% in week one.", "author", "Sarah Jenkins", "role", "VP of Growth, Horizon Labs"),
                        Map.of("quote", "The most seamless customer experience we have ever deployed. It paid for itself within days.", "author", "Marcus Vance", "role", "Founder, Apex Retail")
                )
        )));

        list.add(createSection("sec-faq-1", "FAQ", Map.of(
                "title", "Frequently Asked Questions",
                "items", List.of(
                        Map.of("question", "How fast can we launch?", "answer", "You can be live and accepting customer orders in under 10 minutes."),
                        Map.of("question", "Can I modify the layout using conversational instructions?", "answer", "Yes! Use the AI Assistant on the left to request any color, layout, or section change anytime."),
                        Map.of("question", "Can I export and host the website anywhere?", "answer", "Yes, download the complete ZIP archive containing independent HTML, CSS, and JS ready for Netlify, Vercel, or GitHub Pages.")
                )
        )));

        list.add(createSection("sec-contact-1", "ContactForm", Map.of(
                "title", "Ready to Elevate Your Digital Commerce?",
                "subtitle", req.getContactDetails() != null && !req.getContactDetails().isBlank() ? req.getContactDetails() : "Leave us your details and our team will get in touch within 24 hours.",
                "fields", List.of(
                        Map.of("label", "Your Full Name", "type", "text", "name", "fullName", "required", true),
                        Map.of("label", "Business Email", "type", "email", "name", "email", "required", true),
                        Map.of("label", "Project Details / Message", "type", "textarea", "name", "message", "required", true)
                )
        )));

        list.add(createSection("sec-footer-1", "Footer", Map.of(
                "brandName", name,
                "copyright", "© 2026 " + name + ". All rights reserved.",
                "links", List.of("Privacy Policy", "Terms of Service", "Security", "Documentation")
        )));

        return list;
    }

    private Map<String, Object> createSection(String id, String type, Map<String, Object> props) {
        Map<String, Object> sec = new LinkedHashMap<>();
        sec.put("id", id);
        sec.put("type", type);
        sec.put("props", props);
        return sec;
    }

    public ChangePlanResponse generateDemoEditPlan(String instruction, String currentConfigJson) {
        String lower = instruction.toLowerCase().trim();
        List<ChangeOperation> ops = new ArrayList<>();
        String summary = "Applied changes for: " + instruction;

        if (lower.contains("purple") && lower.contains("gold")) {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Update palette to Dark Purple & Gold",
                    Map.of("primaryColor", "#d4af37", "secondaryColor", "#a855f7", "backgroundColor", "#1a0b2e", "textColor", "#fbf7ee", "cardBackground", "#281446", "borderRadius", "16px", "fontFamily", "'Cinzel', serif", "isDark", true)));
            summary = "Updated theme colors to vibrant Royal Purple (#1a0b2e) and Gold accents (#d4af37).";
        } else if (lower.contains("black") && lower.contains("gold")) {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Update palette to Black & Gold",
                    Map.of("primaryColor", "#d4af37", "secondaryColor", "#f59e0b", "backgroundColor", "#0a0a0c", "textColor", "#f5f5f7", "cardBackground", "#141418", "borderRadius", "12px", "fontFamily", "'Playfair Display', serif", "isDark", true)));
            summary = "Switched theme to luxury Onyx Black with warm Gold highlights.";
        } else if (lower.contains("modern")) {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Switch to Modern Dark Slate & Indigo",
                    Map.of("primaryColor", "#6366f1", "secondaryColor", "#8b5cf6", "backgroundColor", "#0f172a", "textColor", "#f8fafc", "cardBackground", "#1e293b", "fontFamily", "'Inter', sans-serif", "borderRadius", "12px", "isDark", true)));
            summary = "Switched theme to Modern Dark Slate with Indigo accents.";
        } else if (lower.contains("elegant")) {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Switch to Elegant Warm Cream & Serif",
                    Map.of("primaryColor", "#b45309", "secondaryColor", "#d97706", "backgroundColor", "#fdfbf7", "textColor", "#1c1917", "cardBackground", "#ffffff", "fontFamily", "'Playfair Display', Georgia, serif", "borderRadius", "16px", "isDark", false)));
            summary = "Switched theme to Elegant with warm cream background and serif typography.";
        } else if (lower.contains("minimal")) {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Switch to Clean Minimal Swiss Light",
                    Map.of("primaryColor", "#18181b", "secondaryColor", "#71717a", "backgroundColor", "#ffffff", "textColor", "#18181b", "cardBackground", "#f4f4f5", "fontFamily", "'Inter', sans-serif", "borderRadius", "6px", "isDark", false)));
            summary = "Switched theme to Clean Swiss Minimal light aesthetic.";
        } else if (lower.contains("dark") || lower.contains("night")) {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Switch to Dark Mode",
                    Map.of("backgroundColor", "#0b0f19", "textColor", "#f9fafb", "cardBackground", "#111827", "isDark", true)));
            summary = "Enabled sleek dark mode across all components.";
        } else if (lower.contains("light")) {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Switch to Light Mode",
                    Map.of("backgroundColor", "#ffffff", "textColor", "#111827", "cardBackground", "#f9fafb", "isDark", false)));
            summary = "Enabled crisp light mode across all components.";
        } else if (lower.contains("move") || lower.contains("reorder")) {
            if (lower.contains("testimonial")) {
                ops.add(new ChangeOperation("REORDER_SECTION", "sec-testimonials-1", "Move Testimonials Section Above", Map.of("newIndex", "up")));
                summary = "Moved the testimonials section higher in section order.";
            } else if (lower.contains("price") || lower.contains("pricing")) {
                ops.add(new ChangeOperation("REORDER_SECTION", "sec-pricingcards-1", "Move Pricing Section Down", Map.of("newIndex", "down")));
                summary = "Reordered pricing section in the page hierarchy.";
            } else {
                ops.add(new ChangeOperation("REORDER_SECTION", null, "Reorder Section Position", Map.of("newIndex", "up")));
                summary = "Reordered page sections to match desired hierarchy.";
            }
        } else if (lower.contains("remove") || lower.contains("delete")) {
            if (lower.contains("pricing") || lower.contains("price")) {
                ops.add(new ChangeOperation("REMOVE_SECTION", null, "Remove Pricing Section", Map.of("type", "PricingCards")));
                summary = "Removed the pricing section from the website.";
            } else if (lower.contains("newsletter")) {
                ops.add(new ChangeOperation("REMOVE_SECTION", null, "Remove Newsletter Section", Map.of("type", "Newsletter")));
                summary = "Removed the newsletter subscription section.";
            } else if (lower.contains("testimonial")) {
                ops.add(new ChangeOperation("REMOVE_SECTION", null, "Remove Testimonials Section", Map.of("type", "Testimonials")));
                summary = "Removed the testimonials section from the website.";
            } else if (lower.contains("faq")) {
                ops.add(new ChangeOperation("REMOVE_SECTION", null, "Remove FAQ Section", Map.of("type", "FAQ")));
                summary = "Removed the FAQ section from the website.";
            } else {
                ops.add(new ChangeOperation("REMOVE_SECTION", null, "Remove Specified Section", Map.of("type", "TextSection")));
                summary = "Removed the specified section.";
            }
        } else if (lower.contains("address") || lower.contains("location")) {
            ops.add(new ChangeOperation("ADD_FORM_FIELD", "sec-contact-1", "Add Address Field to Contact Form",
                    Map.of("label", "Physical / Delivery Address", "type", "text", "name", "address", "required", false)));
            summary = "Added physical address field to the contact form.";
        } else if (lower.contains("password")) {
            ops.add(new ChangeOperation("ADD_FORM_FIELD", "sec-contact-1", "Add Password Field to Contact Form",
                    Map.of("label", "Account Password", "type", "password", "name", "password", "required", false)));
            summary = "Added secure password field to the contact form.";
        } else if (lower.contains("phone") || lower.contains("tel")) {
            ops.add(new ChangeOperation("ADD_FORM_FIELD", "sec-contact-1", "Add Phone Field to Contact Form",
                    Map.of("label", "Direct Phone / WhatsApp", "type", "tel", "name", "phone", "required", false)));
            summary = "Added phone number input field to the contact form.";
        } else if (lower.contains("gallery") || lower.contains("portfolio")) {
            ops.add(new ChangeOperation("ADD_SECTION", null, "Add Visual Gallery Section",
                    Map.of("type", "Gallery", "position", 3, "props",
                            Map.of("title", "Curated Showcase & Gallery", "subtitle", "A visual tour of our finest craftsmanship.", "items", List.of(
                                    Map.of("title", "Showcase Feature 01", "category", "Collection", "imageUrl", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"),
                                    Map.of("title", "Showcase Feature 02", "category", "Process", "imageUrl", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"),
                                    Map.of("title", "Showcase Feature 03", "category", "Atmosphere", "imageUrl", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80")
                            )))));
            summary = "Added interactive visual showcase gallery.";
        } else if (lower.contains("about") || lower.contains("story")) {
            ops.add(new ChangeOperation("ADD_SECTION", null, "Add About Story Section",
                    Map.of("type", "About", "position", 2, "props",
                            Map.of("badge", "Our Heritage", "title", "Crafted with Passion & Purpose", "content", "Every offering reflects our unyielding commitment to quality, sustainability, and authentic hospitality."))));
            summary = "Added an About & Heritage section.";
        } else if (lower.contains("search")) {
            ops.add(new ChangeOperation("ADD_SECTION", null, "Add Product Search Input",
                    Map.of("type", "SearchInput", "position", 2, "props",
                            Map.of("placeholder", "Search catalog, dishes, or offerings...", "buttonText", "Search"))));
            summary = "Inserted an interactive search bar below the Hero section.";
        } else if (lower.contains("newsletter")) {
            ops.add(new ChangeOperation("ADD_SECTION", null, "Add Newsletter Section",
                    Map.of("type", "Newsletter", "position", "bottom", "props",
                            Map.of("title", "Subscribe to VIP Updates", "subtitle", "Be the first to know about seasonal drops and events.", "buttonText", "Join Now"))));
            summary = "Added an email newsletter capture section.";
        } else if (lower.contains("button") && (lower.contains("whatsapp") || lower.contains("contact"))) {
            ops.add(new ChangeOperation("ADD_BUTTON", "sec-hero-1", "Add WhatsApp Action Button",
                    Map.of("text", "Chat on WhatsApp 💬", "href", "https://wa.me/", "variant", "whatsapp")));
            summary = "Added WhatsApp direct action button to the Hero section.";
        } else if (lower.contains("button") && (lower.contains("buy") || lower.contains("cart") || lower.contains("order"))) {
            ops.add(new ChangeOperation("ADD_BUTTON", "sec-hero-1", "Add Buy Now Action Button",
                    Map.of("text", "Order Now 🛒", "href", "#sec-products-1", "variant", "primary")));
            summary = "Added Buy Now action button to the Hero section.";
        } else if (lower.contains("faq")) {
            ops.add(new ChangeOperation("ADD_SECTION", null, "Add FAQ Section", Map.of("type", "FAQ")));
            summary = "Added interactive FAQ accordion section.";
        } else if (lower.contains("round") || lower.contains("radius")) {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Increase Card Corner Radius", Map.of("borderRadius", "24px")));
            summary = "Made all cards and buttons smoothly rounded (24px radius).";
        } else if (lower.contains("hero") && (lower.contains("heading") || lower.contains("title"))) {
            ops.add(new ChangeOperation("UPDATE_TEXT", "sec-hero-1", "Update Hero Heading",
                    Map.of("title", "Revolutionize Your Commerce With Instant AI")));
            summary = "Updated hero heading to high-impact revised headline.";
        } else {
            ops.add(new ChangeOperation("UPDATE_THEME", null, "Apply Style Refinement",
                    Map.of("primaryColor", "#6366f1", "isDark", true)));
            summary = "Applied styling and configuration updates matching your prompt.";
        }

        try {
            String updatedJson = modifierEngine.applyOperations(currentConfigJson, ops);
            String sanitized = validator.validateAndSanitize(updatedJson, "SaaSsum Brand", "GENERAL");
            return new ChangePlanResponse(summary, ops, sanitized, null, "Demo Mode (Deterministic Engine)");
        } catch (Exception e) {
            return new ChangePlanResponse(summary, ops, currentConfigJson, null, "Demo Mode");
        }
    }
}
