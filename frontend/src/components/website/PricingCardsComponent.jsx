import React from 'react';
import ButtonComponent from './ButtonComponent';
import { useWebsite } from '../../context/WebsiteContext';

export default function PricingCardsComponent({ props = {}, theme = {} }) {
  const title = props.title || 'Simple, Transparent Pricing';
  const subtitle = props.subtitle || 'No hidden fees. Scale up or cancel anytime with zero lock-in.';
  const rawPlans = props.plans || props.pricing || props.tiers || props.items || [];
  const plans = rawPlans.length > 0 ? rawPlans : [
    { name: 'Standard', price: '$29', period: '/month', description: 'Essential tools for teams.', popular: false, ctaText: 'Select Plan', features: ['Core features', 'Standard support'] },
    { name: 'Professional', price: '$79', period: '/month', description: 'For growing businesses.', popular: true, ctaText: 'Start Pro', features: ['All features', 'Priority support', 'Analytics'] },
    { name: 'Enterprise', price: '$199', period: '/month', description: 'Custom scale infrastructure.', popular: false, ctaText: 'Contact Sales', features: ['Dedicated SLA', 'Custom domain', '24/7 Access'] }
  ];
  const radius = theme.borderRadius || '12px';

  const { setInquiryPrefill, scrollToSection, showToast } = useWebsite();

  const handleSelectPlan = (plan) => {
    setInquiryPrefill(`I would like to inquire about subscribing to the ${plan.name} plan (${plan.price}${plan.period || ''}).`);
    showToast(`Selected "${plan.name}" plan — details loaded into inquiry form.`, 'success');
    scrollToSection('contact');
  };

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            {title}
          </h2>
          <p style={{ color: theme.isDark ? '#9ca3af' : '#4b5563' }} className="text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => {
            const isPopular = plan.popular;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
                  borderRadius: radius,
                  border: isPopular
                    ? `2px solid ${theme.primaryColor || '#6366f1'}`
                    : `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                  boxShadow: isPopular ? `0 0 32px ${theme.primaryColor || '#6366f1'}25` : 'none',
                }}
                className="p-8 flex flex-col justify-between relative transition-all hover:-translate-y-1"
              >
                {isPopular && (
                  <span
                    style={{
                      backgroundColor: theme.primaryColor || '#6366f1',
                      color: '#ffffff',
                    }}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                  >
                    Most Popular
                  </span>
                )}

                <div>
                  <h3
                    style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
                    className="text-xl font-bold mb-2"
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 my-4">
                    <span
                      style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
                      className="text-4xl font-extrabold tracking-tight"
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{ color: theme.isDark ? '#9ca3af' : '#6b7280' }}
                      className="text-sm font-medium"
                    >
                      {plan.period || '/mo'}
                    </span>
                  </div>
                  <p
                    style={{ color: theme.isDark ? '#9ca3af' : '#4b5563' }}
                    className="text-sm mb-6"
                  >
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-sm" style={{ color: theme.isDark ? '#d1d5db' : '#374151' }}>
                        <span style={{ color: theme.primaryColor || '#6366f1' }} className="font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    style={{
                      backgroundColor: isPopular ? (theme.primaryColor || '#6366f1') : 'transparent',
                      color: isPopular ? '#ffffff' : (theme.textColor || '#ffffff'),
                      border: isPopular ? 'none' : `1px solid ${theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                      borderRadius: radius,
                    }}
                    className="w-full py-3 px-4 text-sm font-semibold transition-all hover:opacity-90 active:scale-98"
                  >
                    {plan.ctaText || 'Get Started'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
