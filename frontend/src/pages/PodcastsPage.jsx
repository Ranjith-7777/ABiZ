import React, { useState } from 'react';
import YouTube from 'react-youtube';

export default function PodcastsPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const podcastCategories = {
    finance: {
      label: 'Finance',
      color: 'from-blue-500 to-blue-600',
      icon: '💰',
      podcasts: [
        {
          id: 'nagf84LEbZE',
          title: 'Financial Markets Explained',
          description: 'Deep dive into understanding stock markets and investment strategies',
          duration: '42 min',
          channel: 'Business Today',
          category: 'finance',
          thumbnail: 'https://img.youtube.com/vi/nagf84LEbZE/maxresdefault.jpg'
        },
        {
          id: 'nrVyl0awWsw',
          title: 'Crypto & Digital Assets',
          description: 'Exploring blockchain technology and cryptocurrency investments',
          duration: '38 min',
          channel: 'Financial Insights',
          category: 'finance',
          thumbnail: 'https://img.youtube.com/vi/nrVyl0awWsw/maxresdefault.jpg'
        }
      ]
    },
    startups: {
      label: 'Startups',
      color: 'from-purple-500 to-purple-600',
      icon: '🚀',
      podcasts: [
        {
          id: 'cpg78ouK54I',
          title: 'Startup Success Stories',
          description: 'Tales of founders who built billion-dollar companies from scratch',
          duration: '45 min',
          channel: 'Startup Diaries',
          category: 'startups',
          thumbnail: 'https://img.youtube.com/vi/cpg78ouK54I/maxresdefault.jpg'
        },
        {
          id: 'YIszsqhLGIs',
          title: 'Funding & Venture Capital',
          description: 'How to raise funds and navigate the VC landscape',
          duration: '35 min',
          channel: 'VC Insights',
          category: 'startups',
          thumbnail: 'https://img.youtube.com/vi/YIszsqhLGIs/maxresdefault.jpg'
        }
      ]
    },
    leadership: {
      label: 'Leadership',
      color: 'from-orange-500 to-orange-600',
      icon: '👑',
      podcasts: [
        {
          id: 'xAt1xcC6qfM',
          title: 'Leadership & Management',
          description: 'Building teams and leading organizations to success',
          duration: '40 min',
          channel: 'Leadership Academy',
          category: 'leadership',
          thumbnail: 'https://img.youtube.com/vi/xAt1xcC6qfM/maxresdefault.jpg'
        }
      ]
    }
  };

  const allPodcasts = Object.values(podcastCategories).flatMap(cat => cat.podcasts);
  const filteredPodcasts = allPodcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const opts = {
    height: '600',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">🎙️ Business Podcasts</h1>
          <p className="text-slate-300">Listen to insights from business leaders, investors, and entrepreneurs</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-8">
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search podcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
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

          {/* Categories Section */}
          {Object.entries(podcastCategories).map(([key, category]) => (
            <div key={key}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-2xl font-bold text-text">{category.label}</h2>
                <div className={`h-1 flex-1 bg-gradient-to-r ${category.color} rounded-full`}></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.podcasts.map((podcast) => (
                  <div
                    key={podcast.id}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-accent"
                  >
                    <div className="h-32 bg-gray-200 overflow-hidden relative">
                      {podcast.thumbnail ? (
                        <img 
                          src={podcast.thumbnail} 
                          alt={podcast.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                          <div className="text-white text-center">
                            <div className="text-3xl mb-2">🎧</div>
                            <p className="text-sm font-semibold">{category.label}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white text-4xl">▶️</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-text mb-2 line-clamp-2">{podcast.title}</h3>
                      <p className="text-sm text-muted mb-3 line-clamp-2">{podcast.description}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted mb-3">
                        <span>⏱️ {podcast.duration}</span>
                        <span>•</span>
                        <span>{podcast.channel}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedVideo(podcast)}
                          className="flex-1 bg-primary-gradient text-white font-semibold py-2 px-3 rounded-lg hover:shadow-md transition-all duration-300 text-sm"
                        >
                          ▶️ Play
                        </button>
                        <button className="flex-1 border border-border text-text font-semibold py-2 px-3 rounded-lg hover:bg-card-hover transition-all duration-300 text-sm">
                          💾 Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* No Results */}
          {filteredPodcasts.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No podcasts found matching "{searchQuery}"</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-accent">{allPodcasts.length}</p>
              <p className="text-sm text-muted mt-1">Total Podcasts</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-accent">3</p>
              <p className="text-sm text-muted mt-1">Categories</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-accent">180+</p>
              <p className="text-sm text-muted mt-1">Minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
