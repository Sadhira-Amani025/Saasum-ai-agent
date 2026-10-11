import React, { useState } from 'react';
import ButtonComponent from './ButtonComponent';
import { useWebsite } from '../../context/WebsiteContext';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';


export default function NavbarComponent({ props = {}, theme = {} }) {
  const brandName = props.brandName || 'SaaSsum';
  const links = props.links || [];
  const ctaText = props.ctaText || 'Get Started';
  const ctaHref = props.ctaHref || '#pricing';
  const extraButtons = props.extraButtons || [];

  const showSearch = props.showSearch === true || props.showSearch === 'true';
  const searchPlaceholder = props.searchPlaceholder || 'Search...';
  const [searchInput, setSearchInput] = useState('');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen, scrollToSection, performSearch, clearSearch } = useWebsite();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      performSearch(searchInput.trim());
    } else {
      clearSearch();
    }
  };


  const handleLinkClick = (e, href) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      style={{
        backgroundColor: theme.backgroundColor || (theme.isDark ? '#0b0f19' : '#ffffff'),
        borderBottom: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
      }}
      className="sticky top-0 z-40 backdrop-blur-md transition-colors"
    >
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
          className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          {brandName}
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link, idx) => {
            const linkText = typeof link === 'string' ? link : (link?.text || link?.label || link?.name || 'Link');
            const linkHref = typeof link === 'string'
              ? `#${link.toLowerCase().replace(/\s+/g, '')}`
              : (link?.href || link?.url || link?.to ||
                (linkText ? `#${String(linkText).toLowerCase().replace(/\s+/g, '')}` : '#'));
            return (
              <a
                key={idx}
                href={linkHref}
                onClick={(e) => handleLinkClick(e, linkHref)}
                className="text-sm font-medium transition-colors hover:opacity-100"
                style={{
                  color: theme.isDark ? '#9ca3af' : '#4b5563',
                }}
              >
                {linkText}
              </a>
            );
          })}
        </nav>

        {/* Inline Search Bar (desktop) */}
        {showSearch && (
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-1.5"
          >
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search"
              style={{
                backgroundColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
                borderColor: theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                borderRadius: theme.borderRadius || '10px',
              }}
              className="text-xs px-3 py-2 border w-44 focus:outline-none focus:ring-1 focus:ring-current transition-all"
            />
            <button
              type="submit"
              style={{ color: theme.textColor || (theme.isDark ? '#9ca3af' : '#6b7280') }}
              className="p-1.5 hover:opacity-100 transition-opacity"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Action Controls: Cart Badge + CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Shopping Cart"
            style={{
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
              color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
            className="relative p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span
                style={{
                  backgroundColor: theme.primaryColor || '#6366f1',
                  color: '#ffffff',
                }}
                className="absolute -top-1.5 -right-1.5 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary CTA Button */}
          <div className="hidden sm:flex items-center gap-2">
            <ButtonComponent text={ctaText} href={ctaHref} variant="primary" theme={theme} />
            {extraButtons.map((btn, bIdx) => (
              <ButtonComponent
                key={bIdx}
                text={btn.text}
                href={btn.href}
                variant={btn.variant || 'outline'}
                theme={theme}
              />
            ))}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
            }}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
            borderBottom: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
          className="md:hidden px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-3">
            {links.map((link, idx) => {
              const linkText = typeof link === 'string' ? link : (link?.text || link?.label || link?.name || 'Link');
              const linkHref = typeof link === 'string'
                ? `#${link.toLowerCase().replace(/\s+/g, '')}`
                : (link?.href || link?.url || link?.to ||
                  (linkText ? `#${String(linkText).toLowerCase().replace(/\s+/g, '')}` : '#'));
              return (
                <a
                  key={idx}
                  href={linkHref}
                  onClick={(e) => handleLinkClick(e, linkHref)}
                  className="text-sm font-semibold py-1.5 transition-colors"
                  style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
                >
                  {linkText}
                </a>
              );
            })}
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search"
                style={{
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
                  borderColor: theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                  borderRadius: theme.borderRadius || '10px',
                }}
                className="flex-1 text-xs px-3 py-2 border focus:outline-none transition-all"
              />
              <button type="submit" aria-label="Submit search" style={{ color: theme.textColor || '#9ca3af' }}>
                <Search className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <ButtonComponent
              text={ctaText}
              href={ctaHref}
              variant="primary"
              theme={theme}
              className="w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            />
            {extraButtons.map((btn, bIdx) => (
              <ButtonComponent
                key={bIdx}
                text={btn.text}
                href={btn.href}
                variant={btn.variant || 'outline'}
                theme={theme}
                className="w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
