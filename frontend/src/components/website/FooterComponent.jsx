import React from 'react';

export default function FooterComponent({ props = {}, theme = {} }) {
  const brandName = props.brandName || 'SaaSsum';
  const copyright = props.copyright || `© 2026 ${brandName}. All rights reserved.`;
  const links = props.links || ['Privacy Policy', 'Terms of Service', 'Security', 'Contact'];

  return (
    <footer
      style={{
        borderTop: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        backgroundColor: theme.backgroundColor || '#0b0f19',
      }}
      className="py-14 px-6 mt-16"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span style={{ color: theme.textColor || '#ffffff' }} className="font-bold text-base">
            {brandName}
          </span>
          <p style={{ color: theme.isDark ? '#9ca3af' : '#6b7280' }} className="text-xs mt-1">
            {copyright}
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          {links.map((link, idx) => (
            <a
              key={idx}
              href="#"
              style={{ color: theme.isDark ? '#9ca3af' : '#6b7280' }}
              className="text-xs hover:text-white transition-colors"
            >
              {typeof link === 'string' ? link : link.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
