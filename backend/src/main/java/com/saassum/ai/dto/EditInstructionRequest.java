package com.saassum.ai.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class EditInstructionRequest {

    private UUID projectId;

    @NotBlank(message = "Instruction prompt cannot be empty")
    private String instruction;

    private String currentConfigJson;
    private boolean demoMode = false;

    public EditInstructionRequest() {
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public String getCurrentConfigJson() {
        return currentConfigJson;
    }

    public void setCurrentConfigJson(String currentConfigJson) {
        this.currentConfigJson = currentConfigJson;
    }

    public boolean isDemoMode() {
        return demoMode;
    }

    public void setDemoMode(boolean demoMode) {
        this.demoMode = demoMode;
    }
}
