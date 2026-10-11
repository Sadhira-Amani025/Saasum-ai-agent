package com.saassum.ai.service;

import com.saassum.ai.dto.ChangePlanResponse;
import com.saassum.ai.dto.InitialGenerationRequest;
import com.saassum.ai.dto.SaveConfigRequest;
import com.saassum.ai.model.Project;
import com.saassum.ai.model.WebsiteConfiguration;
import com.saassum.ai.model.WebsiteVersion;
import com.saassum.ai.repository.ProjectRepository;
import com.saassum.ai.repository.WebsiteConfigurationRepository;
import com.saassum.ai.repository.WebsiteVersionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final WebsiteConfigurationRepository configRepository;
    private final WebsiteVersionRepository versionRepository;
    private final GeminiAiService geminiService;
    private final WebsiteConfigValidator validator;

    public ProjectService(ProjectRepository projectRepository,
                          WebsiteConfigurationRepository configRepository,
                          WebsiteVersionRepository versionRepository,
                          GeminiAiService geminiService,
                          WebsiteConfigValidator validator) {
        this.projectRepository = projectRepository;
        this.configRepository = configRepository;
        this.versionRepository = versionRepository;
        this.geminiService = geminiService;
        this.validator = validator;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Project> getProjectById(UUID id) {
        return projectRepository.findById(id);
    }

    public Optional<WebsiteConfiguration> getConfiguration(UUID projectId) {
        return configRepository.findByProjectId(projectId);
    }

    public List<WebsiteVersion> getVersionHistory(UUID projectId) {
        return versionRepository.findByProjectIdOrderByVersionNumberDesc(projectId);
    }

    @Transactional
    public Project createProjectWithWebsite(InitialGenerationRequest request) throws Exception {
        // 1. Create project
        Project project = new Project(
                request.getProjectName(),
                request.getProjectDescription(),
                request.getBusinessName(),
                request.getCategory()
        );
        project = projectRepository.save(project);

        // 2. Generate initial website configuration JSON
        String configJson = geminiService.generateInitialWebsite(request);

        // 3. Save website configuration
        WebsiteConfiguration config = new WebsiteConfiguration(project.getId(), 1, configJson);
        configRepository.save(config);

        // 4. Save Version 1 snapshot
        WebsiteVersion v1 = new WebsiteVersion(
                project.getId(),
                1,
                "Initial generation for " + request.getBusinessName(),
                "INITIAL_GENERATION",
                configJson
        );
        versionRepository.save(v1);

        return project;
    }

    @Transactional
    public ChangePlanResponse applyEditInstruction(UUID projectId, String instruction, String currentConfigOverride) throws Exception {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        WebsiteConfiguration activeConfig = configRepository.findByProjectId(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Configuration not found for project: " + projectId));

        String baseJson = (currentConfigOverride != null && !currentConfigOverride.isBlank())
                ? currentConfigOverride
                : activeConfig.getConfigData();

        // 1. Generate plan & apply operations
        ChangePlanResponse plan = geminiService.generateEditPlan(instruction, baseJson);

        int maxVersion = versionRepository.findByProjectIdOrderByVersionNumberDesc(projectId)
                .stream().mapToInt(WebsiteVersion::getVersionNumber).max().orElse(activeConfig.getVersion());
        int newVersionNumber = maxVersion + 1;
        plan.setNewVersion(newVersionNumber);

        // 2. Update active configuration
        activeConfig.setVersion(newVersionNumber);
        activeConfig.setConfigData(plan.getUpdatedConfigJson());
        configRepository.save(activeConfig);

        // 3. Record version snapshot
        String primaryOpType = plan.getOperations() != null && !plan.getOperations().isEmpty()
                ? plan.getOperations().get(0).getType()
                : "NATURAL_LANGUAGE_EDIT";

        WebsiteVersion version = new WebsiteVersion(
                projectId,
                newVersionNumber,
                plan.getSummary(),
                primaryOpType,
                plan.getUpdatedConfigJson()
        );
        versionRepository.save(version);

        return plan;
    }

    @Transactional
    public WebsiteConfiguration saveDirectConfiguration(UUID projectId, SaveConfigRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        WebsiteConfiguration activeConfig = configRepository.findByProjectId(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Active configuration not found for project: " + projectId));

        if (request.getConfigJson() == null || request.getConfigJson().isBlank()) {
            throw new IllegalArgumentException("Configuration payload cannot be blank.");
        }

        // Validate and sanitize config
        String sanitizedJson = validator.validateAndSanitize(
                request.getConfigJson(),
                project.getBusinessName(),
                project.getCategory()
        );

        // Monotonic version calculation
        int maxVersion = versionRepository.findByProjectIdOrderByVersionNumberDesc(projectId)
                .stream().mapToInt(WebsiteVersion::getVersionNumber).max().orElse(activeConfig.getVersion());
        int newVersionNumber = maxVersion + 1;

        activeConfig.setVersion(newVersionNumber);
        activeConfig.setConfigData(sanitizedJson);
        WebsiteConfiguration saved = configRepository.save(activeConfig);

        String summary = request.getChangeSummary() != null && !request.getChangeSummary().isBlank()
                ? request.getChangeSummary()
                : "Direct configuration update";
        String opType = request.getOperationType() != null && !request.getOperationType().isBlank()
                ? request.getOperationType()
                : "DIRECT_UPDATE";

        WebsiteVersion version = new WebsiteVersion(
                projectId,
                newVersionNumber,
                summary,
                opType,
                sanitizedJson
        );
        versionRepository.save(version);

        return saved;
    }

    @Transactional
    public Optional<WebsiteConfiguration> undoLastChange(UUID projectId) {
        List<WebsiteVersion> history = versionRepository.findByProjectIdOrderByVersionNumberDesc(projectId);
        if (history.size() <= 1) {
            return configRepository.findByProjectId(projectId);
        }

        WebsiteVersion prevSnapshot = history.get(1); // Penultimate version
        return restoreVersion(projectId, prevSnapshot.getVersionNumber());
    }

    @Transactional
    public Optional<WebsiteConfiguration> restoreVersion(UUID projectId, int versionNumber) {
        WebsiteConfiguration active = configRepository.findByProjectId(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Active configuration not found for project: " + projectId));

        WebsiteVersion target = versionRepository.findByProjectIdAndVersionNumber(projectId, versionNumber)
                .orElseThrow(() -> new IllegalArgumentException("Snapshot for version " + versionNumber + " does not exist."));

        // Strictly monotonic version calculation
        int maxVersion = versionRepository.findByProjectIdOrderByVersionNumberDesc(projectId)
                .stream().mapToInt(WebsiteVersion::getVersionNumber).max().orElse(active.getVersion());
        int newVersionNumber = maxVersion + 1;

        active.setVersion(newVersionNumber);
        active.setConfigData(target.getConfigSnapshot());
        WebsiteConfiguration saved = configRepository.save(active);

        // Record the restore as a new immutable version snapshot
        WebsiteVersion restoreRecord = new WebsiteVersion(
                projectId,
                newVersionNumber,
                "Restored configuration from Version " + versionNumber + " (" + target.getChangeSummary() + ")",
                "RESTORE_VERSION",
                target.getConfigSnapshot()
        );
        versionRepository.save(restoreRecord);

        return Optional.of(saved);
    }

    @Transactional
    public void deleteProject(UUID projectId) {
        configRepository.deleteByProjectId(projectId);
        versionRepository.deleteByProjectId(projectId);
        projectRepository.deleteById(projectId);
    }
}
