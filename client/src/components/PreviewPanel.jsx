import React, { useState } from 'react';
import {
  RotateCcw,
  ExternalLink,
  Download,
  FileCode,
  Sparkles,
  Layers,
  Code2,
  ShieldCheck,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import CodeViewer from './CodeViewer';
import { downloadZip, downloadHtml, openInNewTab } from '../utils/exportZip';

export default function PreviewPanel({
  htmlContent,
  viewMode,
  setViewMode,
  deviceViewport,
  setDeviceViewport,
  isLoading,
  loadingMessage,
  onSelectExample,
  onOpenSetupModal,
  apiStatus,
}) {
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Viewport width styling
  const getViewportContainerStyles = () => {
    switch (deviceViewport) {
      case 'mobile':
        return 'w-[375px] max-w-full h-[667px] max-h-[92%] rounded-[36px] border-[10px] border-slate-800 shadow-2xl overflow-hidden my-auto';
      case 'tablet':
        return 'w-[768px] max-w-full h-[900px] max-h-[95%] rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden my-auto';
      case 'desktop':
      default:
        return 'w-full h-full rounded-none border-0';
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* Top Browser Simulation Bar */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 select-none shrink-0">
        {/* Left: Window controls & URL simulation */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-md border border-slate-800 text-[11px] text-slate-400 font-mono truncate max-w-xs md:max-w-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">prompt2web://sandbox/index.html</span>
          </div>
        </div>

        {/* Center: Device Switcher (Mobile/Tablet/Desktop) */}
        {htmlContent && viewMode === 'preview' && (
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setDeviceViewport('desktop')}
              className={`p-1 rounded transition-colors ${
                deviceViewport === 'desktop' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceViewport('tablet')}
              className={`p-1 rounded transition-colors ${
                deviceViewport === 'tablet' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceViewport('mobile')}
              className={`p-1 rounded transition-colors ${
                deviceViewport === 'mobile' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right: Actions */}
        {htmlContent ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRefresh}
              title="Reload sandbox iframe"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => openInNewTab(htmlContent)}
              title="Open full page in new browser tab"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => downloadZip(htmlContent)}
              title="Download packaged ZIP"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 font-medium text-xs transition-colors border border-violet-500/30"
            >
              <Download className="w-3 h-3" />
              <span>ZIP</span>
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 font-medium">Ready to build</div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-auto p-0 relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn select-none">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-[2px] shadow-2xl shadow-violet-500/30 animate-pulse-slow mb-4">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-violet-400 animate-spin" />
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-1">Building Your Website</h3>
            <p className="text-xs text-violet-300 font-medium mb-3">
              {loadingMessage || 'Synthesizing layout, Tailwind CSS, and interactions...'}
            </p>

            <div className="w-64 bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full w-2/3 animate-pulse rounded-full"></div>
            </div>

            <p className="text-[11px] text-slate-400 max-w-sm">
              The AI is generating an entire standalone HTML5 page complete with responsive layout, typography, and interactive client JavaScript.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!htmlContent && !isLoading ? (
          <div className="max-w-xl mx-auto px-6 py-12 text-center select-none">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 text-violet-400 shadow-xl shadow-violet-500/10">
              <Sparkles className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">
              Transform Prompts into Live Websites
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              Describe your dream website in the left panel or click one of our curated templates to generate a complete, responsive website in seconds.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-left">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-violet-400 font-semibold text-xs mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Standalone HTML5</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Embedded Tailwind CSS, Google Fonts, and zero external backend needs.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-indigo-400 font-semibold text-xs mb-1 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Iterative Refinement</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Ask AI to tweak colors, add features, or adjust layout with version control.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-fuchsia-400 font-semibold text-xs mb-1 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Instant ZIP Export</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Download production-ready code ready for Vercel, Netlify, or local use.
                </p>
              </div>
            </div>

            {!apiStatus?.configured && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs inline-flex items-center gap-2">
                <span>⚠️ AI API Key not configured yet.</span>
                <button
                  type="button"
                  onClick={onOpenSetupModal}
                  className="font-semibold underline hover:text-white"
                >
                  Configure in 1 minute &rarr;
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* Content View: Preview (iframe) or Code (CodeViewer) */}
        {htmlContent ? (
          viewMode === 'code' ? (
            <div className="w-full h-full">
              <CodeViewer htmlContent={htmlContent} />
            </div>
          ) : (
            <div
              className={`transition-all duration-300 bg-white ${getViewportContainerStyles()}`}
            >
              <iframe
                key={iframeKey}
                srcDoc={htmlContent}
                title="Prompt2Web Live Sandbox"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                className="w-full h-full border-0 bg-white"
              />
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
