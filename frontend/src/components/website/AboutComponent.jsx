import React from 'react';

export default function AboutComponent({ props = {}, theme = {} }) {
  const badge = props.badge;
  const title = props.title || 'Our Heritage & Philosophy';
  const content = props.content || props.story || 'Founded with a passion for excellence, we craft every detail with uncompromising care and devotion to authentic quality.';
  const highlights = Array.isArray(props.highlights) ? props.highlights : [];
  const imageUrl = props.imageUrl;
  const radius = theme.borderRadius || '12px';

  return (
    <section id="about" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`grid grid-cols-1 ${imageUrl ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-16 items-center`}>
          <div>
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
              style={{ color: theme.textColor || '#ffffff' }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight"
            >
              {title}
            </h2>

            <p
              style={{ color: theme.isDark ? '#cbd5e1' : '#475569' }}
              className="text-base md:text-lg leading-relaxed mb-8"
            >
              {content}
            </p>

            {highlights.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t"
                style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              >
                {highlights.map((h, idx) => (
                  <div key={idx} className="border-l-2 pl-3.5" style={{ borderColor: theme.primaryColor || '#6366f1' }}>
                    <div style={{ color: theme.textColor || '#ffffff' }} className="text-2xl font-black">
                      {h.value}
                    </div>
                    <div style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-xs uppercase font-semibold mt-0.5 tracking-wider">
                      {h.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="relative">
              <div
                style={{
                  borderRadius: radius,
                  overflow: 'hidden',
                  border: `1px solid ${theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
                className="shadow-2xl aspect-[4/3] bg-slate-800"
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
