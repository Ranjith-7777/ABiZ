import React from 'react';
import { useSavedArticles } from '../context/SavedArticlesContext.jsx';

export default function SavedPage() {
  const { savedArticles, toggleSave } = useSavedArticles();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">Saved Articles</h1>
        <p className="text-sm text-muted">
          Articles you&apos;ve bookmarked. These are stored locally in your browser for now.
        </p>
      </header>

      {savedArticles.length === 0 && (
        <p className="text-sm text-muted">
          You haven&apos;t saved anything yet. Use the &quot;Save&quot; button on any article in the
          briefing or library pages.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {savedArticles.map((article) => (
          <article
            key={article.id}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-xs text-muted">
              <a 
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                {article.sourceName}
              </a>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <h2 className="font-serif text-lg font-semibold">{article.title}</h2>
            {article.summary && (
              <p className="text-sm text-muted line-clamp-3">{article.summary}</p>
            )}
            <div className="mt-auto flex items-center justify-between gap-3 text-sm">
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="text-accent font-semibold"
              >
                Open source →
              </a>
              <button
                type="button"
                onClick={() => toggleSave(article)}
                className="px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-xs font-semibold text-red-700"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

