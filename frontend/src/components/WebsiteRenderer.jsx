import React from 'react';
import { WebsiteProvider, useWebsite } from '../context/WebsiteContext';
import NavbarComponent from './website/NavbarComponent';
import HeroComponent from './website/HeroComponent';
import AboutComponent from './website/AboutComponent';
import FeaturesComponent from './website/FeaturesComponent';
import GalleryComponent from './website/GalleryComponent';
import CtaSectionComponent from './website/CtaSectionComponent';
import TextSectionComponent from './website/TextSectionComponent';
import ImageSectionComponent from './website/ImageSectionComponent';
import ProductCardsComponent from './website/ProductCardsComponent';
import ServiceCardsComponent from './website/ServiceCardsComponent';
import ContactFormComponent from './website/ContactFormComponent';
import SearchInputComponent from './website/SearchInputComponent';
import NewsletterComponent from './website/NewsletterComponent';
import TestimonialsComponent from './website/TestimonialsComponent';
import FaqComponent from './website/FaqComponent';
import PricingCardsComponent from './website/PricingCardsComponent';
import FooterComponent from './website/FooterComponent';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

const COMPONENT_MAP = {
  Navbar: NavbarComponent,
  Hero: HeroComponent,
  About: AboutComponent,
  Features: FeaturesComponent,
  Gallery: GalleryComponent,
  Portfolio: GalleryComponent,
  CTA: CtaSectionComponent,
  CtaSection: CtaSectionComponent,
  TextSection: TextSectionComponent,
  ImageSection: ImageSectionComponent,
  ProductCards: ProductCardsComponent,
  ServiceCards: ServiceCardsComponent,
  ContactForm: ContactFormComponent,
  SearchInput: SearchInputComponent,
  Newsletter: NewsletterComponent,
  Testimonials: TestimonialsComponent,
  FAQ: FaqComponent,
  PricingCards: PricingCardsComponent,
  Footer: FooterComponent,
};

const NORMALIZED_COMPONENT_MAP = {};
Object.entries(COMPONENT_MAP).forEach(([key, comp]) => {
  NORMALIZED_COMPONENT_MAP[key.toLowerCase()] = comp;
  NORMALIZED_COMPONENT_MAP[key.toLowerCase().replace(/_/g, '')] = comp;
});

// Interactive Cart Drawer Component
function CartDrawer({ theme }) {
  const {
    cartItems,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    setInquiryPrefill,
    scrollToSection,
  } = useWebsite();

  if (!isCartOpen) return null;

  const handleCheckoutInquiry = () => {
    const orderSummary = cartItems
      .map((it) => `- ${it.quantity}x ${it.name} (${it.price})`)
      .join('\n');
    setInquiryPrefill(`Hello, I would like to place an order for the following items:\n${orderSummary}\n\nEstimated Subtotal: ${cartTotal}\n\nPlease confirm availability and payment/delivery options.`);
    setIsCartOpen(false);
    scrollToSection('contact');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
          color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
        }}
        className="w-full max-w-md h-full flex flex-col shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300"
      >
        {/* Cart Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Your Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-600 mb-3" />
              <p className="font-semibold text-sm">Your cart is currently empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our catalog offerings in the preview and click "Add to Cart" to start your order!
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3.5"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                  <div className="text-xs text-indigo-400 font-semibold mt-0.5">{item.price}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-3 bg-slate-950/30">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Estimated Total:</span>
              <span className="text-xl font-black text-indigo-400">{cartTotal}</span>
            </div>

            <button
              onClick={handleCheckoutInquiry}
              style={{ backgroundColor: theme.primaryColor || '#6366f1' }}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 shadow-lg"
            >
              <span>Proceed to Checkout Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 py-1"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Notification Toast Banner
function ToastNotification() {
  const { toast } = useWebsite();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-white text-xs font-semibold shadow-2xl">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

// Internal Section Renderer
function WebsiteSectionsList({ config, theme }) {
  const sections = Array.isArray(config.sections) ? config.sections : [];

  return (
    <div
      style={{
        backgroundColor: theme.backgroundColor || (theme.isDark ? '#0b0f19' : '#ffffff'),
        color: theme.textColor || (theme.isDark ? '#f9fafb' : '#111827'),
        fontFamily: theme.fontFamily || 'Inter, sans-serif',
        minHeight: '100%',
        width: '100%',
      }}
      className="transition-colors duration-300 overflow-x-hidden"
    >
      {sections.map((section, index) => {
        const rawType = section.type || '';
        const typeKey = rawType.toLowerCase().replace(/_/g, '');
        const Component = NORMALIZED_COMPONENT_MAP[typeKey] || COMPONENT_MAP[rawType];
        if (!Component) {
          return null;
        }

        let sectionProps = section.props || {};
        if (typeof sectionProps === 'string') {
          try {
            sectionProps = JSON.parse(sectionProps);
          } catch (e) {
            sectionProps = {};
          }
        }

        // Support manually customized component styles without theme overwrite:
        // If the section has customStyle, merge it on top of global theme!
        const effectiveTheme = {
          ...theme,
          ...(section.customStyle || {}),
        };

        const sectionId = section.id || `sec-${rawType.toLowerCase()}-${index}`;

        return (
          <div
            key={sectionId}
            id={sectionId}
            className="relative"
            style={section.customStyle ? { ...section.customStyle } : undefined}
          >
            <Component props={sectionProps} theme={effectiveTheme} />
          </div>
        );
      })}

      <CartDrawer theme={theme} />
      <ToastNotification />
    </div>
  );
}

export default function WebsiteRenderer({ config }) {
  if (!config) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No website configuration loaded.
      </div>
    );
  }

  const theme = config.theme || {
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    backgroundColor: '#0b0f19',
    textColor: '#f9fafb',
    cardBackground: '#111827',
    borderRadius: '12px',
    isDark: true,
  };

  return (
    <WebsiteProvider config={config}>
      <WebsiteSectionsList config={config} theme={theme} />
    </WebsiteProvider>
  );
}
