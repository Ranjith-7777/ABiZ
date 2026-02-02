import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MarketPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get('/api/market');
        if (!cancelled) {
          setData(res.data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load market snapshot.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">Market Data</h1>
        <p className="text-sm text-muted">
          Lightweight snapshot of key indices. These values are served from the backend and can be
          wired to a live market API later.
        </p>
      </header>

      {loading && <p className="text-sm text-muted">Loading market data…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            {data.indices.map((idx) => {
              const positive = !idx.changePercent.startsWith('-');
              return (
                <div
                  key={idx.name}
                  className="bg-card border border-border rounded-xl px-4 py-3 text-center"
                >
                  <p className="text-xs text-muted mb-1">{idx.name}</p>
                  <p className="text-lg font-semibold">{idx.value}</p>
                  <p
                    className={`text-sm font-semibold ${
                      positive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {idx.changePercent}%
                  </p>
                </div>
              );
            })}
          </div>
          <section className="bg-card border border-border rounded-xl p-4 md:p-6">
            <h2 className="font-serif text-lg font-semibold mb-2">Performance Overview</h2>
            <p className="text-xs text-muted mb-4">
              Last updated {new Date(data.lastUpdated).toLocaleTimeString()}.
            </p>
            <div className="h-40 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-muted">
              Simple chart placeholder – plug in Recharts or another charting lib later.
            </div>
          </section>

          {/* Market Data Sources */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h3 className="font-semibold text-sm text-yellow-800 mb-2">📈 Market Data Sources</h3>
            <p className="text-xs text-yellow-700 mb-2">
              Current market data is simulated for demonstration purposes. In production, this would be sourced from:
            </p>
            <div className="grid gap-2 md:grid-cols-2 text-xs">
              <div>
                <strong>S&P 500, NASDAQ, DJIA:</strong> 
                <a href="https://finance.yahoo.com" target="_blank" rel="noreferrer" className="text-yellow-800 hover:underline ml-1">
                  Yahoo Finance →
                </a>
              </div>
              <div>
                <strong>FTSE 100:</strong> 
                <a href="https://www.londonstockexchange.com" target="_blank" rel="noreferrer" className="text-yellow-800 hover:underline ml-1">
                  London Stock Exchange →
                </a>
              </div>
              <div>
                <strong>Alternative:</strong> 
                <a href="https://www.alphavantage.co" target="_blank" rel="noreferrer" className="text-yellow-800 hover:underline ml-1">
                  Alpha Vantage API →
                </a>
              </div>
              <div>
                <strong>Real-time data:</strong> 
                <a href="https://finnhub.io" target="_blank" rel="noreferrer" className="text-yellow-800 hover:underline ml-1">
                  Finnhub API →
                </a>
              </div>
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              ⚠️ Demo values only - not for investment decisions
            </p>
          </div>
        </>
      )}
    </div>
  );
}

