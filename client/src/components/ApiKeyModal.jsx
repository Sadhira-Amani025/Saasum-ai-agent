import React, { useState } from 'react';
import { X, Key, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Copy, Check } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiStatus, onRefreshStatus }) {
  const [testing, setTesting] = useState(false);
  const [copiedGemini, setCopiedGemini] = useState(false);
  const [copiedOpenAi, setCopiedOpenAi] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    await onRefreshStatus();
    setTimeout(() => setTesting(false), 600);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'gemini') {
      setCopiedGemini(true);
      setTimeout(() => setCopiedGemini(false), 2000);
    } else {
      setCopiedOpenAi(true);
      setTimeout(() => setCopiedOpenAi(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Provider Configuration</h2>
            <p className="text-xs text-slate-400">Configure LLM API keys for Prompt2Web AI MVP</p>
          </div>
        </div>

        {/* Current Status Box */}
        <div
          className={`p-3.5 rounded-xl mb-5 flex items-start gap-3 border ${
            apiStatus.configured
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}
        >
          {apiStatus.configured ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-sm">
              {apiStatus.configured
                ? `Connected to ${apiStatus.provider?.toUpperCase()} (${apiStatus.model})`
                : 'No Active API Key Detected'}
            </p>
            <p className="mt-1 text-slate-300">
              {apiStatus.configured
                ? 'Your backend server is fully connected and ready to generate websites!'
                : 'To generate live websites, provide either a Google Gemini or OpenAI API key in the server configuration.'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-violet-600 text-white inline-flex items-center justify-center text-[10px]">
                  1
                </span>
                Option A: Google Gemini API (Recommended & Free Tier)
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 hover:text-violet-300 flex items-center gap-1 hover:underline text-[11px]"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-400 mb-2">
              Add your key to <code className="text-violet-300 bg-slate-950 px-1 py-0.5 rounded">server/.env</code>:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-300 truncate">GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere</span>
              <button
                onClick={() => copyToClipboard('GEMINI_API_KEY=', 'gemini')}
                className="text-slate-400 hover:text-white p-1 rounded"
                title="Copy variable name"
              >
                {copiedGemini ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white inline-flex items-center justify-center text-[10px]">
                  2
                </span>
                Option B: OpenAI API
              </span>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline text-[11px]"
              >
                Get Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-400 mb-2">
              Alternatively, specify an OpenAI key in <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">server/.env</code>:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-300 truncate">OPENAI_API_KEY=sk-proj-YourOpenAiKeyHere</span>
              <button
                onClick={() => copyToClipboard('OPENAI_API_KEY=', 'openai')}
                className="text-slate-400 hover:text-white p-1 rounded"
                title="Copy variable name"
              >
                {copiedOpenAi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
