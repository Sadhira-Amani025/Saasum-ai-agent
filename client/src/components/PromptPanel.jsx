import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Send,
  History,
  AlertCircle,
  HelpCircle,
  Zap,
  PlusCircle,
  Edit3,
  Layers,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  {
    title: '🤖 AI SaaS Landing Page',
    prompt:
      'A modern high-converting landing page for an AI Productivity Assistant called "NovaFlow". Dark mode theme with indigo & violet accents, hero section with glowing badges and CTA, 4 key features in glassmorphism cards, interactive pricing toggle (Monthly/Yearly) with 3 tiers, customer testimonials slider, and a clean footer.',
  },
  {
    title: '☕ Artisan Coffee & Roastery',
    prompt:
      'An elegant artisan coffee house website called "Velvet Roast". Warm earthy tones (warm amber, espresso brown, cream), full-screen hero with warm ambiance photo, interactive menu tabs (Espresso, Brews, Pastries), our story section, customer reviews, opening hours, and an interactive table reservation modal.',
  },
  {
    title: '💼 Minimalist Portfolio',
    prompt:
      'A sleek, ultra-clean portfolio for an experienced Product Designer named "Alex Rivera". Minimalist black and white design with electric blue accents, bold typography, filterable project grid (UX/UI, Mobile Apps, Brand Identity), interactive about me timeline, and an interactive contact modal form.',
  },
  {
    title: '⚡ Cyberpunk Gym & Fitness',
    prompt:
      'A high-octane fitness club website called "IronCore Gym". Dark aesthetic with vibrant neon lime and cyan highlights, bold dynamic hero banner, interactive class schedule table with day filters (Mon-Sun), trainer showcase cards with hover effects, and a BMI & membership calculator widget.',
  },
  {
    title: '🌿 Eco Friendly Plant Store',
    prompt:
      'A refreshing e-commerce showcase for an indoor plant boutique called "Verdant Haven". Soft sage green and warm terracotta palette, hero banner with seasonal plants, interactive plant care filter (Low light, Pet safe, Beginners), product cards with add-to-cart counter, and plant care tips accordion FAQ.',
  },
];

const QUICK_MODIFICATIONS = [
  '🌙 Switch to sleek dark mode with neon accents',
  '🏷️ Add a 3-tier interactive pricing table',
  '❓ Add an interactive accordion FAQ section',
  '📱 Add a responsive mobile hamburger menu toggle',
  '⭐ Add customer review testimonials carousel',
  '📬 Add a clean contact form with validation',
];

export default function PromptPanel({
  onGenerate,
  onModify,
  isLoading,
  loadingMessage,
  errorMessage,
  hasGeneratedWebsite,
  versions,
  currentVersionIndex,
  onSelectVersion,
  onOpenSetupModal,
}) {
  const [activeTab, setActiveTab] = useState(hasGeneratedWebsite ? 'modify' : 'new');
  const [newPrompt, setNewPrompt] = useState('');
  const [modifyPrompt, setModifyPrompt] = useState('');

  // Auto-switch to modify tab when a website gets generated
  React.useEffect(() => {
    if (hasGeneratedWebsite) {
      setActiveTab('modify');
    }
  }, [hasGeneratedWebsite]);

  const handleGenerateSubmit = (e) => {
    e?.preventDefault();
    if (!newPrompt.trim() || isLoading) return;
    onGenerate(newPrompt.trim());
  };

  const handleModifySubmit = (e) => {
    e?.preventDefault();
    if (!modifyPrompt.trim() || isLoading) return;
    onModify(modifyPrompt.trim());
    setModifyPrompt('');
  };

  const handleKeyDownNew = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerateSubmit(e);
    }
  };

  const handleKeyDownModify = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleModifySubmit(e);
    }
  };

  return (
    <div className="w-full lg:w-[450px] xl:w-[480px] h-full flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 overflow-hidden">
      {/* Tab Switcher if website is generated */}
      {hasGeneratedWebsite ? (
        <div className="p-3 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('modify')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'modify'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Modify Website</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'new'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Error message alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Generation Failed</p>
              <p className="mt-0.5 text-rose-300/90 leading-relaxed">{errorMessage}</p>
              {errorMessage.includes('API key') || errorMessage.includes('MISSING_API_KEY') ? (
                <button
                  type="button"
                  onClick={onOpenSetupModal}
                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-medium transition-colors border border-rose-500/30"
                >
                  Configure API Key Now &rarr;
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* Tab 1: MODIFY EXISTING WEBSITE */}
        {activeTab === 'modify' && hasGeneratedWebsite ? (
          <div className="space-y-4">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-violet-400 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  Iterative AI Modification
                </span>
                <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                  Version {currentVersionIndex + 1} of {versions.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Describe changes you want to make to the current website. The AI updates the code while preserving your existing design.
              </p>
            </div>

            {/* Modify Prompt Input */}
            <form onSubmit={handleModifySubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={modifyPrompt}
                  onChange={(e) => setModifyPrompt(e.target.value)}
                  onKeyDown={handleKeyDownModify}
                  rows={4}
                  disabled={isLoading}
                  placeholder="e.g. Change the primary button colors to emerald green, add a testimonials section with 3 customer quotes, and make the navigation bar sticky on scroll..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 resize-none outline-none transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={!modifyPrompt.trim() || isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Applying Changes...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply Modifications (Ctrl+Enter)</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Modification Suggestions */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Adjustments
              </p>
              <div className="flex flex-col gap-1.5">
                {QUICK_MODIFICATIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setModifyPrompt(item.replace(/^[^\s]+\s*/, ''))}
                    disabled={isLoading}
                    className="text-left text-xs p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-violet-500/40 text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">{item}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Version History */}
            {versions.length > 1 && (
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Version History</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {versions.map((ver, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectVersion(idx)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors border ${
                        idx === currentVersionIndex
                          ? 'bg-violet-600/20 border-violet-500/40 text-violet-200'
                          : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-semibold">Version {idx + 1}</span>
                        <span className="text-[11px] text-slate-400 ml-2">
                          {idx === 0 ? 'Initial Generation' : `Revision ${idx}`}
                        </span>
                      </div>
                      {idx === currentVersionIndex && (
                        <span className="text-[10px] bg-violet-500/30 text-violet-300 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: NEW WEBSITE GENERATION */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Describe Your Website
              </label>
              <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                Be specific about theme, target audience, sections (hero, features, pricing, testimonials), and interactive elements.
              </p>
              <textarea
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyDown={handleKeyDownNew}
                rows={5}
                disabled={isLoading}
                placeholder="e.g. Build a sleek SaaS landing page for an AI code review tool named 'CodePulse'. Use dark mode with neon cyan highlights, hero with code terminal preview, 3 key benefits, interactive pricing table, and customer review cards..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 resize-none outline-none transition-all disabled:opacity-50"
              />
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerateSubmit}
              disabled={!newPrompt.trim() || isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-violet-200" />
                  <span>Generating Website...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-violet-200" />
                  <span>Generate Website (Ctrl+Enter)</span>
                </>
              )}
            </button>

            {/* Example Prompts */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Example Prompts
                </span>
                <span className="text-[10px] text-slate-500">Click to load</span>
              </div>

              <div className="space-y-2">
                {EXAMPLE_PROMPTS.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setNewPrompt(item.prompt)}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-violet-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-violet-300">
                        {item.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Status bar inside PromptPanel */}
      {isLoading && (
        <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 shrink-0 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
              <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-violet-200 truncate">
                {loadingMessage || 'Synthesizing layout & code...'}
              </p>
              <p className="text-[11px] text-slate-400">
                Calling LLM backend & compiling HTML5
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
