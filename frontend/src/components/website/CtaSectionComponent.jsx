import React from 'react';
import ButtonComponent from './ButtonComponent';

export default function CtaSectionComponent({ props = {}, theme = {} }) {
  const badge = props.badge;
  const title = props.title || 'Ready to Elevate Your Experience?';
  const subtitle = props.subtitle || 'Connect with our team today and discover how our solutions can transform your daily operations.';
  const primaryCta = props.primaryCta || 'Get in Touch';
  const primaryCtaHref = props.primaryCtaHref || '#contact';
  const secondaryCta = props.secondaryCta;
  const secondaryCtaHref = props.secondaryCtaHref || '#products';
  const radius = theme.borderRadius || '16px';

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          style={{
            backgroundColor: theme.cardBackground || '#111827',
            borderRadius: radius,
            borderColor: theme.primaryColor || '#6366f1',
          }}
          className="p-10 md:p-14 text-center border shadow-2xl relative overflow-hidden"
        >
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

          <p
            style={{ color: theme.isDark ? '#cbd5e1' : '#475569' }}
            className="text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          >
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonComponent text={primaryCta} href={primaryCtaHref} variant="primary" theme={theme} />
            {secondaryCta && (
              <ButtonComponent text={secondaryCta} href={secondaryCtaHref} variant="outline" theme={theme} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
