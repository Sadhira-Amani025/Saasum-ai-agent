// SaaSsum AI Commerce - Frontend Resilient API Service Client
const API_BASE = '/api';

/**
 * Resilient fetch wrapper with timeout, safe JSON parsing, and retry capability.
 */
async function apiRequest(endpoint, options = {}, { timeoutMs = 30000, retries = 0 } = {}) {
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const config = {
    ...options,
    signal: options.signal || controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, config);
    clearTimeout(id);

    // Read response text first for safe parsing
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      data = { success: false, message: text || `HTTP ${res.status}: Unexpected response format.` };
    }

    if (!res.ok || (data && data.success === false)) {
      const errorMsg = data?.message || `Server responded with HTTP ${res.status} (${res.statusText || 'Error'})`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    clearTimeout(id);

    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds. The backend or AI provider took too long to respond.`);
    }

    // Exponential backoff retry for GET requests or transient network dropouts
    if (retries > 0 && (!options.method || options.method === 'GET')) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return apiRequest(endpoint, options, { timeoutMs, retries: retries - 1 });
    }

    throw err;
  }
}

export async function getStatus() {
  return apiRequest('/status', {}, { timeoutMs: 8000, retries: 1 });
}

export async function getHealth() {
  return apiRequest('/health', {}, { timeoutMs: 8000, retries: 1 });
}

export async function generateWebsite(requestData, { signal } = {}) {
  return apiRequest('/ai/generate', {
    method: 'POST',
    body: JSON.stringify(requestData),
    signal,
  }, { timeoutMs: 65000 }); // Generous timeout for deep AI synthesis
}

export async function editWebsite(projectId, instruction, currentConfigJson, { signal } = {}) {
  return apiRequest('/ai/edit', {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      instruction,
      currentConfigJson,
    }),
    signal,
  }, { timeoutMs: 40000 });
}

export async function saveProjectConfig(projectId, configJson, changeSummary = 'Direct update', operationType = 'DIRECT_UPDATE') {
  return apiRequest(`/projects/${projectId}/config`, {
    method: 'PUT',
    body: JSON.stringify({
      configJson,
      changeSummary,
      operationType,
    }),
  }, { timeoutMs: 20000 });
}

export async function undoLastChange(projectId) {
  return apiRequest(`/ai/undo/${projectId}`, {
    method: 'POST',
  }, { timeoutMs: 15000 });
}

export async function restoreVersion(projectId, versionNumber) {
  return apiRequest(`/ai/restore/${projectId}/${versionNumber}`, {
    method: 'POST',
  }, { timeoutMs: 15000 });
}

export async function getProjects() {
  return apiRequest('/projects', {}, { timeoutMs: 10000, retries: 1 });
}

export async function getProject(projectId) {
  return apiRequest(`/projects/${projectId}`, {}, { timeoutMs: 10000, retries: 1 });
}

export async function getProjectConfig(projectId) {
  return apiRequest(`/projects/${projectId}/config`, {}, { timeoutMs: 12000, retries: 1 });
}

export async function getProjectVersions(projectId) {
  return apiRequest(`/projects/${projectId}/versions`, {}, { timeoutMs: 10000, retries: 1 });
}

export async function exportWebsiteZip(configJson) {
  const url = `${API_BASE}/export/zip`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ configJson }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'ZIP Export failed');
  }

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'saassum-website.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
