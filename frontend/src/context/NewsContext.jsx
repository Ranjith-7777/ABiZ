import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NewsContext = createContext(null);

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eco, setEco] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [newsStats, setNewsStats] = useState(null);

  const fetchNews = async (enhanced = false) => {
    try {
      setLoading(true);
      const endpoint = enhanced ? '/api/news/daily-briefing?enhanced=true' : '/api/news/daily-briefing';
      const [newsRes, ecoRes] = await Promise.all([
        axios.get(endpoint),
        axios.get('/api/eco')
      ]);
      
      setArticles(newsRes.data.articles || []);
      setNewsStats(newsRes.data.stats || null);
      setEco(ecoRes.data || null);
      setLastUpdated(new Date());
      setError(null);
      
      console.log(`News updated: ${newsRes.data.articles?.length || 0} articles loaded`);
      if (newsRes.data.enhanced) {
        console.log('Enhanced mode: AI validation and link verification enabled');
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load latest briefing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = () => {
    fetchNews(isLiveMode);
  };

  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    fetchNews(!isLiveMode);
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      if (!cancelled) {
        await fetchNews(isLiveMode);
      }
    }

    fetchAll();

    // Set up auto-refresh for live mode
    let interval;
    if (isLiveMode) {
      interval = setInterval(() => {
        if (!cancelled) {
          fetchNews(true);
        }
      }, 30 * 60 * 1000); // Refresh every 30 minutes in live mode
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [isLiveMode]);

  const value = { 
    articles, 
    loading, 
    error, 
    eco, 
    lastUpdated,
    isLiveMode,
    newsStats,
    refreshNews,
    toggleLiveMode,
    fetchNews
  };
  
  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const ctx = useContext(NewsContext);
  if (!ctx) {
    throw new Error('useNews must be used within NewsProvider');
  }
  return ctx;
}

