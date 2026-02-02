import axios from 'axios';
import firebaseService from './firebaseService.js';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Cache for video data
const videoCache = {
    womenInBusiness: [],
    sustainability: [],
    education: [],
    lastUpdated: 0
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Sample videos for different categories (fallback when API is not available)
const SAMPLE_VIDEOS = {
    womenInBusiness: [{
            id: 'women-business-1',
            title: 'Women Entrepreneurs: Building the Future',
            description: 'Inspiring stories of women founders and their journey in business',
            category: 'women-in-business',
            youtubeId: 'dQw4w9WgXcQ', // Replace with actual video IDs
            thumbnail: 'https://via.placeholder.com/320x180/ff1493/ffffff?text=Women+Entrepreneurs',
            duration: '15:30',
            views: 125000,
            date: '2024-01-15'
        },
        {
            id: 'women-business-2',
            title: 'Financial Independence for Women',
            description: 'Learn investment strategies and financial planning for women entrepreneurs',
            category: 'women-in-business',
            youtubeId: 'dQw4w9WgXcQ',
            thumbnail: 'https://via.placeholder.com/320x180/ff1493/ffffff?text=Financial+Independence',
            duration: '22:45',
            views: 98000,
            date: '2024-01-10'
        },
        {
            id: 'women-business-3',
            title: 'Leadership Skills for Women in Tech',
            description: 'Breaking glass ceilings in technology industry',
            category: 'women-in-business',
            youtubeId: 'dQw4w9WgXcQ',
            thumbnail: 'https://via.placeholder.com/320x180/ff1493/ffffff?text=Women+in+Tech',
            duration: '18:20',
            views: 156000,
            date: '2024-01-08'
        }
    ],
    sustainability: [{
            id: 'sustainability-1',
            title: 'Sustainable Business Practices',
            description: 'How companies are reducing carbon footprint and going green',
            category: 'sustainability',
            youtubeId: 'B-dCmbViDEQ',
            thumbnail: 'https://img.youtube.com/vi/B-dCmbViDEQ/maxresdefault.jpg',
            duration: '20:15',
            views: 234000,
            date: '2024-01-16'
        },
        {
            id: 'sustainability-2',
            title: 'Renewable Energy Solutions',
            description: 'Exploring solar, wind, and other renewable energy alternatives',
            category: 'sustainability',
            youtubeId: 'UVf2Yw7uFoE',
            thumbnail: 'https://img.youtube.com/vi/UVf2Yw7uFoE/maxresdefault.jpg',
            duration: '25:30',
            views: 189000,
            date: '2024-01-14'
        },
        {
            id: 'sustainability-3',
            title: 'Circular Economy: Zero Waste Manufacturing',
            description: 'Innovations in zero-waste production and circular business models',
            category: 'sustainability',
            youtubeId: 'UcR0uNA0y9g',
            thumbnail: 'https://img.youtube.com/vi/UcR0uNA0y9g/maxresdefault.jpg',
            duration: '19:45',
            views: 167000,
            date: '2024-01-12'
        }
    ]
};

// Search YouTube videos (requires valid API key)
async function searchYouTubeVideos(query, maxResults = 5) {
    if (!YOUTUBE_API_KEY) {
        console.warn('⚠️ YouTube API key not configured, using sample videos');
        return [];
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults,
                key: YOUTUBE_API_KEY,
                relevanceLanguage: 'en',
                regionCode: 'US',
                order: 'viewCount'
            },
            timeout: 10000
        });

        return response.data.items.map(item => ({
            youtubeId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
            channel: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt
        }));
    } catch (error) {
        console.error('Error searching YouTube:', error.message);
        return [];
    }
}

// Get video details including duration and view count
async function getVideoDetails(videoId) {
    if (!YOUTUBE_API_KEY) {
        return null;
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'statistics,contentDetails',
                id: videoId,
                key: YOUTUBE_API_KEY
            },
            timeout: 10000
        });

        if (response.data.items.length > 0) {
            const item = response.data.items[0];
            return {
                duration: item.contentDetails.duration,
                views: item.statistics.viewCount,
                likes: item.statistics.likeCount || 0,
                comments: item.statistics.commentCount || 0
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching video details:', error.message);
        return null;
    }
}

