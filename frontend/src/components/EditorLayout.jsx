import React, { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Download,
  RotateCcw,
  Sparkles,
  Send,
  History,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Palette,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Cloud,
  Check,
  RefreshCw,
} from 'lucide-react';
import WebsiteRenderer from './WebsiteRenderer';

const QUICK_SUGGESTIONS = [
  'Change the theme to dark purple and gold.',
  'Add a product search bar below hero.',
  'Add a WhatsApp chat button to hero section.',
  'Add phone and address fields to the contact form.',
  'Move the testimonials section above the pricing section.',
  'Make all cards and buttons smoothly rounded.',
  'Add an FAQ section with common customer questions.',
  'Change the hero heading to high-converting headline.',
];

const THEME_PRESETS = {
  modern: {
    id: 'Modern',
    name: 'Modern (Slate & Indigo)',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    cardBackground: '#1e293b',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '12px',
    isDark: true,
  },
  minimal: {
    id: 'Minimal',
    name: 'Minimal (Clean Swiss Light)',
    primaryColor: '#18181b',
    secondaryColor: '#71717a',
    backgroundColor: '#ffffff',
    textColor: '#18181b',
    cardBackground: '#f4f4f5',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '6px',
    isDark: false,
  },
  elegant: {
    id: 'Elegant',
    name: 'Elegant (Cream & Serif)',
    primaryColor: '#b45309',
    secondaryColor: '#d97706',
    backgroundColor: '#fdfbf7',
    textColor: '#1c1917',
    cardBackground: '#ffffff',
    fontFamily: "'Playfair Display', Georgia, serif",
    borderRadius: '16px',
    isDark: false,
  },
  'purple-gold': {
    id: 'Dark Purple & Gold',
    name: 'Dark Purple & Gold',
    primaryColor: '#d4af37',
    secondaryColor: '#a855f7',
    backgroundColor: '#1a0b2e',
    textColor: '#fbf7ee',
    cardBackground: '#281446',
    fontFamily: "'Cinzel', 'Inter', serif",
    borderRadius: '16px',
    isDark: true,
  },
  'black-gold': {
    id: 'Luxury Black & Gold',
    name: 'Luxury Black & Gold',
    primaryColor: '#d4af37',
    secondaryColor: '#f59e0b',
    backgroundColor: '#0a0a0c',
    textColor: '#f5f5f7',
    cardBackground: '#141418',
    fontFamily: "'Playfair Display', serif",
    borderRadius: '12px',
    isDark: true,
  },
};

