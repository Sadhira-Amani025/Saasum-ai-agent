-- ==============================================================================
-- SaaSsum AI Commerce - Database Schema for Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. Website Configurations Table (Stores the active structured JSON configuration)
CREATE TABLE IF NOT EXISTS website_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    config_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT uq_project_config UNIQUE (project_id)
);

-- 3. Website Versions Table (Stores immutable snapshots for undo/redo and restore)
CREATE TABLE IF NOT EXISTS website_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    change_summary VARCHAR(500) NOT NULL,
    operation_type VARCHAR(100) NOT NULL DEFAULT 'INITIAL_GENERATION',
    config_snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_config_project ON website_configurations(project_id);
CREATE INDEX IF NOT EXISTS idx_website_versions_project ON website_versions(project_id, version_number DESC);

-- Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_config_updated_at ON website_configurations;
CREATE TRIGGER trg_config_updated_at
    BEFORE UPDATE ON website_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- Designed to support public access for hackathon demo, and extensible for Supabase Auth
-- ==============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_versions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous / service role full read/write for demo mode
CREATE POLICY "Public read/write access for projects" ON projects
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read/write access for configs" ON website_configurations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read/write access for versions" ON website_versions
    FOR ALL USING (true) WITH CHECK (true);
