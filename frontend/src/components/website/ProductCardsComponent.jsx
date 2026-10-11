import React, { useState } from 'react';
import ButtonComponent from './ButtonComponent';
import { useWebsite } from '../../context/WebsiteContext';
import { ShoppingBag, Check } from 'lucide-react';

export default function ProductCardsComponent({ props = {}, theme = {} }) {
  const badge = props.badge;
  const title = props.title || 'Featured Offerings';
  const subtitle = props.subtitle || 'Explore our collection curated for quality and craftsmanship.';
  const rawProducts = props.products || props.items || (props.data && (props.data.products || props.data.items)) || [];
  const products = rawProducts.length > 0 ? rawProducts : [
    { name: 'Signature Offering', price: '$24.00', description: 'Curated for quality, reliability, and growth.', badge: 'Popular' }
  ];
  const radius = theme.borderRadius || '12px';
  const borderColor = theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const { addToCart, setIsCartOpen } = useWebsite();
  const [justAddedMap, setJustAddedMap] = useState({});

  const handleAddToCart = (p, idx) => {
    addToCart(p);
    setJustAddedMap((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setJustAddedMap((prev) => ({ ...prev, [idx]: false }));
    }, 2000);
  };

  return (
    <section id="products" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {badge && (
            <span
              style={{
                backgroundColor: `${theme.primaryColor || '#6366f1'}20`,
                color: theme.primaryColor || '#6366f1',
                borderColor: `${theme.primaryColor || '#6366f1'}40`,
              }}
              className="inline-block text-xs font-semibold px-3.5 py-1.5 rounded-full border mb-4"
            >
              {badge}
            </span>
          )}
          <h2
            style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
          >
            {title}
          </h2>
          <p style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p, idx) => {
            const isAdded = justAddedMap[idx];
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
                  borderRadius: radius,
                  border: `1px solid ${borderColor}`,
                }}
                className="overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative"
              >
                {p.imageUrl && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {p.badge && (
                      <span
                        style={{
                          backgroundColor: theme.primaryColor || '#6366f1',
                          color: '#ffffff',
                        }}
                        className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow"
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {!p.imageUrl && p.badge && (
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: `${theme.primaryColor || '#6366f1'}20`,
                            color: theme.primaryColor || '#6366f1',
                          }}
                          className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block"
                        >
                          {p.badge}
                        </span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h3
                        style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
                        className="text-xl font-bold leading-tight"
                      >
                        {p.name}
                      </h3>
                      <div
                        style={{ color: theme.primaryColor || '#6366f1' }}
                        className="text-2xl font-black shrink-0"
                      >
                        {p.price || '$24.00'}
                      </div>
                    </div>

                    <p style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-sm leading-relaxed mb-6">
                      {p.description}
                    </p>
                  </div>

                  {/* Interactive Action Controls */}
                  <div style={{ borderTop: `1px solid ${borderColor}` }} className="pt-4 mt-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p, idx)}
                      style={{
                        backgroundColor: isAdded
                          ? '#10b981'
                          : theme.primaryColor || '#6366f1',
                        borderRadius: radius,
                        color: '#ffffff',
                      }}
                      className="flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow hover:opacity-90 active:scale-95"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p);
                        setIsCartOpen(true);
                      }}
                      style={{
                        borderRadius: radius,
                        border: `1px solid ${theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                        color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
                      }}
                      className="py-2.5 px-3 text-xs font-semibold hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
