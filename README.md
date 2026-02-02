# BizAI - Business Intelligence Platform with Video & Database

A comprehensive full-stack business intelligence application with integrated video library, database persistence, and direct source integration for business news.

## 🚀 Features

### 🎥 Video Features (NEW V1.1)
- **Women in Business Section** - Dedicated page with pink theme for women entrepreneurs
- **Sustainability Videos** - Green-themed educational content on sustainable business
- **YouTube Integration** - Real videos when API configured, sample videos as fallback
- **Video Player** - Modal player with full-screen support
- **Video Search** - Find specific videos across categories
- **Metadata** - View count, duration, channel, publish date

### 💾 Database Features (NEW V1.1)
- **Firebase Integration** - Free Realtime Database for data persistence
- **Article Saving** - Save important news articles
- **User Preferences** - Store viewing preferences and settings
- **Quiz Results** - Track learning progress
- **Leaderboard** - Competitive scoring with persistent storage
- **In-Memory Fallback** - Works without database configuration

### Core Features
- **Direct Source Integration**: Fetches news from 10+ business sources
- **RSS Feed Aggregation**: Real-time updates from trusted sources
- **Interactive Quiz System**: AI-generated and traditional questions
- **Market Analytics**: Real-time market data
- **Environmental Tracking**: ESG scores and sustainability metrics
- **User Authentication**: Student ID-based login
- **Games & Engagement**: 6 interactive business games
- **AI Insights**: Market analysis and trend predictions
- **Sustainability Dashboard**: Environmental impact tracking
- **Link Verification**: Automated URL verification
- **AI Content Validation**: Gemini AI credibility scoring

## 🛠 Technology Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for responsive design
- **Axios** for API communication
- **Firebase** for real-time data
- **react-youtube** for video embedding

### Backend
- **Node.js** with Express.js
- **Firebase Admin SDK** for database
- **YouTube Data API** for videos
- **Gemini AI** for content validation
- **Axios** for external APIs
- **Morgan** for logging

## 🎯 Quick Start

### No Configuration Needed
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

Visit http://localhost:5173 - Works with sample data!

### Add News APIs (Recommended)
Get free API keys from:
- NewsAPI.org
- GNews API
- NewsData.io  
- TheNewsAPI

Create `backend/.env`:
```
NEWSAPI_KEY=your_key
GNEWS_API_KEY=your_key
NEWSDATA_API_KEY=your_key
THENEWSAPI_KEY=your_key
```

### Add YouTube Videos
Get key from Google Cloud Console, add to `.env`:
```
YOUTUBE_API_KEY=your_key
```

### Add Database (Optional)
Firebase free tier:
```
FIREBASE_SERVICE_ACCOUNT=your_json
FIREBASE_DATABASE_URL=your_url
FIREBASE_STORAGE_BUCKET=your_bucket
```

### Add AI (Optional)
Get Gemini API key from aistudio.google.com:
```
GEMINI_API_KEY=your_key
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed configuration
- **[FEATURES.md](./FEATURES.md)** - Complete feature list
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What's new in V1.1

## 🎨 Themes & Sections

### Default Sections
- **Daily Briefing** - Aggregated business news (gold/amber theme)
- **Library** - Browse article categories
- **Saved Articles** - Your bookmarked content
- **Market Data** - Real-time market analytics
- **AI Insights** - AI-powered analysis (blue theme)
- **Leaderboard** - User rankings by points
- **Daily Quiz** - Test your knowledge
- **Games** - Interactive business games

### New in V1.1
- **Women in Business** 👩‍💼 - Pink theme (#ff1493)
  - Women entrepreneurs and leaders
  - Financial independence
  - Leadership skills
  - Business growth strategies
  
- **Sustainability** 🌱 - Green theme (#228B22)
  - Environmental impact tracking
  - Green business practices
  - Carbon footprint metrics
  - ESG scoring
  - Sustainability videos

### Color Scheme
```
Primary Blue:     #1e3a8a  (Charts, headers)
Accent Gold:      #d97706  (Highlights)
Success Green:    #228B22  (Sustainability)
Women Pink:       #ff1493  (Women in Business)
Neutral Gray:     #6b7280  (Text, borders)
```

## 📰 News Sources

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key (optional but recommended)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys (Gemini optional)
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=4000
ECO_PAPERS_BASE=12847
ECO_CO2_PER_PAPER=200
```

## 🔧 API Endpoints

