import React, { useState } from 'react';
import YouTube from 'react-youtube';

export default function WomenInBusinessPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const womenContent = [
    {
      id: 'KHq_EDi2PE8',
      title: 'Women Leaders Breaking Glass Ceilings',
      description: 'Inspiring stories of women leaders who broke barriers and transformed industries. From tech to finance, hear their power stories.',
      category: 'Leadership',
      duration: '38 min',
      author: 'Women in Power',
      views: '234K',
      icon: '👩‍💼',
      thumbnail: 'https://img.youtube.com/vi/KHq_EDi2PE8/maxresdefault.jpg'
    },
    {
      id: 'ojS6jbgo2dU',
      title: 'Women Entrepreneurs: From Startup to Success',
      description: 'Explore the journey of female founders who built successful startups. Learn about challenges overcome and lessons learned.',
      category: 'Entrepreneurship',
      duration: '42 min',
      author: 'Female Founders Hub',
      views: '189K',
      icon: '🚀',
      thumbnail: 'https://img.youtube.com/vi/ojS6jbgo2dU/maxresdefault.jpg'
    },
    {
      id: 'gFYBqZnFQ6w',
      title: 'Women in Finance: Breaking Barriers',
      description: 'How women are revolutionizing the financial industry. Insights on investment, trading, and wealth management from women pioneers.',
      category: 'Finance',
      duration: '45 min',
      author: 'Finance Today',
      views: '156K',
      icon: '💎',
      thumbnail: 'https://img.youtube.com/vi/gFYBqZnFQ6w/maxresdefault.jpg'
    },
    {
      id: '25zG9vvLUJA',
      title: 'Policies & Initiatives Supporting Women in Business',
      description: 'Understanding government policies, funding initiatives, and resources available for women entrepreneurs and business professionals.',
      category: 'Policy & Resources',
      duration: '35 min',
      author: 'Business Policy Institute',
      views: '112K',
      icon: '📋',
      thumbnail: 'https://img.youtube.com/vi/25zG9vvLUJA/maxresdefault.jpg'
    }
  ];

  const filteredContent = womenContent.filter(item =>
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
    'Leadership': 'from-rose-500 to-pink-600',
    'Entrepreneurship': 'from-pink-500 to-rose-600',
    'Finance': 'from-purple-500 to-pink-600',
    'Policy & Resources': 'from-fuchsia-500 to-rose-600',
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section - Pink Theme */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-4 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">👩‍💼 Women in Business</h1>
          <p className="text-pink-100 text-lg">Empowering women leaders, entrepreneurs, and changemakers in the business world</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search women in business content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Video Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg w-full max-w-4xl">
                <div className="flex justify-between items-center p-4 border-b border-border bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-rose-300"
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
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">by {item.author}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-2 px-3 rounded-lg hover:shadow-md transition-all duration-300 text-sm"
                    >
                      ▶️ Watch
                    </button>
                    <button className="flex-1 border border-rose-300 text-rose-600 dark:text-rose-400 font-semibold py-2 px-3 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all duration-300 text-sm">
                      ❤️ Save
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

          {/* Featured Highlights */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-text">✨ Featured Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/20 dark:to-pink-800/20 border border-rose-200 dark:border-rose-700 rounded-lg p-5">
                <div className="text-2xl mb-2">👩‍💼</div>
                <h3 className="font-bold text-text mb-1">Women Leaders</h3>
                <p className="text-xs text-muted">Inspiring leadership stories</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-fuchsia-100 dark:from-pink-900/20 dark:to-fuchsia-800/20 border border-pink-200 dark:border-pink-700 rounded-lg p-5">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-bold text-text mb-1">Entrepreneurs</h3>
                <p className="text-xs text-muted">Startup success stories</p>
              </div>
              <div className="bg-gradient-to-br from-fuchsia-50 to-rose-100 dark:from-fuchsia-900/20 dark:to-rose-800/20 border border-fuchsia-200 dark:border-fuchsia-700 rounded-lg p-5">
                <div className="text-2xl mb-2">💎</div>
                <h3 className="font-bold text-text mb-1">Finance</h3>
                <p className="text-xs text-muted">Wealth & investment</p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/20 dark:to-pink-800/20 border border-rose-200 dark:border-rose-700 rounded-lg p-5">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-bold text-text mb-1">Resources</h3>
                <p className="text-xs text-muted">Policies & support</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 border border-rose-200 dark:border-rose-700 rounded-lg p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-rose-600">{womenContent.length}</p>
              <p className="text-sm text-muted mt-1">Featured Videos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-600">4</p>
              <p className="text-sm text-muted mt-1">Content Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose-500">160+</p>
              <p className="text-sm text-muted mt-1">Total Minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
