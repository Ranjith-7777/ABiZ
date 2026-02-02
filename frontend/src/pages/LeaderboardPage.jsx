import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// Static leaderboard for now – auth and real data will replace this later.
const STATIC_ENTRIES = [
  { rank: 1, name: 'Priya Sharma', initials: 'PS', streak: 28, points: 3250, studentId: '001' },
  { rank: 2, name: 'Arjun Kapoor', initials: 'AK', streak: 21, points: 2890, studentId: '002' },
  { rank: 3, name: 'Neha Gupta', initials: 'NG', streak: 18, points: 2670, studentId: '003' },
  { rank: 4, name: 'Rahul Verma', initials: 'RV', streak: 15, points: 2540, studentId: '004' },
  { rank: 5, name: 'Ananya Patel', initials: 'AP', streak: 14, points: 2480, studentId: '005' },
  { rank: 6, name: 'Vikram Singh', initials: 'VS', streak: 12, points: 2460, studentId: '006' }
];

export default function LeaderboardPage() {
  const { user, isAuthenticated } = useAuth();

  // Create leaderboard with current user if authenticated
  const getLeaderboardEntries = () => {
    let entries = [...STATIC_ENTRIES];
    
    if (isAuthenticated && user) {
      // Remove any existing entry for current user and add them
      entries = entries.filter(e => e.studentId !== user.studentId);
      
      const userEntry = {
        rank: 0, // Will be calculated
        name: `${user.displayName} (You)`,
        initials: user.displayName.charAt(0),
        streak: user.streak,
        points: user.points,
        studentId: user.studentId,
        currentUser: true
      };
      
      entries.push(userEntry);
      
      // Sort by points and assign ranks
      entries.sort((a, b) => b.points - a.points);
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }
    
    return entries;
  };

  const entries = getLeaderboardEntries();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">Leaderboard</h1>
        <p className="text-sm text-muted">
          {isAuthenticated 
            ? 'Your ranking among BizAI users. Keep reading to climb higher!' 
            : 'Sign in to see your ranking and compete with other users.'
          }
        </p>
      </header>

      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-700">
            🏆 Sign in to track your points and see your position on the leaderboard!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((e) => (
          <div
            key={`${e.rank}-${e.studentId}`}
            className={`flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 ${
              e.currentUser ? 'ring-2 ring-accent bg-amber-50' : ''
            }`}
          >
            <div className="w-7 text-center text-xs font-semibold text-muted">
              {e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : e.rank}
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-gradient text-white flex items-center justify-center text-xs font-semibold font-serif">
              {e.initials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{e.name}</p>
              <p className="text-xs text-muted">📈 {e.streak} day streak</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-semibold text-accent">{e.points.toLocaleString()} pts</p>
            </div>
          </div>
        ))}
      </div>

      {isAuthenticated && user && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-sm text-blue-800 mb-2">💡 How to Earn Points</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Daily Quiz: 10 points per correct answer</p>
            <p>• Reading Articles: 5 points per article</p>
            <p>• Daily Login: 25 points bonus</p>
            <p>• Weekly Streak: 100 points bonus</p>
          </div>
        </div>
      )}
    </div>
  );
}

