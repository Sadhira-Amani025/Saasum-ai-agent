package com.saassum.ai.repository;

import com.saassum.ai.model.WebsiteConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WebsiteConfigurationRepository extends JpaRepository<WebsiteConfiguration, UUID> {
    Optional<WebsiteConfiguration> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}
