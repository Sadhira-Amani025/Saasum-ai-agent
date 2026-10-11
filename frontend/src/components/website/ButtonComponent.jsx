import React from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import { MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function ButtonComponent({
  text = 'Click Here',
  href = '#',
  variant = 'primary',
  theme = {},
  onClick,
  className = '',
  item = null, // Optional product object if button is buy now / add to cart
}) {
  const { addToCart, scrollToSection, setIsCartOpen } = useWebsite();

  const textStr = typeof text === 'string' ? text : String(text || '');
  const isWhatsApp =
    variant === 'whatsapp' ||
    textStr.toLowerCase().includes('whatsapp');

  const isBuyNow =
    variant === 'buynow' ||
    textStr.toLowerCase().includes('add to cart') ||
    textStr.toLowerCase().includes('buy now') ||
    textStr.toLowerCase().includes('order now');

  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  const primaryColor = theme.primaryColor || '#6366f1';
  const secondaryColor = theme.secondaryColor || '#a855f7';
  const radius = theme.borderRadius || '8px';

  let style;
  if (isWhatsApp) {
    style = {
      backgroundColor: '#25D366',
      color: '#ffffff',
      borderRadius: radius,
      border: 'none',
      boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
    };
  } else if (isOutline) {
    style = {
      border: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
      color: theme.textColor || '#ffffff',
      borderRadius: radius,
      backgroundColor: 'transparent',
    };
  } else if (isSecondary) {
    style = {
      backgroundColor: secondaryColor,
      color: '#ffffff',
      borderRadius: radius,
      border: 'none',
      boxShadow: `0 4px 14px ${secondaryColor}40`,
    };
  } else {
    style = {
      backgroundColor: primaryColor,
      color: '#ffffff',
      borderRadius: radius,
      border: 'none',
      boxShadow: `0 4px 14px ${primaryColor}40`,
    };
  }

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }

    if (isBuyNow && item) {
      e.preventDefault();
      addToCart(item);
      return;
    }

    if (isWhatsApp) {
      if (href && href.startsWith('http')) {
        // Open WhatsApp link
        return;
      }
      e.preventDefault();
      window.open('https://wa.me/?text=Hello!%20I%20am%20interested%20in%20your%20services.', '_blank', 'noopener,noreferrer');
      return;
    }

    if (href && href.startsWith('#')) {
      e.preventDefault();
      if (href === '#' || href === '#cart') {
        setIsCartOpen(true);
      } else {
        scrollToSection(href);
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={style}
      target={isWhatsApp && href.startsWith('http') ? '_blank' : undefined}
      rel={isWhatsApp && href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 transition-all hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none ${className}`}
    >
      {isWhatsApp && <MessageCircle className="w-4 h-4 shrink-0" />}
      {isBuyNow && item && <ShoppingBag className="w-4 h-4 shrink-0" />}
      <span>{text}</span>
      {!isWhatsApp && !isBuyNow && variant === 'primary' && (
        <ArrowRight className="w-3.5 h-3.5 opacity-80 shrink-0" />
      )}
    </a>
  );
}
