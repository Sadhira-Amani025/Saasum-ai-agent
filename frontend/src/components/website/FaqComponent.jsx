import React, { useState } from 'react';

export default function FaqComponent({ props = {}, theme = {} }) {
  const title = props.title || 'Frequently Asked Questions';
  const rawItems = props.items || props.faqs || props.questions || [];
  const items = rawItems.length > 0 ? rawItems : [
    { question: 'How quickly can our team launch?', answer: 'You can go live with your full e-commerce storefront in under 5 minutes.' },
    { question: 'Can we modify branding and color themes?', answer: 'Yes! Simply use the Conversational AI assistant or theme switcher to customize fonts, colors, and layout anytime.' }
  ];
  const radius = theme.borderRadius || '12px';
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2
          style={{ color: theme.textColor || '#ffffff' }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12"
        >
          {title}
        </h2>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: theme.cardBackground || '#111827',
                  borderRadius: radius,
                  border: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                }}
                className="overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-semibold text-sm transition-colors"
                  style={{ color: theme.textColor || '#ffffff' }}
                >
                  <span>{item.question}</span>
                  <span
                    style={{ color: theme.primaryColor || '#6366f1' }}
                    className="text-lg font-bold ml-4 transition-transform duration-200"
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      borderTop: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                      color: theme.isDark ? '#9ca3af' : '#4b5563',
                    }}
                    className="p-5 pt-4 text-sm leading-relaxed"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
