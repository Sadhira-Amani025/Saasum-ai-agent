import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Rocket,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Palette,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

const PRESETS = {
  bakery: {
    projectName: 'Sweet Harmony Artisan Bakery',
    businessName: 'Sweet Harmony Artisan Bakery',
    category: 'Bakery',
    projectDescription:
      'A warm, neighborhood sourdough and pastry bakery. Need an organic story, signature bread lineup, catering order inquiry, and morning opening hours.',
    theme: 'Elegant',
    primaryColor: '#b45309',
    secondaryColor: '#d97706',
    requiredSections: ['Navbar', 'Hero', 'About', 'ProductCards', 'Features', 'Testimonials', 'ContactForm', 'Footer'],
  },
  restaurant: {
    projectName: 'Aura Contemporary Dining',
    businessName: 'Aura Contemporary Dining',
    category: 'Restaurant',
    projectDescription:
      'High-end fine dining restaurant specializing in seasonal tasting menus, wood-fired hearth cooking, and wine pairings. Needs a table reservation form and seasonal tasting menu.',
    theme: 'Modern',
    primaryColor: '#d4af37',
    secondaryColor: '#ea580c',
    requiredSections: ['Navbar', 'Hero', 'About', 'ProductCards', 'Features', 'Gallery', 'ContactForm', 'Footer'],
  },
  portfolio: {
    projectName: 'Elena Vance Creative Portfolio',
    businessName: 'Elena Vance Design & Direction',
    category: 'Portfolio',
    projectDescription:
      'Senior digital product designer and art director portfolio. Needs interactive case studies, design philosophy, design awards metrics, and project inquiry form.',
    theme: 'Minimal',
    primaryColor: '#18181b',
    secondaryColor: '#3b82f6',
    requiredSections: ['Navbar', 'Hero', 'About', 'Gallery', 'Features', 'Testimonials', 'ContactForm', 'Footer'],
  },
  ecommerce: {
    projectName: 'Aura Minimalist Living',
    businessName: 'Aura Minimalist Living',
    category: 'Online Store',
    projectDescription:
      'Curated lifestyle brand selling sustainable ceramic homeware, organic linen bedding, and handcrafted furniture. Needs product catalog, shopping cart, and search bar.',
    theme: 'Minimal',
    primaryColor: '#2b2d42',
    secondaryColor: '#4f46e5',
    requiredSections: ['Navbar', 'Hero', 'SearchInput', 'ProductCards', 'Features', 'Newsletter', 'ContactForm', 'Footer'],
  },
  agency: {
    projectName: 'Nexus Growth & Digital Studio',
    businessName: 'Nexus Growth Studio',
    category: 'Digital Agency',
    projectDescription:
      'Full-service technology and digital marketing agency delivering high-velocity engineering, growth marketing, and branding. Needs service cards, client revenue metrics, and discovery call booking.',
    theme: 'Modern',
    primaryColor: '#4f46e5',
    secondaryColor: '#06b6d4',
    requiredSections: ['Navbar', 'Hero', 'Features', 'ServiceCards', 'PricingCards', 'Testimonials', 'ContactForm', 'Footer'],
  },
};

const ALL_SECTIONS = [
  { id: 'Navbar', label: 'Navigation Bar' },
  { id: 'Hero', label: 'Hero Section' },
  { id: 'About', label: 'About & Story' },
  { id: 'ProductCards', label: 'Products Catalog' },
  { id: 'ServiceCards', label: 'Service Cards' },
  { id: 'Features', label: 'Features & Benefits' },
  { id: 'Gallery', label: 'Gallery / Portfolio' },
  { id: 'PricingCards', label: 'Pricing Plans' },
  { id: 'Testimonials', label: 'Testimonials (Sample Labeled)' },
  { id: 'FAQ', label: 'FAQ Accordion' },
  { id: 'ContactForm', label: 'Contact Form & Info' },
  { id: 'Newsletter', label: 'Newsletter' },
  { id: 'SearchInput', label: 'Search Bar' },
];

const GENERATION_STEPS = [
  { label: 'Analyzing business type and target audience...', minSeconds: 0 },
  { label: 'Architecting visual layout and domain hierarchy...', minSeconds: 2 },
  { label: 'Synthesizing authentic copy, catalog items & styling...', minSeconds: 4 },
  { label: 'Validating configuration & launching live preview...', minSeconds: 6 },
];

