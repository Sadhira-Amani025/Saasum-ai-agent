import React from 'react';

export default function ImageSectionComponent({ props = {}, theme = {} }) {
  const title = props.title || 'Visual Excellence';
  const description = props.description || 'Crafted with precision, high-resolution clarity, and responsive optimization.';
  const imageUrl = props.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
  const radius = theme.borderRadius || '12px';

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2
          style={{ color: theme.textColor || '#ffffff' }}
          className="text-3xl font-bold tracking-tight mb-4"
        >
          {title}
        </h2>
        <p style={{ color: theme.isDark ? '#9ca3af' : '#4b5563' }} className="text-base max-w-2xl mx-auto mb-10">
          {description}
        </p>
        <div
          style={{ borderRadius: radius }}
          className="overflow-hidden shadow-2xl border border-white/10"
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto object-cover max-h-[500px]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
