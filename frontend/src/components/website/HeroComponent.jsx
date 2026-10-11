import React from 'react';
import ButtonComponent from './ButtonComponent';

export default function HeroComponent({ props = {}, theme = {} }) {
  const badge = props.badge;
  const title = props.title || 'Empower Your Business';
  const subtitle = props.subtitle || 'Transform your digital presence with high-converting layouts and automated intelligence.';
  const primaryCta = props.primaryCta || 'Start Free Trial';
  const primaryCtaHref = props.primaryCtaHref || '#pricing';
  const secondaryCta = props.secondaryCta || 'Explore Features';
  const secondaryCtaHref = props.secondaryCtaHref || '#features';
  const extraButtons = props.extraButtons || [];
  const imageUrl = props.imageUrl;
  const radius = theme.borderRadius || '16px';

  return (
    <section id="hero" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`grid grid-cols-1 ${imageUrl ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-16 items-center text-left`}>
          <div className={imageUrl ? '' : 'max-w-4xl mx-auto text-center'}>
            {badge && (
              <span
                style={{
                  backgroundColor: `${theme.primaryColor || '#6366f1'}20`,
                  color: theme.primaryColor || '#6366f1',
                  borderColor: `${theme.primaryColor || '#6366f1'}40`,
                }}
                className="inline-block text-xs font-semibold px-3.5 py-1.5 rounded-full border mb-6"
              >
                {badge}
              </span>
            )}

            <h1
              style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-none mb-6"
            >
              {title}
            </h1>

            <p
              style={{ color: theme.isDark ? '#cbd5e1' : '#475569' }}
              className="text-lg md:text-xl mb-10 leading-relaxed max-w-2xl"
            >
              {subtitle}
            </p>

            <div className={`flex flex-wrap items-center gap-4 ${imageUrl ? '' : 'justify-center'}`}>
              <ButtonComponent text={primaryCta} href={primaryCtaHref} variant="primary" theme={theme} />
              {secondaryCta && (
                <ButtonComponent text={secondaryCta} href={secondaryCtaHref} variant="outline" theme={theme} />
              )}
              {extraButtons.map((btn, idx) => (
                <ButtonComponent
                  key={idx}
                  text={btn.text}
                  href={btn.href}
                  variant={btn.variant || 'outline'}
                  theme={theme}
                />
              ))}
            </div>
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
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80';
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
