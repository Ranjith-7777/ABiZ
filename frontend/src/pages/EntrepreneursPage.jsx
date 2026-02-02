import React, { useState } from 'react';
import YouTube from 'react-youtube';

export default function EntrepreneursPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const entrepreneurContent = [
    {
      id: 'T7olkUQYUcY',
      title: 'From Idea to IPO: Founder\'s Journey',
      description: 'Exclusive interview with successful startup founders about their journey from zero to hero. Learn about pivots, failures, and what made them succeed.',
      category: 'Founder Stories',
      duration: '52 min',
      author: 'Startup Talk',
      views: '125K',
      icon: '🚀',
      thumbnail: 'https://img.youtube.com/vi/T7olkUQYUcY/maxresdefault.jpg'
    },
    {
      id: 'eHJnEHyyN1Y',
      title: 'Venture Capital & Funding 101',
      description: 'Understanding the VC ecosystem, Series A, B, C rounds, and how to pitch your startup to investors. Real insights from leading VCs.',
      category: 'Funding',
      duration: '48 min',
      author: 'VC Insights',
      views: '98K',
      icon: '💰',
      thumbnail: 'https://img.youtube.com/vi/eHJnEHyyN1Y/maxresdefault.jpg'
    },
    {
      id: '70Bg6fkr9gI',
      title: 'Scaling Your Startup: Growth Strategies',
      description: 'How to scale from 10 to 100 employees. Strategies for product-market fit, customer acquisition, and sustainable growth.',
      category: 'Growth',
      duration: '45 min',
      author: 'Growth Academy',
      views: '156K',
      icon: '📈',
      thumbnail: 'https://img.youtube.com/vi/70Bg6fkr9gI/maxresdefault.jpg'
    }
  ];

  const filteredContent = entrepreneurContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const opts = {
    height: '600',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const categoryColors = {
    'Founder Stories': 'from-indigo-500 to-indigo-600',
    'Funding': 'from-green-500 to-green-600',
    'Growth': 'from-rose-500 to-rose-600',
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 text-white px-4 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">🚀 Entrepreneurs Hub</h1>
          <p className="text-slate-300 text-lg">Master startup ecosystems, funding strategies, and innovation trends</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search entrepreneur content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Video Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg w-full max-w-4xl">
                <div className="flex justify-between items-center p-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-text">{selectedVideo.title}</h2>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-muted hover:text-text text-xl"
                  >
                    ✕
                  </button>
                </div>
                <div className="aspect-video">
                  <YouTube videoId={selectedVideo.id} opts={opts} />
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-accent"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${categoryColors[item.category]} flex items-center justify-center`}>
                      <span className="text-5xl">{item.icon}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white text-5xl">▶️</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category Badge */}
                  <div className="inline-block mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[item.category]} text-white`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-text mb-2 line-clamp-2 text-lg">{item.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted mb-4 line-clamp-3">{item.description}</p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>⏱️ {item.duration}</span>
                      <span>•</span>
                      <span>👁️ {item.views}</span>
                    </div>
                    <p className="text-xs text-accent font-semibold">by {item.author}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold py-2 px-3 rounded-lg hover:shadow-md transition-all duration-300 text-sm"
                    >
                      ▶️ Watch
                    </button>
                    <button className="flex-1 border border-border text-text font-semibold py-2 px-3 rounded-lg hover:bg-card-hover transition-all duration-300 text-sm">
                      ⭐ Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredContent.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No content found matching "{searchQuery}"</p>
            </div>
          )}

          {/* Learning Paths */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-text">📚 Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6">
                <div className="text-3xl mb-3">1️⃣</div>
                <h3 className="font-bold text-text mb-2">Founder Stories</h3>
                <p className="text-sm text-muted">Learn from successful entrepreneurs and their journey to building billion-dollar companies</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
                <div className="text-3xl mb-3">2️⃣</div>
                <h3 className="font-bold text-text mb-2">Funding & Venture Capital</h3>
                <p className="text-sm text-muted">Understand Series funding rounds, pitch perfect investors, and navigate the VC ecosystem</p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border border-rose-200 dark:border-rose-700 rounded-lg p-6">
                <div className="text-3xl mb-3">3️⃣</div>
                <h3 className="font-bold text-text mb-2">Growth Strategies</h3>
                <p className="text-sm text-muted">Scale your startup with proven growth strategies, product-market fit, and user acquisition</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
