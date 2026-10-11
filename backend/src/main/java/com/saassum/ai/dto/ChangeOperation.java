package com.saassum.ai.dto;

import java.util.Map;

public class ChangeOperation {

    private String type;
    private String targetId;
    private String description;
    private Map<String, Object> payload;

    public ChangeOperation() {
    }

    public ChangeOperation(String type, String targetId, String description, Map<String, Object> payload) {
        this.type = type;
        this.targetId = targetId;
        this.description = description;
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }

    public void setPayload(Map<String, Object> payload) {
        this.payload = payload;
    }
}
