import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import EditorLayout from './components/EditorLayout';
import {
  generateWebsite,
  editWebsite,
  saveProjectConfig,
  undoLastChange,
  restoreVersion,
  getProjects,
  getProjectConfig,
  getProjectVersions,
  exportWebsiteZip,
} from './services/api';

/**
 * Defensive JSON parsing helper to prevent unhandled application crashes
 */
function safeParseJson(content, fallback = null) {
  if (!content) return fallback;
  if (typeof content === 'object') return content;
  try {
    return JSON.parse(content);
  } catch (err) {
    console.warn('[SafeParse] Invalid JSON encountered:', err.message);
    return fallback;
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught rendering error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-8 max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-rose-400">Application Error Encountered</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred. Your configuration is preserved in database storage.'}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  if (this.props.onReset) this.props.onReset();
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'editor'
  const [activeProject, setActiveProject] = useState(null);
  const [websiteConfig, setWebsiteConfig] = useState(null);
  const [version, setVersion] = useState(1);
  const [versionHistory, setVersionHistory] = useState([]);
  const [existingProjects, setExistingProjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [error, setError] = useState(null);

  // Load existing projects and restore session on page mount / refresh
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const pRes = await getProjects();
      const projectsList = pRes?.data || [];
      setExistingProjects(projectsList);

      // Check if user had an active session stored in localStorage
      const storedProjectId = localStorage.getItem('saassum_active_project_id');
      if (storedProjectId) {
        const found = projectsList.find((p) => p.id === storedProjectId);
        if (found) {
          await handleOpenProject(storedProjectId, found);
        }
      }
    } catch (e) {
      console.warn('[Init] Failed to load projects list:', e.message);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      if (res && res.data) {
        setExistingProjects(res.data);
      }
    } catch (e) {
      console.warn('[LoadProjects] Could not refresh projects list:', e.message);
    }
  };

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await generateWebsite(formData);
      if (res && res.data) {
        const project = res.data.project;
        const configJson = res.data.configuration;
        const parsedConfig = safeParseJson(configJson, {
          meta: { brandName: formData.businessName },
          theme: { primaryColor: '#6366f1', isDark: true },
          sections: [],
        });

        setActiveProject(project);
        setWebsiteConfig(parsedConfig);
        setVersion(res.data.version || 1);
        setSaveStatus('saved');

        // Persist active session in localStorage
        if (project && project.id) {
          localStorage.setItem('saassum_active_project_id', project.id);
          try {
            const vRes = await getProjectVersions(project.id);
            setVersionHistory(vRes?.data || []);
          } catch (vErr) {
            console.warn('[Versions] Failed to fetch initial version history');
          }
        }

        setView('editor');
        loadProjects();
      }
    } catch (err) {
      console.error('[Generate] Failure:', err);
      setError(err.message || 'Failed to generate website.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = async (projectId, existingProjObj = null) => {
    setLoading(true);
    setError(null);
    try {
      const proj = existingProjObj || existingProjects.find((p) => p.id === projectId);
      const cRes = await getProjectConfig(projectId);
      const vRes = await getProjectVersions(projectId);

      if (cRes && cRes.data) {
        const configJson = cRes.data.configData;
        const parsed = safeParseJson(configJson, {
          meta: { brandName: proj?.businessName || 'Project' },
          theme: { primaryColor: '#6366f1', isDark: true },
          sections: [],
        });

        setActiveProject(proj || { id: projectId, businessName: parsed.meta?.brandName || 'Project' });
        setWebsiteConfig(parsed);
        setVersion(cRes.data.version || 1);
        setVersionHistory(vRes?.data || []);
        setSaveStatus('saved');

        // Store in localStorage for seamless browser refresh
        localStorage.setItem('saassum_active_project_id', projectId);
        setView('editor');
      }
    } catch (err) {
      console.error('[OpenProject] Error:', err);
      setError('Could not open project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Direct configuration save endpoint (e.g. from Theme switch, section reorder, drag, insert)
  const handleDirectConfigUpdate = async (newConfig, changeSummary = 'Direct layout and style update') => {
    // 1. Optimistic UI update in 0ms
    setWebsiteConfig(newConfig);
    setSaveStatus('saving');

    if (activeProject && activeProject.id) {
      try {
        const currentJson = JSON.stringify(newConfig);
        const res = await saveProjectConfig(activeProject.id, currentJson, changeSummary, 'DIRECT_UPDATE');

        if (res && res.data) {
          if (res.data.version) {
            setVersion(res.data.version);
          }
          const vRes = await getProjectVersions(activeProject.id);
          if (vRes && vRes.data) {
            setVersionHistory(vRes.data);
          }
          setSaveStatus('saved');
        }
      } catch (e) {
        console.warn('[DirectSave] Error saving to database:', e.message);
        setSaveStatus('error');
      }
    }
  };

  // Conversational AI edit handler
  const handleApplyEdit = async (instruction) => {
    setIsEditing(true);
    setError(null);
    setSaveStatus('saving');

    try {
      const currentJson = JSON.stringify(websiteConfig);
      const res = await editWebsite(activeProject.id, instruction, currentJson);

      if (res && res.data) {
        const updatedJson = res.data.updatedConfigJson;
        const parsed = safeParseJson(updatedJson, websiteConfig);

        setWebsiteConfig(parsed);
        if (res.data.newVersion) {
          setVersion(res.data.newVersion);
        }

        // Refresh version history
        const vRes = await getProjectVersions(activeProject.id);
        if (vRes && vRes.data) {
          setVersionHistory(vRes.data);
        }

        setSaveStatus('saved');
        return res;
      }
    } catch (err) {
      setSaveStatus('error');
      throw err;
    } finally {
      setIsEditing(false);
    }
  };

  const handleUndo = async () => {
    if (!activeProject) return;
    setSaveStatus('saving');
    try {
      const res = await undoLastChange(activeProject.id);
      if (res && res.data) {
        const parsed = safeParseJson(res.data.configuration, websiteConfig);
        setWebsiteConfig(parsed);
        setVersion(res.data.version);

        const vRes = await getProjectVersions(activeProject.id);
        if (vRes && vRes.data) {
          setVersionHistory(vRes.data);
        }
        setSaveStatus('saved');
      }
    } catch (err) {
      setSaveStatus('error');
      alert('Undo failed: ' + err.message);
    }
  };

  const handleRestoreVersion = async (targetVersion) => {
    if (!activeProject) return;
    setSaveStatus('saving');
    try {
      const res = await restoreVersion(activeProject.id, targetVersion);
      if (res && res.data) {
        const parsed = safeParseJson(res.data.configuration, websiteConfig);
        setWebsiteConfig(parsed);
        setVersion(res.data.version);

        const vRes = await getProjectVersions(activeProject.id);
        if (vRes && vRes.data) {
          setVersionHistory(vRes.data);
        }
        setSaveStatus('saved');
      }
    } catch (err) {
      setSaveStatus('error');
      alert('Restore failed: ' + err.message);
    }
  };

  const handleExportZip = async () => {
    if (!websiteConfig) return;
    try {
      await exportWebsiteZip(JSON.stringify(websiteConfig));
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleExitToDashboard = () => {
    localStorage.removeItem('saassum_active_project_id');
    setView('dashboard');
    loadProjects();
  };

  return (
    <ErrorBoundary onReset={handleExitToDashboard}>
      {view === 'dashboard' ? (
        <Dashboard
          onGenerate={handleGenerate}
          isGenerating={loading}
          existingProjects={existingProjects}
          onOpenProject={handleOpenProject}
          error={error}
          onClearError={() => setError(null)}
        />
      ) : (
        <EditorLayout
          project={activeProject}
          config={websiteConfig}
          version={version}
          versionHistory={versionHistory}
          saveStatus={saveStatus}
          onApplyEdit={handleApplyEdit}
          onDirectUpdateConfig={handleDirectConfigUpdate}
          onUndo={handleUndo}
          onRestoreVersion={handleRestoreVersion}
          onExportZip={handleExportZip}
          onBackToDashboard={handleExitToDashboard}
          isEditing={isEditing}
          error={error}
        />
      )}
    </ErrorBoundary>
  );
}
