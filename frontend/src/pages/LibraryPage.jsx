import React from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useSavedArticles } from '../context/SavedArticlesContext.jsx';

export default function LibraryPage() {
  const { articles, loading, error } = useNews();
  const { isSaved, toggleSave } = useSavedArticles();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">Library</h1>
        <p className="text-sm text-muted">
          Today&apos;s briefing history. Save anything you want to revisit later.
        </p>
      </header>

      {loading && <p className="text-sm text-muted">Loading articles…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
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
                className={`px-3 py-1.5 rounded-md border text-xs font-semibold ${
                  isSaved(article.id)
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-border bg-card text-foreground'
                }`}
              >
                {isSaved(article.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {!loading && !articles.length && (
        <p className="text-sm text-muted">No articles loaded yet for today.</p>
      )}
    </div>
  );
}

