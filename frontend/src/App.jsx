import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import Footer from './components/Footer.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import LoginForm from './components/LoginForm.jsx';
import DailyBriefingPage from './pages/DailyBriefingPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import MarketPage from './pages/MarketPage.jsx';
import AIInsightsPage from './pages/AIInsightsPage.jsx';
import SustainabilityPage from './pages/SustainabilityPage.jsx';
import WomenInBusinessPage from './pages/WomenInBusinessPage.jsx';
import PodcastsPage from './pages/PodcastsPage.jsx';
import EntrepreneursPage from './pages/EntrepreneursPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import GamesPage from './pages/GamesPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { NewsProvider } from './context/NewsContext.jsx';
import { SavedArticlesProvider } from './context/SavedArticlesContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

const PAGES = {
  home: 'home',
  library: 'library',
  saved: 'saved',
  market: 'market',
  ai: 'ai',
  podcasts: 'podcasts',
  women: 'women',
  entrepreneurs: 'entrepreneurs',
  sustainability: 'sustainability',
  quiz: 'quiz',
  games: 'games',
  leaderboard: 'leaderboard',
  profile: 'profile'
};

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(PAGES.home);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 6500); // 6.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  const renderPage = () => {
    switch (currentPage) {
      case PAGES.home:
        return <DailyBriefingPage />;
      case PAGES.library:
        return <LibraryPage />;
      case PAGES.saved:
        return <SavedPage />;
      case PAGES.market:
        return <MarketPage />;
      case PAGES.ai:
        return <AIInsightsPage />;
      case PAGES.podcasts:
        return <PodcastsPage />;
      case PAGES.women:
        return <WomenInBusinessPage />;
      case PAGES.entrepreneurs:
        return <EntrepreneursPage />;
      case PAGES.sustainability:
        return <SustainabilityPage />;
      case PAGES.quiz:
        return <QuizPage />;
      case PAGES.games:
        return <GamesPage />;
      case PAGES.leaderboard:
        return <LeaderboardPage />;
      case PAGES.profile:
        return <ProfilePage />;
      default:
        return <DailyBriefingPage />;
    }
  };

  return (
    <NewsProvider>
      <SavedArticlesProvider>
        <div className="flex min-h-screen animate-fadeIn">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
          <div className="flex flex-1 flex-col lg:ml-72">
            <TopBar />
            <main className="max-w-5xl mx-auto px-4 py-6 lg:py-10 w-full flex-1">
              {renderPage()}
            </main>
            <Footer />
          </div>
        </div>
      </SavedArticlesProvider>
    </NewsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

