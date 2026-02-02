import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { getDailyBriefing, getDailyBriefingWithVerification, generateAIQuiz, getArticleStats } from './services/newsService.js';
import { getDailyQuiz } from './services/quizService.js';
import { getEcoMetrics } from './services/ecoService.js';
import { getMarketSnapshot } from './services/marketService.js';
import { verifyLink, verifyMultipleLinks, getLinkCacheStats, clearLinkCache } from './services/linkVerificationService.js';
import geminiService from './services/geminiService.js';
import firebaseService from './services/firebaseService.js';
import videoService from './services/videoService.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        services: {
            gemini: geminiService.isConfigured,
            firebase: firebaseService.isConfigured(),
            newsApis: {
                newsApiOrg: !!process.env.NEWSAPI_KEY,
                gNewsApi: !!process.env.GNEWS_API_KEY,
                newsDataIo: !!process.env.NEWSDATA_API_KEY,
                theNewsApi: !!process.env.THENEWSAPI_KEY
            },
            youtubeApi: !!process.env.YOUTUBE_API_KEY,
            totalConfiguredApis: [
                process.env.NEWSAPI_KEY,
                process.env.GNEWS_API_KEY,
                process.env.NEWSDATA_API_KEY,
                process.env.THENEWSAPI_KEY,
                process.env.YOUTUBE_API_KEY
            ].filter(Boolean).length
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/news/daily-briefing', async(req, res) => {
    try {
        const enhanced = req.query.enhanced === 'true';
        const articles = enhanced ?
            await getDailyBriefingWithVerification() :
            await getDailyBriefing();

        const stats = enhanced ? getArticleStats(articles) : null;

        res.json({
            articles,
            stats,
            enhanced,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error in /api/news/daily-briefing', err.message);
        res.status(500).json({ error: 'Failed to fetch daily briefing' });
    }
});

app.get('/api/quiz/daily', async(req, res) => {
    try {
        const articles = await getDailyBriefing();
        const useAI = req.query.ai === 'true' && geminiService.isConfigured;

        let quiz;
        if (useAI) {
            quiz = await generateAIQuiz(articles);
            if (!quiz) {
                // Fallback to traditional quiz if AI fails
                quiz = getDailyQuiz(articles);
                quiz.aiGenerated = false;
            } else {
                quiz.aiGenerated = true;
            }
        } else {
            quiz = getDailyQuiz(articles);
            quiz.aiGenerated = false;
        }

        res.json(quiz);
    } catch (err) {
        console.error('Error in /api/quiz/daily', err.message);
        res.status(500).json({ error: 'Failed to build quiz' });
    }
});

app.get('/api/eco', (_req, res) => {
    res.json(getEcoMetrics());
});

app.get('/api/market', (_req, res) => {
    res.json(getMarketSnapshot());
});

