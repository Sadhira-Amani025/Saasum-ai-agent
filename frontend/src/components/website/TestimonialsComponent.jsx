import React from 'react';

export default function TestimonialsComponent({ props = {}, theme = {} }) {
  const badge = props.badge || 'Sample Customer Experience';
  const title = props.title || 'What Our Patrons Say';
  const subtitle = props.subtitle || 'Reflections and impressions shared by our community.';
  const rawItems = props.items || props.testimonials || props.reviews || [];
  const items = rawItems.length > 0 ? rawItems : [
    { quote: 'Outstanding quality and incredible attention to detail. Exceeded all our expectations.', author: 'Alex Turner', role: 'Patron' },
    { quote: 'The most responsive and thoughtful experience we have encountered.', author: 'Claire Dupont', role: 'Regular Guest' }
  ];
  const radius = theme.borderRadius || '12px';
  const borderColor = theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#f59e0b',
              borderColor: 'rgba(245, 158, 11, 0.25)',
            }}
            className="inline-block text-[11px] font-bold px-3 py-1 rounded-full border mb-4 uppercase tracking-wider"
          >
            {badge}
          </span>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((t, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: theme.cardBackground || '#111827',
                borderRadius: radius,
                border: `1px solid ${borderColor}`,
              }}
              className="p-8 md:p-10 flex flex-col justify-between transition-all hover:shadow-xl relative"
            >
              <div className="text-3xl text-amber-500/40 font-serif leading-none mb-3">“</div>
              <p
                style={{ color: theme.isDark ? '#e2e8f0' : '#334155' }}
                className="text-base md:text-lg italic leading-relaxed mb-6"
              >
                {t.quote}
              </p>
              <div className="border-t pt-4" style={{ borderColor }}>
                <div
                  style={{ color: theme.textColor || '#ffffff' }}
                  className="font-bold text-sm"
                >
                  {t.author}
                </div>
                <div style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-xs mt-0.5">
                  {t.role} {t.company && `• ${t.company}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
