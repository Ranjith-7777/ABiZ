import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
let db = null;
let storage = null;

try {
    if (!admin.apps.length) {
        // Use service account credentials from environment or file
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ?
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) :
            null;

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.FIREBASE_DATABASE_URL,
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET
            });

            db = admin.database();
            storage = admin.storage();
            console.log('✅ Firebase Admin initialized successfully');
        } else {
            console.warn('⚠️ Firebase Service Account not configured. Using Realtime Database mock.');
        }
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
}

// Mock database for fallback
const mockDB = {
    data: {},
    async ref(path) {
        return {
            set: async(value) => {
                const parts = path.split('/').filter(Boolean);
                let obj = mockDB.data;
                for (let i = 0; i < parts.length - 1; i++) {
                    obj[parts[i]] = obj[parts[i]] || {};
                    obj = obj[parts[i]];
                }
                obj[parts[parts.length - 1]] = value;
                return true;
            },
            get: async() => ({
                val: () => {
                    const parts = path.split('/').filter(Boolean);
                    let obj = mockDB.data;
                    for (const part of parts) {
                        obj = obj[part];
                        if (!obj) return null;
                    }
                    return obj;
                }
            }),
            push: async(value) => {
                const parts = path.split('/').filter(Boolean);
                let obj = mockDB.data;
                for (const part of parts) {
                    obj[part] = obj[part] || {};
                    obj = obj[part];
                }
                const id = Date.now().toString();
                obj[id] = value;
                return { key: id };
            },
            remove: async() => true,
            on: (event, callback) => {
                // Mock listener
                return () => {};
            },
            off: () => {}
        };
    }
};

const firebaseService = {
    // Save article data
    async saveArticle(article) {
        try {
            const database = db || mockDB;
            const articleRef = await database.ref(`articles/${article.id}`).set({
                ...article,
                savedAt: new Date().toISOString()
            });
            return { success: true, id: article.id };
        } catch (error) {
            console.error('Error saving article:', error);
            return { success: false, error: error.message };
        }
    },

    // Get saved articles
    async getArticles() {
        try {
            const database = db || mockDB;
            const snapshot = await database.ref('articles').get();
            const articles = snapshot.val() || {};
            return Object.values(articles);
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    },

    // Save user preference
    async saveUserPreference(userId, preference) {
        try {
            const database = db || mockDB;
            await database.ref(`users/${userId}/preferences`).set(preference);
            return { success: true };
        } catch (error) {
            console.error('Error saving preference:', error);
            return { success: false, error: error.message };
        }
    },

    // Get user preferences
    async getUserPreferences(userId) {
        try {
            const database = db || mockDB;
            const snapshot = await database.ref(`users/${userId}/preferences`).get();
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error fetching preferences:', error);
            return {};
        }
    },

    // Save video data
    async saveVideo(video) {
        try {
            const database = db || mockDB;
            const videoRef = await database.ref(`videos/${video.id}`).set({
                ...video,
                savedAt: new Date().toISOString()
            });
            return { success: true, id: video.id };
        } catch (error) {
            console.error('Error saving video:', error);
            return { success: false, error: error.message };
        }
    },

    // Get videos
    async getVideos(category = null) {
        try {
            const database = db || mockDB;
            const snapshot = await database.ref('videos').get();
            let videos = Object.values(snapshot.val() || {});

            if (category) {
                videos = videos.filter(v => v.category === category);
            }

            return videos;
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    },

    // Save quiz result
    async saveQuizResult(userId, result) {
        try {
            const database = db || mockDB;
            const resultRef = await database.ref(`quizResults/${userId}/${result.quizId}`).set({
                ...result,
                completedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('Error saving quiz result:', error);
            return { success: false, error: error.message };
        }
    },

    // Get user quiz results
    async getUserQuizResults(userId) {
        try {
            const database = db || mockDB;
            const snapshot = await database.ref(`quizResults/${userId}`).get();
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            return {};
        }
    },

    // Save leaderboard score
    async saveLeaderboardScore(userId, score, userName) {
        try {
            const database = db || mockDB;
            await database.ref(`leaderboard/${userId}`).set({
                score,
                userName,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('Error saving leaderboard score:', error);
            return { success: false, error: error.message };
        }
    },

    // Get leaderboard
    async getLeaderboard(limit = 100) {
        try {
            const database = db || mockDB;
            const snapshot = await database.ref('leaderboard').get();
            let scores = Object.entries(snapshot.val() || {})
                .map(([userId, data]) => ({ userId, ...data }))
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            return scores;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    },

    // Upload file (for videos, images)
    async uploadFile(bucket, filePath, fileBuffer, metadata = {}) {
        try {
            if (!storage) {
                return { success: false, error: 'Storage not configured' };
            }

            const file = storage.bucket(bucket).file(filePath);
            await file.save(fileBuffer, {
                metadata: {...metadata }
            });

            const publicUrl = `https://storage.googleapis.com/${bucket}/${filePath}`;
            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('Error uploading file:', error);
            return { success: false, error: error.message };
        }
    },

    // Get file download URL
    async getFileUrl(bucket, filePath) {
        try {
            if (!storage) {
                return null;
            }

            const file = storage.bucket(bucket).file(filePath);
            const urls = await file.getSignedUrl({ version: 'v4', action: 'read', expires: '03-09-2026' });
            return urls[0];
        } catch (error) {
            console.error('Error getting file URL:', error);
            return null;
        }
    },

    // Check if Firebase is configured
    isConfigured() {
        return db !== null;
    }
};

export default firebaseService;