const videoService = {
    // Get videos for women in business
    async getWomenInBusinessVideos(useCache = true) {
        const now = Date.now();

        // Return cached data if still valid
        if (useCache && videoCache.womenInBusiness.length > 0 &&
            now - videoCache.lastUpdated < CACHE_DURATION) {
            return videoCache.womenInBusiness;
        }

        try {
            // Try to get from Firebase first
            const firebaseVideos = await firebaseService.getVideos('women-in-business');
            if (firebaseVideos.length > 0) {
                videoCache.womenInBusiness = firebaseVideos;
                videoCache.lastUpdated = now;
                return firebaseVideos;
            }

            // Search YouTube if API key available
            if (YOUTUBE_API_KEY) {
                const results = await searchYouTubeVideos(
                    'women entrepreneurs business leadership startup',
                    6
                );

                if (results.length > 0) {
                    const videos = results.map((video, idx) => ({
                        id: `women-business-yt-${idx}`,
                        title: video.title,
                        description: video.description,
                        category: 'women-in-business',
                        youtubeId: video.youtubeId,
                        thumbnail: video.thumbnail,
                        channel: video.channel,
                        publishedAt: video.publishedAt
                    }));

                    videoCache.womenInBusiness = videos;
                    videoCache.lastUpdated = now;

                    // Save to Firebase for future use
                    videos.forEach(v => firebaseService.saveVideo(v).catch(() => {}));

                    return videos;
                }
            }

            // Fallback to sample videos
            videoCache.womenInBusiness = SAMPLE_VIDEOS.womenInBusiness;
            videoCache.lastUpdated = now;
            return SAMPLE_VIDEOS.womenInBusiness;
        } catch (error) {
            console.error('Error fetching women in business videos:', error);
            return SAMPLE_VIDEOS.womenInBusiness;
        }
    },

    // Get sustainability videos
    async getSustainabilityVideos(useCache = true) {
        const now = Date.now();

        if (useCache && videoCache.sustainability.length > 0 &&
            now - videoCache.lastUpdated < CACHE_DURATION) {
            return videoCache.sustainability;
        }

        try {
            // Try Firebase first
            const firebaseVideos = await firebaseService.getVideos('sustainability');
            if (firebaseVideos.length > 0) {
                videoCache.sustainability = firebaseVideos;
                videoCache.lastUpdated = now;
                return firebaseVideos;
            }

            // Search YouTube
            if (YOUTUBE_API_KEY) {
                const results = await searchYouTubeVideos(
                    'sustainability green energy renewable climate change business',
                    6
                );

                if (results.length > 0) {
                    const videos = results.map((video, idx) => ({
                        id: `sustainability-yt-${idx}`,
                        title: video.title,
                        description: video.description,
                        category: 'sustainability',
                        youtubeId: video.youtubeId,
                        thumbnail: video.thumbnail,
                        channel: video.channel,
                        publishedAt: video.publishedAt
                    }));

                    videoCache.sustainability = videos;
                    videoCache.lastUpdated = now;

                    // Save to Firebase
                    videos.forEach(v => firebaseService.saveVideo(v).catch(() => {}));

                    return videos;
                }
            }

            // Fallback
            videoCache.sustainability = SAMPLE_VIDEOS.sustainability;
            videoCache.lastUpdated = now;
            return SAMPLE_VIDEOS.sustainability;
        } catch (error) {
            console.error('Error fetching sustainability videos:', error);
            return SAMPLE_VIDEOS.sustainability;
        }
    },

    // Search all videos
    async searchVideos(query, category = null) {
        try {
            if (!YOUTUBE_API_KEY) {
                // Search in sample videos
                const allSamples = [...SAMPLE_VIDEOS.womenInBusiness, ...SAMPLE_VIDEOS.sustainability];
                return allSamples.filter(v =>
                    v.title.toLowerCase().includes(query.toLowerCase()) ||
                    v.description.toLowerCase().includes(query.toLowerCase())
                );
            }

            const results = await searchYouTubeVideos(query, 10);
            return results.map((video, idx) => ({
                id: `search-${idx}`,
                title: video.title,
                description: video.description,
                youtubeId: video.youtubeId,
                thumbnail: video.thumbnail,
                channel: video.channel,
                publishedAt: video.publishedAt
            }));
        } catch (error) {
            console.error('Error searching videos:', error);
            return [];
        }
    },

    // Get featured videos for home page
    async getFeaturedVideos() {
        try {
            const women = await this.getWomenInBusinessVideos();
            const sustainability = await this.getSustainabilityVideos();

            return {
                womenInBusiness: women.slice(0, 3),
                sustainability: sustainability.slice(0, 3),
                trending: [...women, ...sustainability].slice(0, 5)
            };
        } catch (error) {
            console.error('Error fetching featured videos:', error);
            return {
                womenInBusiness: SAMPLE_VIDEOS.womenInBusiness.slice(0, 3),
                sustainability: SAMPLE_VIDEOS.sustainability.slice(0, 3),
                trending: SAMPLE_VIDEOS.womenInBusiness.concat(SAMPLE_VIDEOS.sustainability).slice(0, 5)
            };
        }
    },

    // Get video by ID
    async getVideoById(videoId) {
        const allVideos = [
            ...SAMPLE_VIDEOS.womenInBusiness,
            ...SAMPLE_VIDEOS.sustainability
        ];

        return allVideos.find(v => v.id === videoId) || null;
    }
};

export default videoService;