const DEFAULT_SECTION_TEMPLATES = {
  About: {
    type: 'About',
    props: {
      badge: 'Our Heritage',
      title: 'Crafted with Passion & Purpose',
      content: 'Founded with a dedication to authentic craftsmanship, we take pride in delivering unforgettable experiences and premium quality.',
      highlights: [
        { value: '12+', label: 'Years Experience' },
        { value: '100%', label: 'Natural Ingredients' },
        { value: '4.9★', label: 'Customer Rating' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    },
  },
  Features: {
    type: 'Features',
    props: {
      badge: 'Core Value',
      title: 'Engineered for Excellence',
      subtitle: 'Every offering is designed with precision, intentionality, and care.',
      features: [
        { icon: '✨', title: 'Signature Craftsmanship', description: 'Handcrafted daily using carefully selected premium ingredients and materials.' },
        { icon: '⚡', title: 'Prompt Service', description: 'Optimized fulfillment ensuring you receive the freshest quality without delays.' },
        { icon: '🛡️', title: 'Guaranteed Satisfaction', description: 'Backed by our uncompromising standard of quality and warm personal hospitality.' },
      ],
    },
  },
  Gallery: {
    type: 'Gallery',
    props: {
      title: 'Visual Showcase & Gallery',
      subtitle: 'A visual tour of our creations, spaces, and atmosphere.',
      items: [
        { title: 'Artisan Selection 01', category: 'Handcrafted', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', description: 'Freshly baked sourdough' },
        { title: 'Artisan Selection 02', category: 'Ambiance', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', description: 'Warm and welcoming environment' },
        { title: 'Artisan Selection 03', category: 'Specialty', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', description: 'Seasonal limited offerings' },
      ],
    },
  },
  ProductCards: {
    type: 'ProductCards',
    props: {
      badge: 'Curated Catalog',
      title: 'Signature Offerings',
      subtitle: 'Explore our popular items ready for immediate pickup and delivery.',
      products: [
        { name: 'Artisan Classic Selection', price: '$18.00', description: 'Our signature handcrafted offering made fresh daily.', badge: 'Bestseller', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
        { name: 'Reserve Specialty Item', price: '$26.00', description: 'Limited batch made with organic ingredients and heritage techniques.', badge: 'Limited', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
        { name: 'Seasonal Tasting Box', price: '$34.00', description: 'An assorted assortment of our chef-recommended favorites.', badge: 'New', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
      ],
    },
  },
  ContactForm: {
    type: 'ContactForm',
    props: {
      title: 'Get in Touch',
      subtitle: 'Have a question, catering request, or special inquiry? Send us a message.',
      fields: [
        { label: 'Full Name', type: 'text', name: 'fullName', required: true },
        { label: 'Email Address', type: 'email', name: 'email', required: true },
        { label: 'Phone Number', type: 'tel', name: 'phone', required: false },
        { label: 'Message', type: 'textarea', name: 'message', required: true },
      ],
    },
  },
  SearchInput: {
    type: 'SearchInput',
    props: {
      placeholder: 'Search our catalog, offerings, or resources...',
      buttonText: 'Search Catalog',
    },
  },
  Newsletter: {
    type: 'Newsletter',
    props: {
      title: 'Join Our Community',
      subtitle: 'Receive seasonal menus, VIP event invitations, and exclusive tasting notes.',
      buttonText: 'Subscribe Now',
    },
  },
  Testimonials: {
    type: 'Testimonials',
    props: {
      badge: 'Sample Customer Experience',
      title: 'Reflections from Our Guests',
      subtitle: 'Sample impressions reflecting our commitment to hospitality.',
      items: [
        { quote: 'The highest quality and most memorable service we have experienced in years.', author: 'Alex Turner', role: 'Regular Patron' },
        { quote: 'Uncompromising attention to detail and remarkable consistency every single visit.', author: 'Claire Dupont', role: 'Community Member' },
      ],
    },
  },
  FAQ: {
    type: 'FAQ',
    props: {
      title: 'Frequently Asked Questions',
      items: [
        { question: 'What are your hours and ordering cutoff times?', answer: 'We are open Tuesday through Sunday. Custom orders must be placed 24 hours in advance.' },
        { question: 'Do you accommodate dietary preferences and custom requests?', answer: 'Yes! Please mention any preferences in the contact form and our team will tailor options for you.' },
      ],
    },
  },
  PricingCards: {
    type: 'PricingCards',
    props: {
      title: 'Transparent Plans & Packages',
      subtitle: 'Choose a package that suits your goals.',
      plans: [
        { name: 'Starter Package', price: '$29', period: '/mo', description: 'Essential access and support.', popular: false, ctaText: 'Select Starter', features: ['Core access', 'Email support'] },
        { name: 'Signature Package', price: '$79', period: '/mo', description: 'Full access with priority booking.', popular: true, ctaText: 'Select Signature', features: ['All starter benefits', 'Priority reservations', 'Direct concierge'] },
      ],
    },
  },
  CTA: {
    type: 'CTA',
    props: {
      badge: 'Experience Excellence',
      title: 'Ready to Experience the Difference?',
      subtitle: 'Reserve your order or contact our team today to get started.',
      primaryCta: 'Contact Us Now',
      primaryCtaHref: '#contact',
    },
  },
};

export default function EditorLayout({
  project,
  config,
  version = 1,
  versionHistory = [],
  saveStatus = 'saved', // 'saved', 'saving', 'error'
  onApplyEdit,
  onDirectUpdateConfig,
  onUndo,
  onRestoreVersion,
  onExportZip,
  onBackToDashboard,
  isEditing = false,
  error = null,
}) {
  const [instruction, setInstruction] = useState('');
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile
  const [activeTab, setActiveTab] = useState('chat'); // chat, sections, theme, history
  const [newSectionType, setNewSectionType] = useState('About');
  const [newSectionPos, setNewSectionPos] = useState('bottom');

  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: `Hello! I generated your initial website for **${project?.businessName || 'your business'}** (v${version}). You can now ask me to change any color, add buttons, insert forms, reorder sections, or modify copy in natural language!`,
      operations: [],
    },
  ]);
  const [previewMode, setPreviewMode] = useState('preview'); // 'preview' or 'json'

  // Monotonic Sequence ID to prevent out-of-order responses from overwriting newer changes
  const editSeqRef = useRef(0);
  const colorDebounceRef = useRef(null);

  const currentTheme = config?.theme || THEME_PRESETS.modern;
  const sections = Array.isArray(config?.sections) ? config.sections : [];

  // Direct Theme Switching Handler
  const handleApplyPresetTheme = (presetKey) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset || !config) return;

    const updatedConfig = {
      ...config,
      theme: {
        ...currentTheme,
        ...preset,
      },
    };

    if (onDirectUpdateConfig) {
      onDirectUpdateConfig(updatedConfig, `Switched theme to ${preset.name}`);
    }

    setChatLog((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `🎨 Updated theme to **${preset.name}**. Unrelated custom component styles were preserved.`,
        operations: [{ type: 'UPDATE_THEME', description: `Applied ${preset.name}` }],
      },
    ]);
  };

  // Debounced Custom Color/Style Updater
  const handleUpdateThemeProperty = (propKey, propValue) => {
    if (!config) return;

    let updatedTheme = {
      ...currentTheme,
      [propKey]: propValue,
    };

    if (propKey === 'backgroundColor') {
      const clean = propValue.trim().replace('#', '');
      if (clean.length === 6) {
        try {
          const r = parseInt(clean.substring(0, 2), 16);
          const g = parseInt(clean.substring(2, 4), 16);
          const b = parseInt(clean.substring(4, 6), 16);
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          const isLight = luminance > 140;
          updatedTheme.isDark = !isLight;
          updatedTheme.textColor = isLight ? '#111827' : '#f9fafb';
          updatedTheme.cardBackground = isLight ? '#ffffff' : '#111827';
        } catch (e) {}
      }
    }

    const updatedConfig = {
      ...config,
      theme: updatedTheme,
    };

    if (onDirectUpdateConfig) {
      if (colorDebounceRef.current) clearTimeout(colorDebounceRef.current);
      colorDebounceRef.current = setTimeout(() => {
        onDirectUpdateConfig(updatedConfig, `Updated theme ${propKey}`);
      }, 300);
    }
  };

  const handleResetComponentCustomStyles = () => {
    if (!config) return;
    const updatedSections = sections.map((sec) => {
      const copy = { ...sec };
      delete copy.customStyle;
      return copy;
    });

    const updatedConfig = {
      ...config,
      sections: updatedSections,
    };

    if (onDirectUpdateConfig) {
      onDirectUpdateConfig(updatedConfig, 'Reset individual component custom styles');
    }

    setChatLog((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: '🧹 Reset manual component style overrides back to global theme defaults.',
      },
    ]);
  };

  const handleMoveSection = (index, direction) => {
    if (!config || !sections.length) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const updatedConfig = {
      ...config,
      sections: newSections,
    };

    if (onDirectUpdateConfig) {
      onDirectUpdateConfig(updatedConfig, `Reordered ${moved.type} section`);
    }

    setChatLog((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `↕ Moved **${moved.type}** section ${direction}. Preview updated immediately.`,
      },
    ]);
  };

  const handleRemoveSection = (index) => {
    if (!config || !sections.length) return;
    const secToRemove = sections[index];
    const newSections = sections.filter((_, idx) => idx !== index);

    const updatedConfig = {
      ...config,
      sections: newSections,
    };

    if (onDirectUpdateConfig) {
      onDirectUpdateConfig(updatedConfig, `Removed ${secToRemove.type} section`);
    }

    setChatLog((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `🗑 Removed **${secToRemove.type}** section from both configuration and preview.`,
      },
    ]);
  };

  const handleAddSectionDirect = () => {
    if (!config) return;
    const template = DEFAULT_SECTION_TEMPLATES[newSectionType] || DEFAULT_SECTION_TEMPLATES.About;
    const newId = `sec-${newSectionType.toLowerCase()}-${Date.now()}`;
    const newSec = {
      id: newId,
      type: newSectionType,
      props: JSON.parse(JSON.stringify(template.props)),
    };

    const newSections = [...sections];
    if (newSectionPos === 'top') {
      const insertAt = newSections.length > 0 && newSections[0].type === 'Navbar' ? 1 : 0;
      newSections.splice(insertAt, 0, newSec);
    } else {
      const insertAt = newSections.length > 0 && newSections[newSections.length - 1].type === 'Footer'
        ? newSections.length - 1
        : newSections.length;
      newSections.splice(insertAt, 0, newSec);
    }

    const updatedConfig = {
      ...config,
      sections: newSections,
    };

    if (onDirectUpdateConfig) {
      onDirectUpdateConfig(updatedConfig, `Added ${newSectionType} section`);
    }

    setChatLog((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `✨ Added new **${newSectionType}** section at ${newSectionPos}. Preview updated immediately.`,
      },
    ]);
  };

  const handleUndoWithNotice = async () => {
    if (onUndo) {
      await onUndo();
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `↩ Reverted to previous version snapshot. State successfully updated.`,
        },
      ]);
    }
  };

  const handleRestoreWithNotice = async (vNum) => {
    if (onRestoreVersion) {
      await onRestoreVersion(vNum);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `↩ Restored website state to Version ${vNum}. Active configuration updated.`,
        },
      ]);
    }
  };

  const handleSendPrompt = async (promptToSend) => {
    const text = (promptToSend || instruction).trim();
    if (!text || isEditing) return;

    // Increment monotonic request sequence ID
    const currentSeqId = ++editSeqRef.current;

    setChatLog((prev) => [...prev, { sender: 'user', text }]);
    setInstruction('');

    try {
      const response = await onApplyEdit(text);

      // Verify this is still the newest request (discard if older request finished late)
      if (currentSeqId !== editSeqRef.current) {
        console.warn(`[RaceConditionGuard] Discarded stale response for seq ${currentSeqId}`);
        return;
      }

      if (response && response.data) {
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: response.data.summary || 'Applied requested changes successfully.',
            operations: response.data.operations || [],
          },
        ]);
      }
    } catch (err) {
      // Discard error notice if an even newer prompt was dispatched
      if (currentSeqId !== editSeqRef.current) return;

      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ Edit could not be applied: ${err.message || 'Operation failed'}. Your previous preview configuration was preserved without data loss.`,
          isError: true,
        },
      ]);
    }
  };

  const viewportStyles = {
    desktop: {
      container: 'w-full',
      frame: 'w-full shadow-2xl rounded-xl overflow-hidden border border-slate-800',
    },
    tablet: {
      container: 'w-[820px] py-4',
      frame: 'w-[768px] mx-auto shadow-2xl rounded-2xl overflow-hidden border-4 border-slate-800 bg-slate-900',
    },
    mobile: {
      container: 'w-[420px] py-4',
      frame: 'w-[375px] mx-auto shadow-2xl rounded-[32px] overflow-hidden border-8 border-slate-800 bg-slate-900',
    },
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header Navigation */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{project?.businessName || 'SaaSsum Project'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v{version}
              </span>

              {/* Real-time Save Status Indicator */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium ml-2">
                {saveStatus === 'saved' && (
                  <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="w-3 h-3" />
                    <span>Saved</span>
                  </span>
                )}
                {saveStatus === 'saving' && (
                  <span className="text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20" title="Check connection">
                    <AlertCircle className="w-3 h-3" />
                    <span>Unsaved</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Viewport Toggles & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Theme Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <select
              onChange={(e) => {
                if (e.target.value) handleApplyPresetTheme(e.target.value);
                e.target.value = '';
              }}
              defaultValue=""
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="" disabled>Switch Theme...</option>
              <option value="modern">Modern (Slate & Indigo)</option>
              <option value="minimal">Minimal (Clean Swiss Light)</option>
              <option value="elegant">Elegant (Warm Cream & Serif)</option>
              <option value="purple-gold">Dark Purple & Gold</option>
              <option value="black-gold">Luxury Black & Gold</option>
            </select>
          </div>

          {/* Preview vs JSON toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setPreviewMode('preview')}
              className={`px-2.5 py-1 rounded transition-colors ${
                previewMode === 'preview' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Preview
            </button>
            <button
              onClick={() => setPreviewMode('json')}
              className={`px-2.5 py-1 rounded transition-colors ${
                previewMode === 'json' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              JSON Config
            </button>
          </div>

          {/* Viewport switchers */}
          {previewMode === 'preview' && (
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop Viewport (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewport === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet Viewport (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile Viewport (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Undo Action */}
          <button
            onClick={handleUndoWithNotice}
            disabled={version <= 1 || isEditing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 disabled:opacity-40 transition-colors border border-slate-700"
            title="Undo to Previous Version"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          {/* Export ZIP Action */}
          <button
            onClick={onExportZip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            title="Export Standalone Website as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP</span>
          </button>
        </div>
      </header>

      {/* Split Screen Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Multi-Mode Sidebar (Chat, Sections, Theme, History) */}
        <div className="w-[440px] border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1 ${
                activeTab === 'chat'
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
              title="Conversational AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1 ${
                activeTab === 'sections'
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
              title="Sections & Layout Manager"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sections ({sections.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1 ${
                activeTab === 'theme'
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
              title="Theme & Styles Studio"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1 ${
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
              title="Version Snapshots"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* TAB 1: CONVERSATIONAL CHAT */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 ml-6'
                        : msg.isError
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 mr-4'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 mr-4'
                    }`}
                  >
                    <div className="font-semibold text-[11px] mb-1 text-slate-400 flex items-center gap-1">
                      {msg.sender === 'user' ? 'You' : 'SaaSsum AI Assistant'}
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {msg.operations && msg.operations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/50 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Applied Operations:
                        </div>
                        {msg.operations.map((op, oIdx) => (
                          <div
                            key={oIdx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950/60 text-indigo-300 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="font-bold">{op.type}</span>
                            <span className="text-slate-400 truncate">— {op.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 flex items-center gap-2 text-xs mr-4">
                    <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Planning & applying modifications...</span>
                  </div>
                )}
              </div>

              {/* Quick Suggestions Chips */}
              <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/30">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Try These Instructions:
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {QUICK_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isEditing}
                      onClick={() => setInstruction(s)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/60">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendPrompt();
                  }}
                  className="flex gap-2"
                >
                  <textarea
                    rows={2}
                    value={instruction}
                    disabled={isEditing}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={isEditing ? 'Processing edit request...' : "e.g. 'Add WhatsApp button', 'Move testimonials above pricing'..."}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendPrompt();
                      }
                    }}
                    className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!instruction.trim() || isEditing}
                    className="px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-40 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* TAB 2: SECTIONS & LAYOUT MANAGER */}
          {activeTab === 'sections' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-white text-xs mb-1">Page Section Hierarchy</h4>
                <p className="text-[11px] text-slate-400">
                  Reorder, add, or delete sections with instant preview synchronization.
                </p>
              </div>

              {/* Add New Section Card */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Insert New Section</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newSectionType}
                    onChange={(e) => setNewSectionType(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:outline-none"
                  >
                    {Object.keys(DEFAULT_SECTION_TEMPLATES).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <select
                    value={newSectionPos}
                    onChange={(e) => setNewSectionPos(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="bottom">Bottom (above Footer)</option>
                    <option value="top">Top (below Navbar)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddSectionDirect}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {newSectionType} Section</span>
                </button>
              </div>

              {/* Sections Ordered List */}
              <div className="space-y-2">
                {sections.map((sec, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === sections.length - 1;

                  return (
                    <div
                      key={sec.id || idx}
                      className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between gap-3 group hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-950 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{sec.type}</span>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {sec.id || `sec-${idx}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMoveSection(idx, 'up')}
                          className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMoveSection(idx, 'down')}
                          className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors ml-1"
                          title="Remove Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: THEME & STYLES STUDIO */}
          {activeTab === 'theme' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-5 text-xs">
              <div>
                <h4 className="font-bold text-white text-xs mb-1">Theme Presets & Palette</h4>
                <p className="text-[11px] text-slate-400">
                  Switch visual themes or fine-tune colors. Custom component styles remain preserved.
                </p>
              </div>

              {/* Theme Presets Grid */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Curated Presets:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(THEME_PRESETS).map(([key, p]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleApplyPresetTheme(key)}
                      className="p-3 rounded-xl border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800 text-left flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: p.primaryColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: p.backgroundColor }}
                          />
                        </div>
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Apply</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Color Customizers */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Custom Colors & Typography:
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between text-slate-300">
                    <span>Primary Accent Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTheme.primaryColor || '#6366f1'}
                        onChange={(e) => handleUpdateThemeProperty('primaryColor', e.target.value)}
                        className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-400">{currentTheme.primaryColor}</span>
                    </div>
                  </label>

                  <label className="flex items-center justify-between text-slate-300">
                    <span>Background Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTheme.backgroundColor || '#0f172a'}
                        onChange={(e) => handleUpdateThemeProperty('backgroundColor', e.target.value)}
                        className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-400">{currentTheme.backgroundColor}</span>
                    </div>
                  </label>

                  <label className="flex items-center justify-between text-slate-300">
                    <span>Card Surface Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTheme.cardBackground || '#1e293b'}
                        onChange={(e) => handleUpdateThemeProperty('cardBackground', e.target.value)}
                        className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-400">{currentTheme.cardBackground}</span>
                    </div>
                  </label>
                </div>

                {/* Font Family Selector */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-slate-300 block">Typography Font Family</span>
                  <select
                    value={currentTheme.fontFamily || 'Inter'}
                    onChange={(e) => handleUpdateThemeProperty('fontFamily', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="'Inter', sans-serif">Inter (Clean Modern Sans)</option>
                    <option value="'Playfair Display', Georgia, serif">Playfair Display (Editorial Serif)</option>
                    <option value="'Cinzel', serif">Cinzel (Luxury Classical)</option>
                    <option value="system-ui, -apple-system, sans-serif">System UI Native</option>
                  </select>
                </div>

                {/* Border Radius Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Border Radius</span>
                    <span className="font-mono text-indigo-400">{currentTheme.borderRadius || '12px'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    step="2"
                    value={parseInt(currentTheme.borderRadius || '12', 10) || 12}
                    onChange={(e) => handleUpdateThemeProperty('borderRadius', `${e.target.value}px`)}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Reset Custom Styles (Explicit Action) */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-500 leading-relaxed">
                  Individual sections can have custom style overrides that persist across theme switches. To reset component overrides back to global defaults:
                </div>
                <button
                  type="button"
                  onClick={handleResetComponentCustomStyles}
                  className="w-full py-2 px-3 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Reset Custom Component Styles
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: VERSION HISTORY */}
          {activeTab === 'history' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              <div className="text-slate-400 text-[11px] mb-2 leading-relaxed">
                Every modification records an immutable snapshot in PostgreSQL. Click restore on any version to roll back.
              </div>
              {versionHistory.map((v) => (
                <div
                  key={v.id || v.versionNumber}
                  className={`p-3.5 rounded-xl border transition-all ${
                    v.versionNumber === version
                      ? 'bg-indigo-600/10 border-indigo-500/40'
                      : 'bg-slate-800/60 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-950 text-indigo-400 inline-flex items-center justify-center text-[10px] font-bold">
                        {v.versionNumber}
                      </span>
                      Version {v.versionNumber}
                    </span>
                    {v.versionNumber === version ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRestoreWithNotice(v.versionNumber)}
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        Restore Snapshot
                      </button>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs mt-1">{v.changeSummary}</p>
                  <div className="text-[10px] text-slate-500 mt-2 font-mono">
                    Operation: {v.operationType || 'INITIAL_GENERATION'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Live Website Preview or JSON Config Viewport */}
        <div className="flex-1 bg-slate-950 overflow-y-auto flex flex-col items-center p-4">
          {previewMode === 'preview' ? (
            <div className={`transition-all duration-300 ${viewportStyles[viewport].container}`}>
              <div className={viewportStyles[viewport].frame}>
                <WebsiteRenderer config={config} />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-xs overflow-x-auto text-indigo-200">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400">
                <span className="font-bold text-slate-200">Raw Website Configuration Schema</span>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(config, null, 2))}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                >
                  Copy JSON
                </button>
              </div>
              <pre>{JSON.stringify(config, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
