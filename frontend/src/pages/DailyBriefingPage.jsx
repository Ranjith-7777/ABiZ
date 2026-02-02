import React, { useMemo, useState } from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useSavedArticles } from '../context/SavedArticlesContext.jsx';

function ArticleCard({ article, onToggleSave, isSaved, featured = false }) {
  const getValidationBadge = () => {
    if (article.isGenerated) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          🤖 AI Generated
        </span>
      );
    }
    if (article.linkValid === false) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ⚠️ Link Issue
        </span>
      );
    }
    if (article.linkValid === true) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ Verified
        </span>
      );
    }
    return null;
  };

  const getAPISourceBadge = () => {
    if (article.apiSource && article.apiSource !== 'Fallback') {
      const colors = {
        'NewsAPI.org': 'bg-purple-100 text-purple-800',
        'GNews API': 'bg-blue-100 text-blue-800',
        'NewsData.io': 'bg-green-100 text-green-800',
        'TheNewsAPI.com': 'bg-orange-100 text-orange-800'
      };
      
      const colorClass = colors[article.apiSource] || 'bg-gray-100 text-gray-800';
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          📡 {article.apiSource}
        </span>
      );
    }
    return null;
  };

  const getCredibilityScore = () => {
    if (article.credibilityScore) {
      const score = Math.round(article.credibilityScore);
      const color = score >= 8 ? 'text-green-600' : score >= 6 ? 'text-yellow-600' : 'text-red-600';
      return (
        <span className={`text-xs font-medium ${color}`}>
          📊 {score}/10
        </span>
      );
    }
    return null;
  };

  return (
    <article
      className={`flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      {article.imageUrl && (
        <div className={`${featured ? 'md:w-1/2' : 'w-full'} bg-slate-200`}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className={`${featured ? 'h-full' : 'h-48'} w-full object-cover`}
          />
        </div>
      )}
      <div className="p-4 md:p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 text-xs text-muted">
          <a 
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            {article.sourceName}
          </a>
          <div className="flex items-center gap-2 flex-wrap">
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            {getValidationBadge()}
            {getAPISourceBadge()}
          </div>
        </div>
        <h3 className="font-serif text-lg md:text-xl font-semibold leading-snug">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-sm text-muted leading-relaxed line-clamp-3">{article.summary}</p>
        )}
        {article.disclaimer && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            ℹ️ {article.disclaimer}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-muted">{article.readMinutes} min read</span>
            {getCredibilityScore()}
          </div>
          <div className="flex gap-2">
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-md bg-accent-gradient text-white text-xs font-semibold"
            >
              Read at source
            </a>
            <button
              type="button"
              onClick={() => onToggleSave(article)}
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold ${
                isSaved
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-border bg-card text-foreground'
              }`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DailyBriefingPage() {
  const { articles, loading, error, newsStats, isLiveMode, toggleLiveMode } = useNews();
  const { isSaved, toggleSave } = useSavedArticles();

  const [selectedDomain, setSelectedDomain] = useState('all');

  const availableDomains = useMemo(() => {
    const set = new Set();
    articles.forEach((a) => {
      (a.domains || []).forEach((d) => {
        if (d !== 'general') set.add(d);
      });
    });
    return Array.from(set).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedDomain === 'all') return articles;
    return articles.filter((a) => (a.domains || []).includes(selectedDomain));
  }, [articles, selectedDomain]);

  const [topStory, ...rest] = filteredArticles;
  const quickReads = rest.slice(0, 3);
  const moreArticles = rest.slice(3);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">
              Daily Briefing
              {isLiveMode && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🔴 LIVE
                </span>
              )}
            </h1>
            <p className="text-sm text-muted">
              Live business headlines from NewsAPI.org, GNews API, NewsData.io, and TheNewsAPI.com.
            </p>
          </div>
          <button
            onClick={toggleLiveMode}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${
              isLiveMode 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-300 bg-gray-50 text-gray-700'
            }`}
            title={isLiveMode ? 'Auto-refreshes every 30 minutes' : 'Manual refresh only'}
          >
            {isLiveMode ? 'Live Mode ON (30min)' : 'Live Mode OFF'}
          </button>
        </div>

        {newsStats && (
          <div className="flex flex-wrap gap-4 text-xs text-muted bg-gray-50 p-3 rounded-lg">
            <span>📊 {newsStats.total} articles</span>
            <span>✅ {newsStats.verified} verified</span>
            {newsStats.failed > 0 && <span>⚠️ {newsStats.failed} link issues</span>}
            {newsStats.generated > 0 && <span>🤖 {newsStats.generated} AI generated</span>}
            {newsStats.avgCredibility > 0 && (
              <span>🎯 Avg credibility: {Math.round(newsStats.avgCredibility)}/10</span>
            )}
            {newsStats.apiDistribution && Object.keys(newsStats.apiDistribution).length > 0 && (
              <span>📡 APIs: {Object.entries(newsStats.apiDistribution).map(([api, count]) => `${api}(${count})`).join(', ')}</span>
            )}
          </div>
        )}

        {availableDomains.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedDomain('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                selectedDomain === 'all'
                  ? 'bg-accent-gradient text-white border-transparent'
                  : 'border-border text-muted hover:border-accent hover:text-accent'
              }`}
            >
              All
            </button>
            {availableDomains.map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                  selectedDomain === domain
                    ? 'bg-accent-gradient text-white border-transparent'
                    : 'border-border text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        )}
      </header>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          Loading news from multiple APIs (NewsAPI, GNews, NewsData, TheNewsAPI)…
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !articles.length && (
        <p className="text-sm text-muted">No articles available right now. Please try again.</p>
      )}

      {topStory && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Top Story</h2>
            <span className="text-xs text-muted">From {topStory.sourceName}</span>
          </div>
          <ArticleCard
            article={topStory}
            featured
            onToggleSave={toggleSave}
            isSaved={isSaved(topStory.id)}
          />
        </section>
      )}

      {quickReads.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Quick Reads</h2>
            <span className="text-xs text-muted">Under 5 minutes each</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {quickReads.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggleSave={toggleSave}
                isSaved={isSaved(article.id)}
              />
            ))}
          </div>
        </section>
      )}

      {moreArticles.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">More from today</h2>
            <span className="text-xs text-muted">
              Showing {moreArticles.length} more {selectedDomain === 'all' ? '' : selectedDomain}{' '}
              articles
            </span>
          </div>
          <div className="space-y-3">
            {moreArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggleSave={toggleSave}
                isSaved={isSaved(article.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

