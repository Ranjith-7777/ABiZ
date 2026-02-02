import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNews } from '../context/NewsContext.jsx';
import { useSavedArticles } from '../context/SavedArticlesContext.jsx';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { eco } = useNews();
  const { savedArticles } = useSavedArticles();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      displayName: user?.displayName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const getActivityLevel = () => {
    const points = user?.points || 0;
    if (points >= 3000) return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (points >= 2000) return { level: 'Advanced', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (points >= 1000) return { level: 'Intermediate', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Beginner', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  };

  const activityLevel = getActivityLevel();

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-sm text-muted">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">Profile</h1>
        <p className="text-sm text-muted">
          Manage your account settings and view your activity
        </p>
      </header>

      {/* Profile Overview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary-gradient flex items-center justify-center text-white text-2xl font-serif font-bold">
            {user.displayName.charAt(0)}
          </div>

          {/* User Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-accent-gradient text-white rounded-md text-sm font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-border rounded-md text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-serif text-xl font-semibold">{user.displayName}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${activityLevel.bg} ${activityLevel.color}`}>
                    {activityLevel.level}
                  </span>
                </div>
                <p className="text-sm text-muted mb-1">Student ID: {user.username}</p>
                <p className="text-sm text-muted mb-4">{user.email}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-border rounded-md text-sm font-semibold hover:bg-amber-50"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{user.points.toLocaleString()}</div>
          <div className="text-sm text-muted">Total Points</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{user.streak}</div>
          <div className="text-sm text-muted">Day Streak</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{savedArticles.length}</div>
          <div className="text-sm text-muted">Saved Articles</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{user.level}</div>
          <div className="text-sm text-muted">Level</div>
        </div>
      </div>

      {/* Environmental Impact */}
      {eco && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-serif text-lg font-semibold text-green-800 mb-3">
            🌱 Your Environmental Impact
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{eco.papersSaved.toLocaleString()}</div>
              <div className="text-sm text-green-700">Papers Saved</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{eco.co2SavedFormatted}</div>
              <div className="text-sm text-green-700">CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{Math.floor(eco.papersSaved * 0.017)}</div>
              <div className="text-sm text-green-700">Trees Saved</div>
            </div>
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-serif text-lg font-semibold mb-4">Account Actions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted">Receive daily briefing notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.preferences?.notifications || false}
                onChange={(e) => updateProfile({
                  preferences: { ...user.preferences, notifications: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Auto-save Articles</p>
              <p className="text-sm text-muted">Automatically save articles you read</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.preferences?.autoSave || false}
                onChange={(e) => updateProfile({
                  preferences: { ...user.preferences, autoSave: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-serif text-lg font-semibold mb-4">Session Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Login Time:</span>
            <span>{new Date(user.loginTime).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Last Activity:</span>
            <span>{user.lastActivity ? new Date(user.lastActivity).toLocaleString() : 'Current session'}</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}