import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext.jsx';
import axios from 'axios';

export default function SustainabilityPage() {
  const { articles, eco } = useNews();
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    // Generate sustainability insights
    const sustainabilityArticles = articles.filter(a => 
      a.title?.toLowerCase().includes('green') ||
      a.title?.toLowerCase().includes('sustainable') ||
      a.title?.toLowerCase().includes('climate') ||
      a.title?.toLowerCase().includes('carbon') ||
      a.title?.toLowerCase().includes('renewable') ||
      a.summary?.toLowerCase().includes('environment')
    );

    const data = {
      sustainabilityNews: sustainabilityArticles,
      esgScore: Math.floor(Math.random() * 30) + 70,
      carbonFootprint: {
        daily: Math.floor(Math.random() * 50) + 20,
        monthly: Math.floor(Math.random() * 1000) + 500,
        yearly: Math.floor(Math.random() * 10000) + 5000
      },
      greenInitiatives: [
        {
          title: 'Digital-First Reading',
          description: 'Reducing paper consumption through digital news consumption',
          impact: 'High',
          status: 'Active'
        },
        {
          title: 'Carbon Offset Program',
          description: 'Offsetting digital infrastructure carbon footprint',
          impact: 'Medium',
          status: 'Planned'
        },
        {
          title: 'Green Energy Usage',
          description: 'Powering servers with renewable energy sources',
          impact: 'High',
          status: 'In Progress'
        },
        {
          title: 'Sustainable Partnerships',
          description: 'Partnering with eco-conscious news sources',
          impact: 'Medium',
          status: 'Active'
        }
      ],
      impactMetrics: [
        {
          metric: 'Trees Saved',
          value: Math.floor((eco?.papersSaved || 0) * 0.017),
          unit: 'trees',
          icon: '🌳'
        },
        {
          metric: 'Water Saved',
          value: Math.floor((eco?.papersSaved || 0) * 2.5),
          unit: 'liters',
          icon: '💧'
        },
        {
          metric: 'Energy Saved',
          value: Math.floor((eco?.papersSaved || 0) * 0.5),
          unit: 'kWh',
          icon: '⚡'
        },
        {
          metric: 'Waste Reduced',
          value: Math.floor((eco?.papersSaved || 0) * 0.1),
          unit: 'kg',
          icon: '♻️'
        }
      ]
    };

    setSustainabilityData(data);
  }, [articles, eco]);

  useEffect(() => {
    fetchSustainabilityVideos();
  }, []);

  const fetchSustainabilityVideos = async () => {
    try {
      setVideoLoading(true);
      const response = await axios.get('http://localhost:4000/api/videos/sustainability');
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Error fetching sustainability videos:', error);
      setVideos([]);
    } finally {
      setVideoLoading(false);
    }
  };

  const VideoModal = ({ video, onClose }) => {
    if (!video) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-foreground truncate">
              {video.title}
            </h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground transition text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* YouTube Embed */}
            {video.youtubeId && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* Video Info */}
            <div className="space-y-3">
              <p className="text-sm text-muted">{video.description}</p>

              <div className="flex flex-wrap gap-2 text-xs">
                {video.channel && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    📺 {video.channel}
                  </span>
                )}
                {video.views && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    👁️ {parseInt(video.views).toLocaleString()} views
                  </span>
                )}
                {video.duration && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    ⏱️ {video.duration}
                  </span>
                )}
                {video.publishedAt && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    📅 {new Date(video.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!sustainabilityData) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Sustainability</h1>
        <p className="text-sm text-muted">Loading sustainability data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white text-sm">🌱</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Sustainability & Green Impact
            </h1>
            <p className="text-sm text-muted">
              Track your environmental impact and learn about sustainable business practices
            </p>
          </div>
        </div>
      </header>

      {/* Environmental Impact Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sustainabilityData.impactMetrics.map((metric, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{metric.icon}</div>
            <p className="text-2xl font-bold text-green-600">
              {metric.value.toLocaleString()}
            </p>
            <p className="text-xs text-muted">{metric.unit}</p>
            <p className="text-sm font-medium mt-1">{metric.metric}</p>
          </div>
        ))}
      </div>

      {/* Sustainability Videos Section */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-foreground">🎥 Learn About Sustainability</h2>
        <p className="text-sm text-muted">Watch videos from experts about green practices and sustainable business</p>

        {videoLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.slice(0, 6).map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative bg-green-100 aspect-video overflow-hidden">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-200 to-emerald-400">
                      <span className="text-4xl">🌍</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <span className="text-white text-4xl">▶️</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-foreground line-clamp-2 hover:text-green-600">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted line-clamp-2">
                    {video.description}
                  </p>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    {video.channel && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {video.channel.substring(0, 20)}
                      </span>
                    )}
                    {video.views && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        👁️ {parseInt(video.views / 1000)}k
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(video);
                    }}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted">
            <p>No sustainability videos available yet</p>
          </div>
        )}
      </div>



      

      {/* ESG Score */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="font-serif text-lg font-semibold mb-2">ESG Score</h2>
            <p className="text-sm text-muted">
              Environmental, Social, and Governance performance indicator
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xl font-bold text-green-600">
                {sustainabilityData.esgScore}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${sustainabilityData.esgScore}%` }}
          ></div>
        </div>
      </div>




      {/* Carbon Footprint */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-serif text-lg font-semibold mb-4">Carbon Footprint Saved</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {sustainabilityData.carbonFootprint.daily}g
            </p>
            <p className="text-sm text-muted">Daily</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {sustainabilityData.carbonFootprint.monthly}g
            </p>
            <p className="text-sm text-muted">Monthly</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {(sustainabilityData.carbonFootprint.yearly / 1000).toFixed(1)}kg
            </p>
            <p className="text-sm text-muted">Yearly</p>
          </div>
        </div>
      </div>

      {/* Green Initiatives */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-serif text-lg font-semibold mb-4">Green Initiatives</h2>
        <div className="space-y-4">
          {sustainabilityData.greenInitiatives.map((initiative, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{initiative.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    initiative.status === 'Active' ? 'bg-green-100 text-green-700' :
                    initiative.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {initiative.status}
                  </span>
                </div>
                <p className="text-xs text-muted mb-2">{initiative.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">Impact:</span>
                  <span className={`text-xs font-semibold ${
                    initiative.impact === 'High' ? 'text-green-600' :
                    initiative.impact === 'Medium' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {initiative.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability News */}
      {sustainabilityData.sustainabilityNews.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-serif text-lg font-semibold mb-4">
            Sustainability in the News ({sustainabilityData.sustainabilityNews.length})
          </h2>
          <div className="space-y-3">
            {sustainabilityData.sustainabilityNews.slice(0, 3).map((article) => (
              <div key={article.id} className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-sm mb-1">{article.title}</h3>
                <p className="text-xs text-muted mb-2">{article.sourceName}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  Read more →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sustainability Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
        <h2 className="font-serif text-lg font-semibold mb-4 text-green-800">
          💡 Sustainability Tips
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="text-sm">
            <strong>Digital Reading:</strong> Continue reading news digitally to save paper and reduce carbon footprint.
          </div>
          <div className="text-sm">
            <strong>Share Knowledge:</strong> Share important articles instead of printing them.
          </div>
          <div className="text-sm">
            <strong>Green Choices:</strong> Support companies with strong ESG commitments.
          </div>
          <div className="text-sm">
            <strong>Stay Informed:</strong> Keep up with sustainability trends in business.
          </div>
        </div>
      </div>

      {/* Environmental Data Sources */}
      {eco && eco.sources && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h2 className="font-serif text-lg font-semibold mb-4 text-green-800">
            📚 Environmental Data Sources
          </h2>
          <p className="text-sm text-green-700 mb-3">
            Our environmental impact calculations are based on peer-reviewed research:
          </p>
          <div className="space-y-2">
            {eco.sources.map((source, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-green-700 hover:text-green-800 hover:underline"
                >
                  {source.label}
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-green-600 mt-3">
            CO₂ calculations assume {eco.assumptions?.co2PerPaperGrams || 200}g CO₂e per newspaper avoided.
          </p>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}