### News & Content
- `GET /api/news/daily-briefing` - Aggregated business news
- `GET /api/news/daily-briefing?enhanced=true` - News with AI validation
- `GET /api/quiz/daily?ai=true` - AI-generated quiz questions

### Videos (NEW V1.1)
- `GET /api/videos/women-in-business` - Women entrepreneurs videos
- `GET /api/videos/sustainability` - Sustainability education videos
- `GET /api/videos/featured` - Featured videos across categories
- `GET /api/videos/search?q=query` - Search video library

### Database (NEW V1.1)
- `POST /api/db/save-article` - Save article to database
- `GET /api/db/articles` - Get saved articles
- `POST /api/db/user-preference` - Store user preferences
- `GET /api/db/user-preference/:userId` - Get preferences
- `POST /api/db/quiz-result` - Save quiz results
- `GET /api/db/leaderboard` - Get leaderboard rankings

### Link Verification
- `POST /api/verify/link` - Verify single URL
- `POST /api/verify/links` - Verify multiple URLs
- `GET /api/verify/stats` - Verification statistics
- `DELETE /api/verify/cache` - Clear cache

### AI Services
- `POST /api/ai/validate-article` - Validate credibility
- `POST /api/ai/enhance-summary` - Improve summary
- `POST /api/ai/generate-alternative` - Generate content

### System
- `GET /api/health` - Service status and configuration
- `GET /api/market` - Market data snapshot
- `GET /api/eco` - Environmental metrics

## 🔐 Authentication System

### Student ID Format
- Format: `cb.sc.u4aie24***` (where *** are 3 digits)
- Case insensitive
- Username equals password for simplicity
- Examples: `cb.sc.u4aie24001`, `CB.SC.U4AIE24999`

### User Features
- Profile management with statistics
- Points system for quiz participation
- Leaderboard rankings
- Saved articles functionality

## 🎮 Interactive Games

1. **Business Trivia** - Multiple choice questions
2. **Market Predictor** - Predict market movements
3. **Headline Scramble** - Unscramble business headlines
4. **News Bingo** - Find keywords in articles
5. **Speed Reader Challenge** - Timed reading comprehension
6. **Sentiment Analysis** - Analyze article sentiment

## 🤖 AI Integration

### Gemini AI Features
- **Content Validation**: Credibility scoring (1-10 scale)
- **Link Recovery**: Generate alternative content for broken links
- **Summary Enhancement**: Improve article readability
- **Quiz Generation**: Create contextual quiz questions
- **Source Verification**: Validate news source credibility

### Fallback Mechanisms
- Graceful degradation when AI services are unavailable
- Cached fallback content for offline scenarios
- Traditional quiz generation as AI backup
- Direct homepage links when RSS feeds fail

## 🔍 RSS Feed Integration

### Features
- **Real-time Parsing**: Automatic RSS feed processing
- **Multi-source Aggregation**: Combines feeds from 10+ sources
- **Content Extraction**: Intelligent title, summary, and link extraction
- **Error Handling**: Robust fallback to homepage links
- **Caching**: Efficient content caching and refresh cycles

### Supported Feed Formats
- Standard RSS 2.0
- Atom feeds
- Custom business feed formats
- CDATA content handling

## 📊 Monitoring & Analytics

### Content Analytics
- Article source distribution
- Link verification success rates
- Domain-wise content analysis
- User engagement metrics
- RSS feed health monitoring

### Performance Metrics
- Feed parsing success rates
- Content freshness indicators
- Source availability tracking
- User interaction patterns

## 🚀 Production Deployment

### Environment Setup
1. Configure Gemini API key for AI features (optional)
2. Ensure RSS feed accessibility
3. Configure proper CORS settings
4. Set up monitoring for source availability

### Performance Optimizations
- Intelligent RSS feed caching
- Batch processing for content aggregation
- Graceful error handling and fallbacks
- Optimized content parsing

## 👥 Development Team

**Created by:**
- Naga Shiva D
- Kaushal Reddy S  
- Ranjith Raja B

**Contact:** teambizai@gmail.com

## 📄 License

© 2026 BizAI. Built with ❤️ for educational purposes.

---

## 📋 Quick Start Guide

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd bizai
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Optionally add Gemini API key to .env
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Health Check: http://localhost:4000/api/health

5. **Login**
   - Use format: `cb.sc.u4aie24001` (username = password)
   - Explore business news from major sources!

---

*This version aggregates news directly from major business websites and RSS feeds, providing reliable access to business content without dependency on third-party news APIs.*