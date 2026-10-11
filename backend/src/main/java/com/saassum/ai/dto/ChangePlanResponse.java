package com.saassum.ai.dto;

import java.util.List;

public class ChangePlanResponse {

    private String summary;
    private List<ChangeOperation> operations;
    private String updatedConfigJson;
    private Integer newVersion;
    private String providerUsed;

    public ChangePlanResponse() {
    }

    public ChangePlanResponse(String summary, List<ChangeOperation> operations, String updatedConfigJson, Integer newVersion, String providerUsed) {
        this.summary = summary;
        this.operations = operations;
        this.updatedConfigJson = updatedConfigJson;
        this.newVersion = newVersion;
        this.providerUsed = providerUsed;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<ChangeOperation> getOperations() {
        return operations;
    }

    public void setOperations(List<ChangeOperation> operations) {
        this.operations = operations;
    }

    public String getUpdatedConfigJson() {
        return updatedConfigJson;
    }

    public void setUpdatedConfigJson(String updatedConfigJson) {
        this.updatedConfigJson = updatedConfigJson;
    }

    public Integer getNewVersion() {
        return newVersion;
    }

    public void setNewVersion(Integer newVersion) {
        this.newVersion = newVersion;
    }

    public String getProviderUsed() {
        return providerUsed;
    }

    public void setProviderUsed(String providerUsed) {
        this.providerUsed = providerUsed;
    }
}
