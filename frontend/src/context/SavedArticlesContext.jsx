import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'bizai_saved_articles_v1';

const SavedArticlesContext = createContext(null);

export function SavedArticlesProvider({ children }) {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedArticles(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedArticles));
    } catch {
      // ignore
    }
  }, [savedArticles]);

  const isSaved = (id) => savedArticles.some((a) => a.id === id);

  const toggleSave = (article) => {
    setSavedArticles((prev) => {
      if (prev.some((a) => a.id === article.id)) {
        return prev.filter((a) => a.id !== article.id);
      }
      return [...prev, article];
    });
  };

  return (
    <SavedArticlesContext.Provider value={{ savedArticles, isSaved, toggleSave }}>
      {children}
    </SavedArticlesContext.Provider>
  );
}

export function useSavedArticles() {
  const ctx = useContext(SavedArticlesContext);
  if (!ctx) {
    throw new Error('useSavedArticles must be used within SavedArticlesProvider');
  }
  return ctx;
}

