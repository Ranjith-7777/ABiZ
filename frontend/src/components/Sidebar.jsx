import React from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { id: 'home', label: 'Daily Briefing' },
  { id: 'library', label: 'Library' },
  { id: 'saved', label: 'Saved Articles' },
  { id: 'market', label: 'Market Data' },
  { id: 'ai', label: 'AI Insights' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'women', label: 'Women in Business' },
  { id: 'entrepreneurs', label: 'Entrepreneurs' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'quiz', label: 'Daily Quiz' },
  { id: 'games', label: 'Fun Games' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'profile', label: 'Profile' },
  {id:'asb_home',label:'ASB Home Page'}
];

export default function Sidebar({ currentPage, onNavigate }) {
  const { eco } = useNews();
  const { user, isAuthenticated } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-card border-r border-border fixed inset-y-0">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary-gradient flex items-center justify-center text-white font-serif font-bold">
          B
        </div>
        <span className="font-serif text-xl font-bold">
          Biz<span className="text-accent">AI</span>
        </span>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
            Go Green
          </p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {eco ? eco.papersSaved.toLocaleString() : '–'}
          </p>
          <p className="text-xs text-muted">Newspapers saved</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition ${
              currentPage === item.id
                ? 'bg-bg text-foreground'
                : 'text-muted hover:bg-amber-50 hover:text-accent'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3 flex items-center gap-3">
        {isAuthenticated && user ? (
          <>
            <div className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-serif font-semibold">
              {user.displayName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{user.displayName}</p>
              <p className="text-xs text-muted">Student ID: {user.studentId}</p>
            </div>
            <div className="text-xs font-semibold text-accent">{user.points.toLocaleString()} pts</div>
          </>
        ) : (
          <>
            <div className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-serif font-semibold">
              ?
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Guest User</p>
              <p className="text-xs text-muted">Please sign in</p>
            </div>
            <div className="text-xs font-semibold text-muted">0 pts</div>
          </>
        )}
      </div>
    </aside>
  );
}

