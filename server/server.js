import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateWebsite, modifyWebsite, getProviderConfig } from './services/aiService.js';

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to root if present

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and high JSON limits for full HTML payloads
app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * Status endpoint to check whether an API key is present
 */
app.get('/api/status', (req, res) => {
  const config = getProviderConfig();
  if (!config.provider) {
    return res.json({
      configured: false,
      provider: null,
      model: null,
      message: 'No LLM API key detected. Please add GEMINI_API_KEY or OPENAI_API_KEY to server/.env',
    });
  }

  return res.json({
    configured: true,
    provider: config.provider,
    model: config.model,
    message: `Ready using ${config.provider.toUpperCase()} (${config.model})`,
  });
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * Generate website from prompt
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        error: 'INVALID_PROMPT',
        message: 'Prompt is required and cannot be empty.',
      });
    }

    const config = getProviderConfig();
    if (!config.provider) {
      return res.status(400).json({
        error: 'MISSING_API_KEY',
        message:
          'AI API key is missing. Please create a server/.env file with GEMINI_API_KEY or OPENAI_API_KEY.',
      });
    }

    console.log(`[Generate] Received prompt (${prompt.length} chars) - using ${config.provider}`);
    const result = await generateWebsite(prompt.trim());

    if (!result.html || result.html.length < 50) {
      return res.status(500).json({
        error: 'EMPTY_OUTPUT',
        message: 'The AI generated an empty or incomplete response. Please try again.',
      });
    }

    return res.json({
      success: true,
      html: result.html,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error('[Generate Error]', error.message);
    const isApiKeyError = error.message.includes('MISSING_API_KEY');
    return res.status(isApiKeyError ? 400 : 500).json({
      error: isApiKeyError ? 'MISSING_API_KEY' : 'AI_ERROR',
      message: error.message || 'Failed to generate website.',
    });
  }
});

/**
 * Modify existing website with revision prompt
 */
app.post('/api/modify', async (req, res) => {
  try {
    const { prompt, currentHtml } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        error: 'INVALID_PROMPT',
        message: 'Modification prompt is required.',
      });
    }

    if (!currentHtml || typeof currentHtml !== 'string' || !currentHtml.trim()) {
      return res.status(400).json({
        error: 'INVALID_HTML',
        message: 'Existing HTML is required to modify.',
      });
    }

    const config = getProviderConfig();
    if (!config.provider) {
      return res.status(400).json({
        error: 'MISSING_API_KEY',
        message:
          'AI API key is missing. Please create a server/.env file with GEMINI_API_KEY or OPENAI_API_KEY.',
      });
    }

    console.log(`[Modify] Processing revision prompt: "${prompt.slice(0, 60)}..."`);
    const result = await modifyWebsite(prompt.trim(), currentHtml);

    if (!result.html || result.html.length < 50) {
      return res.status(500).json({
        error: 'EMPTY_OUTPUT',
        message: 'The AI generated an empty modification. Please try again.',
      });
    }

    return res.json({
      success: true,
      html: result.html,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error('[Modify Error]', error.message);
    const isApiKeyError = error.message.includes('MISSING_API_KEY');
    return res.status(isApiKeyError ? 400 : 500).json({
      error: isApiKeyError ? 'MISSING_API_KEY' : 'AI_ERROR',
      message: error.message || 'Failed to modify website.',
    });
  }
});

app.listen(PORT, () => {
  const config = getProviderConfig();
  console.log(`===============================================`);
  console.log(` Prompt2Web AI Server running on port ${PORT}`);
  console.log(` Provider Status: ${config.provider ? `Configured (${config.provider})` : 'MISSING API KEY'}`);
  console.log(`===============================================`);
});
