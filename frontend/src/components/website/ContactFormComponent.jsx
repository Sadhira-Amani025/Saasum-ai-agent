import React, { useState, useEffect } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import { CheckCircle2, AlertCircle, Eye, EyeOff, Send } from 'lucide-react';

export default function ContactFormComponent({ props = {}, theme = {} }) {
  const title = props.title || 'Get in Touch';
  const subtitle = props.subtitle || 'Send us a message and our team will get back to you within 24 hours.';
  const rawFields = props.fields || [
    { label: 'Full Name', type: 'text', name: 'fullName', required: true },
    { label: 'Email Address', type: 'email', name: 'email', required: true },
    { label: 'Message', type: 'textarea', name: 'message', required: true },
  ];

  const radius = theme.borderRadius || '12px';
  const borderColor = theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const { inquiryPrefill } = useWebsite();

  // Form values and validation errors state
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);

  // Initialize form fields and respond to inquiryPrefill
  useEffect(() => {
    const initial = {};
    rawFields.forEach((f) => {
      initial[f.name] = '';
    });
    if (inquiryPrefill) {
      initial['message'] = inquiryPrefill;
    }
    setFormData(initial);
  }, [rawFields, inquiryPrefill]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+()\-.\s]{7,20}$/;

    rawFields.forEach((f) => {
      const val = (formData[f.name] || '').trim();

      if (f.required && !val) {
        errors[f.name] = `${f.label} is required.`;
        return;
      }

      const fName = String(f.name || '').toLowerCase();
      const fType = String(f.type || '').toLowerCase();

      if (val) {
        if (fType === 'email' || fName.includes('email')) {
          if (!emailRegex.test(val)) {
            errors[f.name] = 'Please enter a valid email address (e.g. name@example.com).';
          }
        } else if (fType === 'tel' || fName.includes('phone')) {
          if (!phoneRegex.test(val)) {
            errors[f.name] = 'Please enter a valid phone number (at least 7 digits).';
          }
        } else if (fType === 'password' || fName.includes('password')) {
          if (val.length < 6) {
            errors[f.name] = 'Password must be at least 6 characters long.';
          }
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Capture submitted payload
    const capturedData = { ...formData };

    // Set clear, truthful submission status (no fake SMTP claims)
    setSubmissionResult({
      success: true,
      timestamp: new Date().toLocaleTimeString(),
      data: capturedData,
      note: 'Inquiry details were successfully validated and captured in your local session. Outbound email delivery requires SMTP credentials configured in the exported backend.',
    });
  };

  const handleReset = () => {
    const initial = {};
    rawFields.forEach((f) => {
      initial[f.name] = '';
    });
    setFormData(initial);
    setFormErrors({});
    setSubmissionResult(null);
  };

  const hasDirectInfo =
    subtitle.includes('Hours') ||
    subtitle.includes('Address') ||
    subtitle.includes('@') ||
    subtitle.includes('Location');

  return (
    <section id="contact" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className={`grid grid-cols-1 ${hasDirectInfo ? 'lg:grid-cols-5' : 'max-w-2xl mx-auto'} gap-10 items-start`}>
          {hasDirectInfo && (
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span
                  style={{
                    backgroundColor: `${theme.primaryColor || '#6366f1'}20`,
                    color: theme.primaryColor || '#6366f1',
                    borderColor: `${theme.primaryColor || '#6366f1'}40`,
                  }}
                  className="inline-block text-xs font-semibold px-3.5 py-1.5 rounded-full border mb-4"
                >
                  Direct Inquiries
                </span>
                <h2
                  style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
                  className="text-3xl font-extrabold tracking-tight mb-4"
                >
                  {title}
                </h2>
                <p style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-sm leading-relaxed">
                  {subtitle}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
                  borderRadius: radius,
                  border: `1px solid ${borderColor}`,
                }}
                className="p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <div className="text-xs">
                    <strong className="block text-sm" style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}>
                      Location & Service
                    </strong>
                    <span style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }}>Storefront & Digital Ordering</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">⏱️</span>
                  <div className="text-xs">
                    <strong className="block text-sm" style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}>
                      Response Commitment
                    </strong>
                    <span style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }}>Within 24 business hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
              borderRadius: radius,
              border: `1px solid ${borderColor}`,
            }}
            className={`${hasDirectInfo ? 'lg:col-span-3' : 'w-full'} p-8 md:p-10 shadow-2xl`}
          >
            {!hasDirectInfo && (
              <div className="text-center mb-8">
                <h2
                  style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
                  className="text-3xl font-extrabold tracking-tight mb-3"
                >
                  {title}
                </h2>
                <p style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-sm">
                  {subtitle}
                </p>
              </div>
            )}

            {submissionResult ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Inquiry Validated & Recorded in Local Preview</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {submissionResult.note}
                </p>

                <div className="p-3 bg-slate-950/60 rounded-lg text-xs font-mono space-y-1 text-slate-300 border border-slate-800">
                  <div className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Captured Submission Data ({submissionResult.timestamp}):
                  </div>
                  {Object.entries(submissionResult.data).map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-4">
                      <span className="text-indigo-300">{key}:</span>
                      <span className="truncate text-slate-200">{String(val || '(empty)')}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {rawFields.map((f, idx) => {
                  const errorMsg = formErrors[f.name];
                  const fName = String(f.name || '').toLowerCase();
                  const fType = String(f.type || '').toLowerCase();
                  const fLabel = String(f.label || 'Field');
                  const isPassword = fType === 'password' || fName.includes('password');
                  const showPass = showPasswordMap[f.name];

                  return (
                    <div key={idx}>
                      <label
                        style={{ color: theme.isDark ? '#e2e8f0' : '#334155' }}
                        className="block text-xs font-semibold mb-1.5"
                      >
                        {fLabel} {f.required && <span className="text-rose-400">*</span>}
                      </label>

                      {fType === 'textarea' ? (
                        <textarea
                          name={f.name}
                          rows={4}
                          value={formData[f.name] || ''}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          placeholder={`Enter your ${fLabel.toLowerCase()}...`}
                          style={{
                            borderRadius: radius,
                            backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : '#ffffff',
                            borderColor: errorMsg
                              ? '#f43f5e'
                              : theme.isDark
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(0,0,0,0.1)',
                            color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
                          }}
                          className="w-full px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <div className="relative">
                          <input
                            type={isPassword ? (showPass ? 'text' : 'password') : (f.type || 'text')}
                            name={f.name}
                            value={formData[f.name] || ''}
                            onChange={(e) => handleInputChange(f.name, e.target.value)}
                            placeholder={`Enter ${fLabel.toLowerCase()}...`}
                            style={{
                              borderRadius: radius,
                              backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : '#ffffff',
                              borderColor: errorMsg
                                ? '#f43f5e'
                                : theme.isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.1)',
                              color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
                            }}
                            className="w-full px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {isPassword && (
                            <button
                              type="button"
                              onClick={() => setShowPasswordMap((prev) => ({ ...prev, [f.name]: !showPass }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      )}

                      {errorMsg && (
                        <div className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  type="submit"
                  style={{
                    backgroundColor: theme.primaryColor || '#6366f1',
                    borderRadius: radius,
                  }}
                  className="w-full text-white font-semibold py-3.5 px-6 text-sm transition-all hover:opacity-90 active:scale-[0.99] mt-2 shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
