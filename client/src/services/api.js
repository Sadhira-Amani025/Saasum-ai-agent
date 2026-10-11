// API service client for Prompt2Web AI

const API_BASE = '/api';

/**
 * Fetch server status to check if LLM API key is configured
 */
export async function fetchServerStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    return {
      configured: false,
      error: true,
      message: error.message || 'Cannot connect to backend server. Make sure it is running on port 5000.',
    };
  }
}

/**
 * Request LLM to generate a new standalone website from prompt
 */
export async function generateWebsite(prompt) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || `Failed to generate website (status ${res.status})`);
    error.code = data.error || 'GENERATION_ERROR';
    error.status = res.status;
    throw error;
  }

  return data;
}

/**
 * Request LLM to modify an existing website
 */
export async function modifyWebsite(prompt, currentHtml) {
  const res = await fetch(`${API_BASE}/modify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, currentHtml }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || `Failed to modify website (status ${res.status})`);
    error.code = data.error || 'MODIFICATION_ERROR';
    error.status = res.status;
    throw error;
  }

  return data;
}
