import React, { useState } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import { Search, X, ArrowUpRight } from 'lucide-react';

export default function SearchInputComponent({ props = {}, theme = {} }) {
  const placeholder = props.placeholder || 'Search products, collections, or resources...';
  const buttonText = props.buttonText || 'Search';
  const radius = theme.borderRadius || '12px';

  const [inputVal, setInputVal] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { performSearch, searchResults, clearSearch, scrollToSection } = useWebsite();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    performSearch(inputVal);
    setHasSearched(true);
  };

  const handleClear = () => {
    setInputVal('');
    clearSearch();
    setHasSearched(false);
  };

  return (
    <section id="search" className="py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (!e.target.value) {
                  clearSearch();
                  setHasSearched(false);
                }
              }}
              placeholder={placeholder}
              style={{
                backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
                borderRadius: radius,
                border: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
                color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827'),
              }}
              className="w-full pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            {inputVal && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

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
        </form>

        {/* Live Search Results Container */}
        {hasSearched && (
          <div
            style={{
              backgroundColor: theme.cardBackground || (theme.isDark ? '#111827' : '#ffffff'),
              borderRadius: radius,
              border: `1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
            className="mt-4 p-5 shadow-2xl space-y-3 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
              <span>
                Found <strong>{searchResults.length}</strong> matching item{searchResults.length !== 1 ? 's' : ''} for "{inputVal}"
              </span>
              <button onClick={handleClear} className="text-indigo-400 hover:underline">
                Close Results
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-400">
                No matching catalog items, features, or questions found. Try searching for other keywords.
              </div>
            ) : (
              <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                {searchResults.map((res, rIdx) => (
                  <div
                    key={rIdx}
                    className="py-3 flex items-center justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          style={{
                            backgroundColor: `${theme.primaryColor || '#6366f1'}20`,
                            color: theme.primaryColor || '#6366f1',
                          }}
                          className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                        >
                          {res.sectionType}
                        </span>
                        <h4
                          style={{ color: theme.textColor || (theme.isDark ? '#ffffff' : '#111827') }}
                          className="font-bold text-sm"
                        >
                          {res.title}
                        </h4>
                        {res.price && (
                          <span className="text-xs font-semibold text-emerald-400">{res.price}</span>
                        )}
                      </div>
                      <p style={{ color: theme.isDark ? '#94a3b8' : '#64748b' }} className="text-xs line-clamp-1">
                        {res.snippet}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollToSection(res.sectionId)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 flex items-center gap-1 shrink-0"
                    >
                      <span>Jump</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
