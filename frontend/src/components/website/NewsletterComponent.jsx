import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';

export default function NewsletterComponent({ props = {}, theme = {} }) {
  const title = props.title || 'Subscribe to Our Newsletter';
  const subtitle = props.subtitle || 'Stay ahead with the latest industry insights and exclusive updates.';
  const buttonText = props.buttonText || 'Subscribe';
  const radius = theme.borderRadius || '12px';

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submittedEmail, setSubmittedEmail] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. user@domain.com).');
      return;
    }

    setError(null);
    setSubmittedEmail(email.trim());
  };

  return (
    <section id="newsletter" className="py-16 px-6">
      <div
        style={{
          backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
          borderRadius: radius,
          border: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        }}
        className="max-w-4xl mx-auto p-10 md:p-14 text-center shadow-xl"
      >
        <div
          style={{
            backgroundColor: `${theme.primaryColor || '#6366f1'}20`,
            color: theme.primaryColor || '#6366f1',
          }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Mail className="w-5 h-5" />
        </div>

        <h2
          style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
          className="text-2xl md:text-3xl font-bold mb-3"
        >
          {title}
        </h2>
        <p style={{ color: theme.isDark ? '#9ca3af' : '#4b5563' }} className="text-sm max-w-xl mx-auto mb-8">
          {subtitle}
        </p>

        {submittedEmail ? (
          <div className="p-5 max-w-md mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
            <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Subscription Captured in Local Session</span>
            </div>
            <p>
              Email <strong>{submittedEmail}</strong> recorded. In your exported website, connect your newsletter API key (e.g. Mailchimp, Loops, or Resend).
            </p>
            <button
              onClick={() => {
                setSubmittedEmail(null);
                setEmail('');
              }}
              className="text-[11px] text-emerald-400 hover:underline pt-1 block mx-auto font-semibold"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your email address..."
                style={{
                  backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : '#ffffff',
                  borderColor: error
                    ? '#f43f5e'
                    : theme.isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                  borderRadius: radius,
                  color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
                }}
                className="flex-1 px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                style={{
                  backgroundColor: theme.primaryColor || '#6366f1',
                  borderRadius: radius,
                }}
                className="px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all shrink-0 shadow-md"
              >
                {buttonText}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 text-left sm:text-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
