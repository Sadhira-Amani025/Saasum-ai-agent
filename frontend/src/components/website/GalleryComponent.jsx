import React from 'react';

export default function GalleryComponent({ props = {}, theme = {} }) {
  const title = props.title || 'Visual Showcase & Gallery';
  const subtitle = props.subtitle || 'A curated visual tour of our craft, atmosphere, and creations.';
  const rawItems = props.items || props.images || [];
  const items = rawItems.length > 0 ? rawItems : [
    { title: 'Craftsmanship In Action', category: 'Creation', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
    { title: 'Atmosphere & Design', category: 'Ambiance', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
    { title: 'Curated Selection', category: 'Collection', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' }
  ];
  const radius = theme.borderRadius || '12px';
  const borderColor = theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <section id="gallery" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            style={{ color: theme.textColor || '#ffffff' }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
          >
            {title}
          </h2>
          <p style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((it, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: theme.cardBackground || '#111827',
                borderRadius: radius,
                border: `1px solid ${borderColor}`,
              }}
              className="overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
                <img
                  src={it.imageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'}
                  alt={it.title || 'Gallery item'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="p-6">
                {it.category && (
                  <span
                    style={{ color: theme.primaryColor || '#6366f1' }}
                    className="text-xs uppercase font-bold tracking-wider block mb-1.5"
                  >
                    {it.category}
                  </span>
                )}
                <h3
                  style={{ color: theme.textColor || '#ffffff' }}
                  className="text-lg font-bold"
                >
                  {it.title}
                </h3>
                {it.description && (
                  <p style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-xs mt-2 leading-relaxed">
                    {it.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