export default function Dashboard({
  onGenerate,
  isGenerating = false,
  existingProjects = [],
  onOpenProject,
  error = null,
  onClearError,
}) {
  const [formData, setFormData] = useState({
    projectName: 'Sweet Harmony Artisan Bakery',
    businessName: 'Sweet Harmony Artisan Bakery',
    category: 'Bakery',
    projectDescription:
      'A neighborhood artisanal sourdough and viennoiserie bakery. Needs an ingredients story, sourdough lineup, catering order inquiry, and morning opening hours.',
    theme: 'Elegant',
    primaryColor: '#b45309',
    secondaryColor: '#d97706',
    demoMode: false,
    requiredSections: ['Navbar', 'Hero', 'About', 'ProductCards', 'Features', 'Testimonials', 'ContactForm', 'Footer'],
  });

  // Generation elapsed time and active stage
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (isGenerating) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  const toggleSection = (secId) => {
    setFormData((prev) => {
      const current = prev.requiredSections || [];
      const updated = current.includes(secId)
        ? current.filter((s) => s !== secId)
        : [...current, secId];
      return { ...prev, requiredSections: updated };
    });
  };

  const handlePresetSelect = (presetKey) => {
    const p = PRESETS[presetKey];
    if (p) {
      setFormData((prev) => ({
        ...prev,
        ...p,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isGenerating) return; // Guard against duplicate submissions
    onGenerate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 relative">
      {/* Live Generation Progress Modal Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 animate-pulse" />

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white mb-1.5">
                Generating {formData.businessName}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Synthesizing a complete, production-ready website matching your business archetype.
              </p>
            </div>

            {/* Stepped Progress List */}
            <div className="space-y-3 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {GENERATION_STEPS.map((step, sIdx) => {
                const isPassed = elapsedSeconds > step.minSeconds + 1.5;
                const isCurrent = elapsedSeconds >= step.minSeconds && !isPassed;

                return (
                  <div key={sIdx} className="flex items-center gap-3 text-xs">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={isPassed ? 'text-slate-300 font-medium' : isCurrent ? 'text-indigo-300 font-bold' : 'text-slate-600'}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Elapsed: {elapsedSeconds}s</span>
              <span>Safe asynchronous execution</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SaaSsum AI Commerce • Instant Website Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-4">
            SaaSsum AI Commerce
          </h1>
          <p className="text-base text-slate-400 max-w-xl mx-auto">
            From Business Idea to Digital Business in Minutes. Describe your business in natural language and generate a live, modifiable website.
          </p>
        </div>

        {/* Actionable Error Banner if an API error occurred */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-200">Generation or Connection Issue</h4>
                <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
            {onClearError && (
              <button
                type="button"
                onClick={onClearError}
                className="text-xs text-rose-400 hover:text-white underline shrink-0 font-semibold"
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* Existing Projects Quick Resume Bar */}
        {existingProjects.length > 0 && (
          <div className="mb-10 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4 text-indigo-400" />
                Resume Saved Projects ({existingProjects.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {existingProjects.slice(0, 3).map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => onOpenProject(proj.id)}
                  className="p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-left transition-all flex flex-col justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors truncate">
                      {proj.businessName}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{proj.category || 'General'}</p>
                  </div>
                  <div className="mt-3 text-[10px] text-indigo-400 flex items-center gap-1 font-semibold">
                    <span>Open in Editor</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-sm space-y-8"
        >
          {/* Industry Archetype Presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Choose an Industry Archetype (One-Click Setup):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {[
                { key: 'bakery', label: 'Artisan Bakery', icon: '🥐' },
                { key: 'restaurant', label: 'Fine Dining', icon: '🍷' },
                { key: 'portfolio', label: 'Creative Portfolio', icon: '🎨' },
                { key: 'ecommerce', label: 'Online Store', icon: '🛍️' },
                { key: 'agency', label: 'Digital Agency', icon: '⚡' },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePresetSelect(p.key)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    formData.category.toLowerCase().includes(p.key) ||
                    (p.key === 'bakery' && formData.category === 'Bakery') ||
                    (p.key === 'restaurant' && formData.category === 'Restaurant') ||
                    (p.key === 'portfolio' && formData.category === 'Portfolio') ||
                    (p.key === 'ecommerce' && formData.category === 'Online Store') ||
                    (p.key === 'agency' && formData.category === 'Digital Agency')
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md shadow-indigo-500/10'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xl mb-1">{p.icon}</div>
                  <div className="text-xs">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Business Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Business or Brand Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessName: e.target.value,
                    projectName: e.target.value,
                  })
                }
                placeholder="e.g. Sweet Harmony Artisan Bakery"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Business Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Bakery">Bakery & Cafe</option>
                <option value="Restaurant">Restaurant & Fine Dining</option>
                <option value="Portfolio">Creative Portfolio</option>
                <option value="Online Store">Online Store / E-Commerce</option>
                <option value="Digital Agency">Digital Agency / Studio</option>
                <option value="General">General Business / SaaS</option>
              </select>
            </div>
          </div>

          {/* Detailed Business Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Describe Your Desired Website & Audience <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Describe your offerings, target audience, brand aesthetic, and specific sections needed..."
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Section Selection Checklist */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Included Website Sections:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {ALL_SECTIONS.map((sec) => {
                const isSelected = (formData.requiredSections || []).includes(sec.id);
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-indigo-500 text-white' : 'border border-slate-700'}`}>
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Offline demo toggle & Submit button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.demoMode}
                onChange={(e) => setFormData({ ...formData, demoMode: e.target.checked })}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Force Offline Demo Engine (Deterministic Fallback)</span>
            </label>

            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Website...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Generate Digital Business</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
