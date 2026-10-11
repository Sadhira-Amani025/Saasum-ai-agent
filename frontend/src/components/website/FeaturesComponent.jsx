import React from 'react';

export default function FeaturesComponent({ props = {}, theme = {} }) {
  const badge = props.badge;
  const title = props.title || 'Engineered for Excellence';
  const subtitle = props.subtitle || 'Every detail designed with precision, intentionality, and craftsmanship.';
  const features = Array.isArray(props.features) ? props.features : [
    { icon: '✨', title: 'Premium Craftsmanship', description: 'Engineered using the finest components and materials available.' },
    { icon: '⚡', title: 'Sub-Second Velocity', description: 'Streamlined workflows designed to deliver immediate results.' },
    { icon: '🛡️', title: 'Lifelong Reliability', description: 'Tested extensively for dependable daily performance and peace of mind.' }
  ];
  const radius = theme.borderRadius || '12px';
  const borderColor = theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <section id="features" className="py-20 md:py-28 px-6">
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
          {features.map((f, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: theme.cardBackground || '#111827',
                borderRadius: radius,
                border: `1px solid ${borderColor}`,
              }}
              className="p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div
                  style={{
                    backgroundColor: `${theme.primaryColor || '#6366f1'}15`,
                    color: theme.primaryColor || '#6366f1',
                  }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner"
                >
                  {f.icon || '✨'}
                </div>
                <h3
                  style={{ color: theme.textColor || '#ffffff' }}
                  className="text-xl font-bold mb-3"
                >
                  {f.title}
                </h3>
                <p style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
