package com.saassum.ai.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class InitialGenerationRequest {

    private String projectName;
    private String projectDescription;

    @NotBlank(message = "Business name is required")
    private String businessName;

    private String category = "General";

    private String description;

    private String theme = "Modern";
    private String primaryColor = "#6366f1";
    private String secondaryColor = "#a855f7";

    private List<String> requiredSections;
    private String productDetails;
    private String contactDetails;

    private boolean demoMode = false;

    public InitialGenerationRequest() {
    }

    public String getProjectName() {
        return projectName != null && !projectName.isBlank() ? projectName : businessName + " Website";
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        if (description != null && !description.isBlank()) return description;
        if (projectDescription != null && !projectDescription.isBlank()) return projectDescription;
        return "Complete business website for " + (businessName != null ? businessName : "Brand");
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }

    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public String getSecondaryColor() {
        return secondaryColor;
    }

    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public List<String> getRequiredSections() {
        return requiredSections;
    }

    public void setRequiredSections(List<String> requiredSections) {
        this.requiredSections = requiredSections;
    }

    public void setIndustry(String industry) {
        if (industry != null && !industry.isBlank()) {
            this.category = industry;
        }
    }

    public void setThemePreference(String themePreference) {
        if (themePreference != null && !themePreference.isBlank()) {
            this.theme = themePreference;
        }
    }

    public void setFeatureRequests(List<String> featureRequests) {
        if (featureRequests != null && !featureRequests.isEmpty()) {
            List<String> normalized = featureRequests.stream().map(f -> {
                if ("product_cards".equalsIgnoreCase(f) || "products".equalsIgnoreCase(f)) return "ProductCards";
                if ("service_cards".equalsIgnoreCase(f) || "services".equalsIgnoreCase(f)) return "ServiceCards";
                if ("newsletter".equalsIgnoreCase(f)) return "Newsletter";
                if ("contact_form".equalsIgnoreCase(f) || "contact".equalsIgnoreCase(f)) return "ContactForm";
                if ("gallery".equalsIgnoreCase(f) || "portfolio".equalsIgnoreCase(f)) return "Gallery";
                return f;
            }).toList();
            if (this.requiredSections == null) {
                this.requiredSections = new java.util.ArrayList<>(normalized);
            } else {
                this.requiredSections.addAll(normalized);
            }
        }
    }

    public String getProductDetails() {
        return productDetails;
    }

    public void setProductDetails(String productDetails) {
        this.productDetails = productDetails;
    }

    public String getContactDetails() {
        return contactDetails;
    }

    public void setContactDetails(String contactDetails) {
        this.contactDetails = contactDetails;
    }

    public boolean isDemoMode() {
        return demoMode;
    }

    public void setDemoMode(boolean demoMode) {
        this.demoMode = demoMode;
    }
}
