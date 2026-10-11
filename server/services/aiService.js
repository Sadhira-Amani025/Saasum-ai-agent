import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// aiService.js - Supports Google Gemini and OpenAI / OpenAI-compatible APIs

/**
 * Clean and extract raw HTML from LLM response
 */
export function cleanHtmlOutput(rawOutput) {
  if (!rawOutput || typeof rawOutput !== 'string') {
    return '';
  }

  let text = rawOutput.trim();

  // Strip markdown code fences if present (e.g. ```html ... ```)
  const codeBlockMatch = text.match(/```(?:html|xml)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    text = codeBlockMatch[1].trim();
  }

  // Extract from <!DOCTYPE html> or <html> to </html>
  const docTypeIndex = text.search(/<!DOCTYPE\s+html/i);
  const htmlTagIndex = text.search(/<html/i);
  
  let startIndex = -1;
  if (docTypeIndex !== -1) {
    startIndex = docTypeIndex;
  } else if (htmlTagIndex !== -1) {
    startIndex = htmlTagIndex;
  }

  if (startIndex !== -1) {
    const endTagIndex = text.search(/<\/html>/i);
    if (endTagIndex !== -1) {
      text = text.substring(startIndex, endTagIndex + 7);
    } else {
      // If closing tag was truncated by token limit, append closing tags
      text = text.substring(startIndex) + '\n</body>\n</html>';
    }
  }

  return text;
}

const SYSTEM_GENERATE_PROMPT = `You are an elite, world-class frontend web developer and UI/UX designer.
Your mission is to generate a COMPLETE, STUNNING, FULLY FUNCTIONAL, STANDALONE single-page website based on the user's prompt.

MANDATORY RULES:
1. Output MUST be ONLY the valid, complete HTML5 document starting with <!DOCTYPE html> and ending with </html>.
2. Do NOT output markdown code fences (no \`\`\`html or \`\`\`), and do NOT include any conversational text or commentary. Output raw HTML only.
3. Design Quality:
   - Modern, premium aesthetics: sleek color palette, refined typography, subtle gradients, clean shadows, and glassmorphic touches.
   - Include Tailwind CSS CDN via: <script src="https://cdn.tailwindcss.com"></script>
   - Include Font Awesome or Lucide icons: <script src="https://unpkg.com/lucide@latest"></script> (and initialize with <script>lucide.createIcons();</script>).
   - Use high-quality Unsplash image URLs (e.g., https://images.unsplash.com/photo-...) with relevant topics for real-world polish.
   - Use compelling, professional, engaging copy tailored specifically to the prompt (avoid generic repetitive Lorem Ipsum).
4. Responsiveness & Interactivity:
   - Fully responsive on desktop, tablet, and mobile.
   - Include a working mobile navigation menu toggle.
   - Include embedded JavaScript in <script> tags for smooth interactions, tab switching, testimonials slider, accordion FAQs, modals, or calculators relevant to the prompt.
5. All code must run client-side without any backend server.`;

const SYSTEM_MODIFY_PROMPT = `You are an elite frontend developer and UI/UX designer.
The user has provided an existing standalone HTML website and has requested specific changes.

MANDATORY RULES:
1. Carefully review the current HTML provided.
2. Implement the requested modifications precisely while preserving existing styles, scripts, and content that shouldn't change.
3. Output MUST be ONLY the complete, updated standalone HTML5 document starting with <!DOCTYPE html> and ending with </html>.
4. Do NOT output markdown code fences (no \`\`\`html or \`\`\`), and do NOT include any commentary.
5. Make sure the returned HTML remains fully standalone, responsive, and working.`;

/**
 * Determine which provider is active
 */
export function getProviderConfig() {
  try {
    dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });
  } catch (err) {
    // ignore
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (geminiKey && geminiKey.trim() !== '' && !geminiKey.includes('your_')) {
    return {
      provider: 'gemini',
      apiKey: geminiKey.trim(),
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    };
  }

  if (openAiKey && openAiKey.trim() !== '' && !openAiKey.includes('your_')) {
    return {
      provider: 'openai',
      apiKey: openAiKey.trim(),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    };
  }

  return {
    provider: null,
    apiKey: null,
    model: null,
  };
}

/**
 * Call Gemini API
 */
async function callGemini(apiKey, model, systemInstruction, userPrompt) {
  // Candidate models if primary fails
  const modelsToTry = [
    model,
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.6-flash',
    'gemini-flash-latest',
  ].filter((m, i, self) => Boolean(m) && self.indexOf(m) === i);

  let lastError = null;

  for (const currentModel of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `Gemini API returned status ${response.status}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('No content generated by Gemini');
      }

      return {
        text: rawText,
        model: currentModel,
      };
    } catch (err) {
      lastError = err;
      console.warn(`Failed with model ${currentModel}: ${err.message}. Trying next fallback if available...`);
    }
  }

  throw lastError || new Error('Gemini API call failed');
}

/**
 * Call OpenAI / OpenAI-compatible API
 */
async function callOpenAi(apiKey, baseUrl, model, systemPrompt, userPrompt) {
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData.error?.message || `OpenAI API returned status ${response.status}`;
    throw new Error(errMsg);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('No content returned by OpenAI');
  }

  return {
    text: rawText,
    model: data.model || model,
  };
}

/**
 * Generate website HTML from user prompt
 */
export async function generateWebsite(userPrompt) {
  const config = getProviderConfig();

  if (!config.provider) {
    throw new Error(
      'MISSING_API_KEY: Please configure GEMINI_API_KEY or OPENAI_API_KEY in the server/.env file.'
    );
  }

  let result;
  if (config.provider === 'gemini') {
    result = await callGemini(config.apiKey, config.model, SYSTEM_GENERATE_PROMPT, userPrompt);
  } else {
    result = await callOpenAi(
      config.apiKey,
      config.baseUrl,
      config.model,
      SYSTEM_GENERATE_PROMPT,
      userPrompt
    );
  }

  const cleanedHtml = cleanHtmlOutput(result.text);

  return {
    html: cleanedHtml,
    provider: config.provider,
    model: result.model,
  };
}

/**
 * Modify website HTML with user instructions
 */
export async function modifyWebsite(instructionPrompt, currentHtml) {
  const config = getProviderConfig();

  if (!config.provider) {
    throw new Error(
      'MISSING_API_KEY: Please configure GEMINI_API_KEY or OPENAI_API_KEY in the server/.env file.'
    );
  }

  const combinedUserPrompt = `CURRENT WEBSITE HTML:
\`\`\`html
${currentHtml}
\`\`\`

USER MODIFICATION REQUEST:
${instructionPrompt}

Please apply these changes and output the complete, updated HTML5 document.`;

  let result;
  if (config.provider === 'gemini') {
    result = await callGemini(config.apiKey, config.model, SYSTEM_MODIFY_PROMPT, combinedUserPrompt);
  } else {
    result = await callOpenAi(
      config.apiKey,
      config.baseUrl,
      config.model,
      SYSTEM_MODIFY_PROMPT,
      combinedUserPrompt
    );
  }

  const cleanedHtml = cleanHtmlOutput(result.text);

  return {
    html: cleanedHtml,
    provider: config.provider,
    model: result.model,
  };
}
