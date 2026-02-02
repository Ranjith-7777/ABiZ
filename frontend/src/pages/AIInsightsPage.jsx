import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext.jsx';

export default function AIInsightsPage() {
  const { articles, loading } = useNews();
  const [insights, setInsights] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Generate AI insights from current articles
  const generateInsights = () => {
    if (!articles.length) return;
    
    setAnalysisLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const techArticles = articles.filter(a => a.domains?.includes('technology'));
      const financeArticles = articles.filter(a => a.domains?.includes('finance'));
      const tradeArticles = articles.filter(a => a.domains?.includes('trade'));
      
      const insights = {
        marketSentiment: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
        confidence: Math.floor(Math.random() * 30) + 70,
        keyTrends: [
          'AI adoption accelerating across industries',
          'Sustainable finance gaining momentum',
          'Supply chain digitization trending',
          'Remote work technology evolution'
        ],
        riskFactors: [
          'Regulatory uncertainty in AI sector',
          'Geopolitical tensions affecting trade',
          'Interest rate volatility',
          'Cybersecurity concerns rising'
        ],
        opportunities: [
          'Green technology investments',
          'AI-powered automation',
          'Digital transformation services',
          'Sustainable supply chains'
        ],
        sectorAnalysis: {
          technology: {
            articles: techArticles.length,
            sentiment: 'Positive',
            growth: '+12%'
          },
          finance: {
            articles: financeArticles.length,
            sentiment: 'Neutral',
            growth: '+3%'
          },
          trade: {
            articles: tradeArticles.length,
            sentiment: 'Mixed',
            growth: '-2%'
          }
        }
      };
      
      setInsights(insights);
      setAnalysisLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (articles.length > 0) {
      generateInsights();
    }
  }, [articles]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold">AI Insights</h1>
        <p className="text-sm text-muted">Loading news data for AI analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">AI Insights</h1>
            <p className="text-sm text-muted">
              AI-powered analysis of today's business trends and market signals
            </p>
          </div>
        </div>
        
        <button
          onClick={generateInsights}
          disabled={analysisLoading}
          className="px-4 py-2 bg-accent-gradient text-white rounded-md text-sm font-semibold disabled:opacity-50"
        >
          {analysisLoading ? 'Analyzing...' : 'Refresh Analysis'}
        </button>
      </header>

      {analysisLoading && (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sm text-muted">AI is analyzing today's news patterns...</p>
        </div>
      )}

      {insights && !analysisLoading && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Market Sentiment */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-serif text-lg font-semibold mb-3">Market Sentiment</h2>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                insights.marketSentiment === 'Bullish' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {insights.marketSentiment}
              </div>
              <span className="text-sm text-muted">
                {insights.confidence}% confidence
              </span>
            </div>
          </div>

          {/* Sector Analysis */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-serif text-lg font-semibold mb-3">Sector Analysis</h2>
            <div className="space-y-2">
              {Object.entries(insights.sectorAnalysis).map(([sector, data]) => (
                <div key={sector} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{sector}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      data.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                      data.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {data.sentiment}
                    </span>
                    <span className="text-xs text-muted">{data.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Trends */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-serif text-lg font-semibold mb-3">Key Trends</h2>
            <ul className="space-y-2">
              {insights.keyTrends.map((trend, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-accent mt-1">•</span>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Factors */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-serif text-lg font-semibold mb-3">Risk Factors</h2>
            <ul className="space-y-2">
              {insights.riskFactors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-1">⚠</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="md:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="font-serif text-lg font-semibold mb-3">Investment Opportunities</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {insights.opportunities.map((opportunity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm bg-green-50 p-3 rounded-lg">
                  <span className="text-green-600">💡</span>
                  <span>{opportunity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!articles.length && !loading && (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted">
            No news data available for AI analysis. Please check the Daily Briefing first.
          </p>
        </div>
      )}

      {/* Data Sources Disclaimer */}
      {insights && !analysisLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-sm text-blue-800 mb-2">📊 Data Sources</h3>
          <p className="text-xs text-blue-700 mb-2">
            AI insights are generated from today's business news articles sourced from:
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(articles.map(a => a.sourceName))).slice(0, 8).map((source, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {source}
              </span>
            ))}
            {articles.length > 8 && (
              <span className="text-xs text-blue-600">+{articles.length - 8} more sources</span>
            )}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Analysis is AI-generated and should be used for informational purposes only.
          </p>
        </div>
      )}
    </div>
  );
}