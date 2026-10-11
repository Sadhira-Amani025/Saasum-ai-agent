package com.saassum.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class SaveConfigRequest {

    @NotBlank(message = "Website configuration JSON cannot be empty.")
    private String configJson;

    private String changeSummary;

    private String operationType;

    private Integer baseVersion;

    public SaveConfigRequest() {
    }

    public SaveConfigRequest(String configJson, String changeSummary, String operationType) {
        this.configJson = configJson;
        this.changeSummary = changeSummary;
        this.operationType = operationType;
    }

    public String getConfigJson() {
        return configJson;
    }

    public void setConfigJson(String configJson) {
        this.configJson = configJson;
    }

    public String getChangeSummary() {
        return changeSummary;
    }

    public void setChangeSummary(String changeSummary) {
        this.changeSummary = changeSummary;
    }

    public void setSummary(String summary) {
        if (this.changeSummary == null || this.changeSummary.isBlank()) {
            this.changeSummary = summary;
        }
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public Integer getBaseVersion() {
        return baseVersion;
    }

    public void setBaseVersion(Integer baseVersion) {
        this.baseVersion = baseVersion;
    }
}
