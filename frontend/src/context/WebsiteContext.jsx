import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const WebsiteContext = createContext(null);

export function WebsiteProvider({ children, config }) {
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Prefilled contact form subject/message (e.g. from pricing plan or checkout)
  const [inquiryPrefill, setInquiryPrefill] = useState('');

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  }, []);

  const addToCart = useCallback((product) => {
    if (!product) return;
    const cleanPrice = typeof product.price === 'string'
      ? parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
      : Number(product.price) || 0;

    const itemId = product.id || product.name;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          name: product.name || 'Selected Item',
          price: product.price || '$24.00',
          numericPrice: cleanPrice,
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ];
    });

    showToast(`Added "${product.name || 'Item'}" to your cart!`, 'success');
  }, [showToast]);

  const updateQuantity = useCallback((id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, it) => acc + it.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(() => {
    const total = cartItems.reduce((acc, it) => acc + it.numericPrice * it.quantity, 0);
    return `$${total.toFixed(2)}`;
  }, [cartItems]);

  // Search functionality: searches across config sections (products, features, faq, gallery, services)
  const performSearch = useCallback(
    (query) => {
      const q = (query || '').trim().toLowerCase();
      setSearchQuery(query);
      if (!q) {
        setSearchResults([]);
        return;
      }

      const results = [];
      const sections = config?.sections || [];

      sections.forEach((sec) => {
        const props = sec.props || {};
        const secId = sec.id;
        const secType = sec.type;

        // Products search
        const products = props.products || props.items || [];
        if (Array.isArray(products)) {
          products.forEach((p) => {
            const name = (p.name || p.title || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            if (name.includes(q) || desc.includes(q)) {
              results.push({
                title: p.name || p.title,
                snippet: p.description || p.price || '',
                sectionId: secId || 'products',
                sectionType: 'Product',
                price: p.price,
                imageUrl: p.imageUrl,
                item: p,
              });
            }
          });
        }

        // Features search
        const features = props.features || [];
        if (Array.isArray(features)) {
          features.forEach((f) => {
            const title = (f.title || '').toLowerCase();
            const desc = (f.description || '').toLowerCase();
            if (title.includes(q) || desc.includes(q)) {
              results.push({
                title: f.title,
                snippet: f.description || '',
                sectionId: secId || 'features',
                sectionType: 'Feature',
              });
            }
          });
        }

        // FAQ search
        const faqs = props.items || props.faqs || [];
        if (Array.isArray(faqs)) {
          faqs.forEach((faq) => {
            const question = (faq.question || '').toLowerCase();
            const answer = (faq.answer || '').toLowerCase();
            if (question.includes(q) || answer.includes(q)) {
              results.push({
                title: faq.question,
                snippet: faq.answer,
                sectionId: secId || 'faq',
                sectionType: 'FAQ',
              });
            }
          });
        }

        // Gallery search
        const galleryItems = props.items || props.images || [];
        if (Array.isArray(galleryItems)) {
          galleryItems.forEach((g) => {
            const title = (g.title || '').toLowerCase();
            const desc = (g.description || g.category || '').toLowerCase();
            if (title.includes(q) || desc.includes(q)) {
              results.push({
                title: g.title,
                snippet: g.description || g.category || '',
                sectionId: secId || 'gallery',
                sectionType: 'Gallery',
                imageUrl: g.imageUrl,
              });
            }
          });
        }
      });

      setSearchResults(results);
    },
    [config]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const scrollToSection = useCallback((targetId) => {
    if (!targetId) return;
    const cleanId = targetId.startsWith('#') ? targetId.slice(1) : targetId;

    // Try exact ID first (e.g. sec-hero-1, sec-about-1)
    let el = document.getElementById(cleanId);

    // Fallback: short name alias map for links like #hero, #about, #products, etc.
    if (!el) {
      const aliasMap = {
        hero: ['sec-hero-1', 'hero'],
        about: ['sec-about-1', 'about'],
        products: ['sec-products-1', 'products'],
        product: ['sec-products-1', 'products'],
        menu: ['sec-products-1', 'products'],
        services: ['sec-services-1', 'services'],
        features: ['sec-features-1', 'features'],
        gallery: ['sec-gallery-1', 'gallery'],
        portfolio: ['sec-gallery-1', 'gallery'],
        pricing: ['sec-pricing-1', 'pricing'],
        testimonials: ['sec-testimonials-1', 'testimonials'],
        faq: ['sec-faq-1', 'faq'],
        contact: ['sec-contact-1', 'contact'],
        newsletter: ['sec-newsletter-1', 'newsletter'],
        footer: ['sec-footer-1', 'footer'],
      };
      const tryIds = aliasMap[cleanId.toLowerCase()] || [cleanId];
      for (const tryId of tryIds) {
        el = document.getElementById(tryId);
        if (el) break;
      }
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);


  const value = {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    searchQuery,
    searchResults,
    performSearch,
    clearSearch,
    toast,
    showToast,
    inquiryPrefill,
    setInquiryPrefill,
    scrollToSection,
  };

  return <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>;
}

export function useWebsite() {
  const ctx = useContext(WebsiteContext);
  if (!ctx) {
    // Return graceful fallbacks if accessed outside provider
    return {
      cartItems: [],
      cartCount: 0,
      cartTotal: '$0.00',
      isCartOpen: false,
      setIsCartOpen: () => {},
      addToCart: () => {},
      updateQuantity: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      searchQuery: '',
      searchResults: [],
      performSearch: () => {},
      clearSearch: () => {},
      toast: null,
      showToast: () => {},
      inquiryPrefill: '',
      setInquiryPrefill: () => {},
      scrollToSection: (id) => {
        if (!id) return;
        const clean = id.startsWith('#') ? id.slice(1) : id;
        document.getElementById(clean)?.scrollIntoView({ behavior: 'smooth' });
      },
    };
  }
  return ctx;
}
