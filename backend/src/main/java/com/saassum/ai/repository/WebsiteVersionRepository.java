package com.saassum.ai.repository;

import com.saassum.ai.model.WebsiteVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WebsiteVersionRepository extends JpaRepository<WebsiteVersion, UUID> {
    List<WebsiteVersion> findByProjectIdOrderByVersionNumberDesc(UUID projectId);
    Optional<WebsiteVersion> findByProjectIdAndVersionNumber(UUID projectId, Integer versionNumber);
    void deleteByProjectId(UUID projectId);
}
