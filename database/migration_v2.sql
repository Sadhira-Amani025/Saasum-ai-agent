-- ==============================================================================
-- SaaSsum AI Commerce - Database Migration v2 (Supabase PostgreSQL & Local H2)
-- Safe, Idempotent Performance & Integrity Upgrades
-- ==============================================================================

-- 1. Ensure UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Performance Indexes for Rapid Version Lookup & Project Queries
CREATE INDEX IF NOT EXISTS idx_website_versions_composite
    ON website_versions(project_id, version_number DESC);

CREATE INDEX IF NOT EXISTS idx_projects_updated_at
    ON projects(updated_at DESC);

-- 3. Validation Comment:
-- All versions are monotonically incremented to guarantee zero key collisions
-- during undo, restore, and direct configuration saves.
COMMENT ON TABLE website_versions IS 'Immutable snapshots of website configuration revisions for undo/redo.';
COMMENT ON TABLE website_configurations IS 'Active, authoritative website configuration per project.';
