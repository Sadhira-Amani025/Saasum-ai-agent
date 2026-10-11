import React from 'react';

export default function ServiceCardsComponent({ props = {}, theme = {} }) {
  const title = props.title || 'Key Capabilities';
  const subtitle = props.subtitle || 'Built for high performance and continuous growth.';
  const rawServices = props.services || props.items || props.features || [];
  const services = rawServices.length > 0 ? rawServices : [
    { icon: '⚡', title: 'Lightning Performance', description: 'Engineered for instant response and smooth conversions.' },
    { icon: '🛡️', title: 'Enterprise Security', description: 'End-to-end data encryption and reliable cloud uptime.' },
    { icon: '📈', title: 'Scalable Architecture', description: 'Designed to effortlessly handle peak consumer traffic.' }
  ];
  const radius = theme.borderRadius || '12px';

  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            style={{ color: theme.textColor || '#ffffff' }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            {title}
          </h2>
          <p style={{ color: theme.isDark ? '#9ca3af' : '#4b5563' }} className="text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: theme.cardBackground || '#111827',
                borderRadius: radius,
                border: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              }}
              className="p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-3xl mb-4">{item.icon || '✨'}</div>
              <h3
                style={{ color: theme.textColor || '#ffffff' }}
                className="text-lg font-bold mb-2"
              >
                {item.title}
              </h3>
              <p style={{ color: theme.isDark ? '#9ca3af' : '#4b5563' }} className="text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
