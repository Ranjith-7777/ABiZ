import React,{useState} from 'react'

function AsbHomePage() {
const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const asbContent = [
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

  const filteredContent = asbContent.filter(item =>
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
    'Leadership': 'from-cyan-500 to-blue-600',
    'Entrepreneurship': 'from-blue-500 to-cyan-600',
    'Finance': 'from-purple-500 to-blue-600',
    'Policy & Resources': 'from-fuchsia-500 to-cyan-600',
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section - blue Theme */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white px-4 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl lg:text-5xl font-bold mb-3">Amrita School of Business, Coimbatore</h1>
          <p className="text-blue-100 lg:text-lg">Empowering leaders, entrepreneurs, and changemakers in the business world</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
          
          {/* Search Bar */}
          {/* <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search ASB Content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div> */}

          {/* Video Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg w-full max-w-4xl">
                <div className="flex justify-between items-center p-4 border-b border-border bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
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
          {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border border-cyan-200 dark:border-cyan-700 rounded-lg p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-600">30</p>
              <p className="text-sm text-muted mt-1">Years of Service</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">350</p>
              <p className="text-sm text-muted mt-1">Student Count</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-500">70%</p>
              <p className="text-sm text-muted mt-1">Placement fulfillment</p>
            </div>
          </div>
           {/* Featured Highlights */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-text">✨ Featured Specializations</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-800/20 border border-cyan-200 dark:border-cyan-700 rounded-lg p-5">
                <div className="text-2xl mb-2">👩‍💼</div>
                <h3 className="font-bold text-text mb-1">Marketing</h3>
                <p className="text-xs text-muted">Creativity and Innovation combined</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-fuchsia-100 dark:from-blue-900/20 dark:to-fuchsia-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-5">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-bold text-text mb-1">Finance</h3>
                <p className="text-xs text-muted">Paving pathways to wealth management</p>
              </div>
              <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-100 dark:from-fuchsia-900/20 dark:to-cyan-800/20 border border-fuchsia-200 dark:border-fuchsia-700 rounded-lg p-5">
                <div className="text-2xl mb-2">💎</div>
                <h3 className="font-bold text-text mb-1">Operations</h3>
                <p className="text-xs text-muted">Contributing quality in process</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-800/20 border border-cyan-200 dark:border-cyan-700 rounded-lg p-5">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-bold text-text mb-1">Analytics</h3>
                <p className="text-xs text-muted">Driving tech innovations forward</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-800/20 border border-cyan-200 dark:border-cyan-700 rounded-lg p-5">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-bold text-text mb-1">Human Resources</h3>
                <p className="text-xs text-muted">Emphasizing on employee journey</p>
              </div>
            </div>
          </div>
          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-cyan-300"
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
                    <p className="text-xs text-f dark:text-cyan-400 font-semibold">by {item.author}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 px-3 rounded-lg hover:shadow-md transition-all duration-300 text-sm"
                    >
                      ▶️ Watch
                    </button>
                    <button className="flex-1 border border-cyan-300 text-cyan-600 dark:text-cyan-400 font-semibold py-2 px-3 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-all duration-300 text-sm">
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
          
        </div>
      </div>
    </div>
  );
}

export default AsbHomePage