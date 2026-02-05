import React from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function TopBar() {
  const { eco, articles, lastUpdated, isLiveMode, refreshNews, loading } = useNews();
  const { user, isAuthenticated } = useAuth();

  const formatLastUpdated = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 lg:py-4">
        {/* Logo & Branding Section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Mobile Logo */}
          <div className="lg:hidden">
            <img 
              src="/assets/bizai-logo.png" 
              alt="BizAI Connect Logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:block">
            <img 
              src="/assets/bizai-logo.png" 
              alt="BizAI Connect Logo"
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Center Info */}
        <div className="hidden lg:block flex-1 mx-6">
          <p className="font-semibold text-sm text-text text-blue-100">
            Welcome, {isAuthenticated && user ? user.displayName : 'Guest'}.
          </p>
          <div className="flex items-center gap-4 mt-1">
            {articles.length > 0 && (
              <p className="text-xs text-muted">
                📰 {Array.from(new Set(articles.map(a => a.sourceName))).length} sources
              </p>
            )}
            {lastUpdated && (
              <p className="text-xs text-muted">
                🔄 {formatLastUpdated(lastUpdated)}
              </p>
            )}
            {isLiveMode && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-semibold">LIVE</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={refreshNews}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            title="Refresh news"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="hidden md:block text-right px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20">
            <p className="text-xs text-muted">CO₂ Saved</p>
            <p className="text-sm font-bold text-green-600">
              {eco ? eco.co2SavedFormatted : '–'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