// Link verification endpoints
app.post('/api/verify/link', async(req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const isValid = await verifyLink(url);
        res.json({ url, isValid, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/verify/link', err.message);
        res.status(500).json({ error: 'Failed to verify link' });
    }
});

app.post('/api/verify/links', async(req, res) => {
    try {
        const { urls } = req.body;
        if (!Array.isArray(urls)) {
            return res.status(400).json({ error: 'URLs array is required' });
        }

        const results = await verifyMultipleLinks(urls);
        res.json({ results, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/verify/links', err.message);
        res.status(500).json({ error: 'Failed to verify links' });
    }
});

app.get('/api/verify/stats', (_req, res) => {
    try {
        const stats = getLinkCacheStats();
        res.json(stats);
    } catch (err) {
        console.error('Error in /api/verify/stats', err.message);
        res.status(500).json({ error: 'Failed to get verification stats' });
    }
});

app.delete('/api/verify/cache', (_req, res) => {
    try {
        clearLinkCache();
        res.json({ message: 'Link cache cleared', timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/verify/cache', err.message);
        res.status(500).json({ error: 'Failed to clear cache' });
    }
});

// AI-powered endpoints
app.post('/api/ai/validate-article', async(req, res) => {
    try {
        if (!geminiService.isConfigured) {
            return res.status(503).json({ error: 'Gemini AI service not configured' });
        }

        const { article } = req.body;
        if (!article) {
            return res.status(400).json({ error: 'Article data is required' });
        }

        const validation = await geminiService.validateNewsArticle(article);
        res.json({ validation, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/ai/validate-article', err.message);
        res.status(500).json({ error: 'Failed to validate article' });
    }
});

app.post('/api/ai/enhance-summary', async(req, res) => {
    try {
        if (!geminiService.isConfigured) {
            return res.status(503).json({ error: 'Gemini AI service not configured' });
        }

        const { article } = req.body;
        if (!article) {
            return res.status(400).json({ error: 'Article data is required' });
        }

        const enhancedSummary = await geminiService.enhanceArticleSummary(article);
        res.json({
            original: article.summary,
            enhanced: enhancedSummary,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error in /api/ai/enhance-summary', err.message);
        res.status(500).json({ error: 'Failed to enhance summary' });
    }
});

app.post('/api/ai/generate-alternative', async(req, res) => {
    try {
        if (!geminiService.isConfigured) {
            return res.status(503).json({ error: 'Gemini AI service not configured' });
        }

        const { article, reason } = req.body;
        if (!article) {
            return res.status(400).json({ error: 'Article data is required' });
        }

        const alternative = await geminiService.generateAlternativeContent(article, reason);
        res.json({ alternative, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error in /api/ai/generate-alternative', err.message);
        res.status(500).json({ error: 'Failed to generate alternative content' });
    }
});

// Placeholder: saved articles would be user-specific once auth is added
app.get('/api/saved', (_req, res) => {
    res.json({ saved: [] });
});

// Video endpoints
app.get('/api/videos/women-in-business', async(req, res) => {
    try {
        const useCache = req.query.cache !== 'false';
        const videos = await videoService.getWomenInBusinessVideos(useCache);
        res.json({
            videos,
            category: 'women-in-business',
            count: videos.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching women in business videos:', err.message);
        res.status(500).json({ error: 'Failed to fetch women in business videos' });
    }
});

app.get('/api/videos/sustainability', async(req, res) => {
    try {
        const useCache = req.query.cache !== 'false';
        const videos = await videoService.getSustainabilityVideos(useCache);
        res.json({
            videos,
            category: 'sustainability',
            count: videos.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching sustainability videos:', err.message);
        res.status(500).json({ error: 'Failed to fetch sustainability videos' });
    }
});

app.get('/api/videos/featured', async(req, res) => {
    try {
        const featured = await videoService.getFeaturedVideos();
        res.json({
            featured,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching featured videos:', err.message);
        res.status(500).json({ error: 'Failed to fetch featured videos' });
    }
});

app.get('/api/videos/search', async(req, res) => {
    try {
        const { q: query, category } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({ error: 'Query must be at least 2 characters' });
        }

        const results = await videoService.searchVideos(query, category);
        res.json({
            results,
            query,
            count: results.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error searching videos:', err.message);
        res.status(500).json({ error: 'Failed to search videos' });
    }
});

// Database endpoints
app.post('/api/db/save-article', async(req, res) => {
    try {
        const { article } = req.body;
        if (!article || !article.id) {
            return res.status(400).json({ error: 'Article with ID is required' });
        }

        const result = await firebaseService.saveArticle(article);
        res.json({ result, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error saving article:', err.message);
        res.status(500).json({ error: 'Failed to save article' });
    }
});

app.get('/api/db/articles', async(req, res) => {
    try {
        const articles = await firebaseService.getArticles();
        res.json({
            articles,
            count: articles.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching articles:', err.message);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.post('/api/db/user-preference', async(req, res) => {
    try {
        const { userId, preference } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await firebaseService.saveUserPreference(userId, preference);
        res.json({ result, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error saving preference:', err.message);
        res.status(500).json({ error: 'Failed to save preference' });
    }
});

app.get('/api/db/user-preference/:userId', async(req, res) => {
    try {
        const { userId } = req.params;
        const preferences = await firebaseService.getUserPreferences(userId);
        res.json({
            userId,
            preferences,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching preferences:', err.message);
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
});

app.post('/api/db/quiz-result', async(req, res) => {
    try {
        const { userId, result } = req.body;
        if (!userId || !result) {
            return res.status(400).json({ error: 'User ID and result are required' });
        }

        const saveResult = await firebaseService.saveQuizResult(userId, result);
        res.json({ saveResult, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Error saving quiz result:', err.message);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
});

app.get('/api/db/leaderboard', async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 100;
        const leaderboard = await firebaseService.getLeaderboard(limit);
        res.json({
            leaderboard,
            count: leaderboard.length,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching leaderboard:', err.message);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// Placeholder: saved articles would be user-specific once auth is added
app.get('/api/saved', (_req, res) => {
    res.json({ saved: [] });
});

app.listen(PORT, () => {
    console.log(`BizAI backend listening on http://localhost:${PORT}`);
});