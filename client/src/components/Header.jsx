import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  ExternalLink,
  Layers,
  RotateCcw,
} from 'lucide-react';

export default function Header({
  apiStatus,
  onOpenSetupModal,
  viewMode,
  setViewMode,
  deviceViewport,
  setDeviceViewport,
  hasGeneratedWebsite,
  onDownloadZip,
  onOpenInNewTab,
  onReset,
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600 p-[1px] shadow-lg shadow-violet-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Prompt2Web
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
              AI MVP
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Natural Language to Live Website Generator
          </p>
        </div>
      </div>

      {/* Middle: Device Viewport Switcher & View Mode (Visible when website exists) */}
      <div className="flex items-center gap-2">
        {hasGeneratedWebsite && (
          <>
            {/* Viewport controls */}
            <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setDeviceViewport('desktop')}
                title="Desktop View (Full Width)"
                className={`p-1.5 rounded-md transition-colors ${
                  deviceViewport === 'desktop'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceViewport('tablet')}
                title="Tablet View (768px)"
                className={`p-1.5 rounded-md transition-colors ${
                  deviceViewport === 'tablet'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceViewport('mobile')}
                title="Mobile View (375px)"
                className={`p-1.5 rounded-md transition-colors ${
                  deviceViewport === 'mobile'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Preview / Code */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'code'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right: API Status & Export Actions */}
      <div className="flex items-center gap-2.5">
        {/* Status Pill */}
        {apiStatus.configured ? (
          <div
            onClick={onOpenSetupModal}
            className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-emerald-500/20 transition-colors"
            title="Click to view API provider details"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium capitalize hidden sm:inline">
              {apiStatus.provider} Connected
            </span>
            <span className="font-medium sm:hidden">AI Ready</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenSetupModal}
            className="flex items-center gap-1.5 text-xs bg-amber-500/10 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-all shadow-sm shadow-amber-500/10 animate-bounce"
            title="API key missing - Click for quick setup guide"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Setup API Key</span>
          </button>
        )}

        {/* Action Buttons if website exists */}
        {hasGeneratedWebsite && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenInNewTab}
              title="Open full page preview in new tab"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 hidden sm:flex items-center"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDownloadZip}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/25 transition-all"
              title="Download website as standalone ZIP (index.html + README)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export ZIP</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
