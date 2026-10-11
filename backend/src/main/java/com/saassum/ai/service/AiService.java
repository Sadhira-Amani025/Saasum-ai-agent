package com.saassum.ai.service;

import com.saassum.ai.dto.ChangePlanResponse;
import com.saassum.ai.dto.InitialGenerationRequest;

public interface AiService {

    String generateInitialWebsite(InitialGenerationRequest request) throws Exception;

    ChangePlanResponse generateEditPlan(String instruction, String currentConfigJson) throws Exception;

    boolean isConfigured();

    String getActiveProviderName();
}
