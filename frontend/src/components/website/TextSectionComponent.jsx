import React from 'react';

export default function TextSectionComponent({ props = {}, theme = {} }) {
  const title = props.title || 'About Our Mission';
  const subtitle = props.subtitle;
  const content = props.content || 'We build next-generation commerce tooling engineered to turn bold business ideas into thriving digital enterprises.';

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2
          style={{ color: theme.textColor || '#ffffff' }}
          className="text-3xl font-bold tracking-tight mb-4"
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ color: theme.primaryColor || '#6366f1' }} className="text-sm font-semibold mb-6">
            {subtitle}
          </p>
        )}
        <p style={{ color: theme.isDark ? '#9ca3af' : '#4b5563' }} className="text-base leading-relaxed">
          {content}
        </p>
      </div>
    </section>
  );
}
