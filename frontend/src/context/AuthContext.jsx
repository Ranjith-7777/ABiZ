import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'bizai_auth_v1';

// Valid login format: cb.sc.u4aie24*** (case insensitive)
const LOGIN_REGEX = /^cb\.sc\.u4aie24\d{3}$/i;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    // Normalize username to lowercase for validation
    const normalizedUsername = username.toLowerCase().trim();
    const normalizedPassword = password.toLowerCase().trim();

    // Validate format
    if (!LOGIN_REGEX.test(normalizedUsername)) {
      throw new Error('Invalid login format. Use: cb.sc.u4aie24*** (where *** are 3 digits)');
    }

    // For now, username === password
    if (normalizedUsername !== normalizedPassword) {
      throw new Error('Invalid credentials. Username and password must match.');
    }

    // Extract student ID from username
    const studentId = normalizedUsername.match(/u4aie24(\d{3})/i)[1];
    
    // Create user object
    const userData = {
      id: normalizedUsername,
      username: normalizedUsername,
      displayName: `Student ${studentId}`,
      studentId: studentId,
      email: `${normalizedUsername}@college.edu`,
      loginTime: new Date().toISOString(),
      points: Math.floor(Math.random() * 3000) + 1000, // Random points 1000-4000
      streak: Math.floor(Math.random() * 30) + 1, // Random streak 1-30
      level: Math.floor(Math.random() * 10) + 1, // Random level 1-10
      preferences: {
        theme: 'light',
        notifications: true,
        autoSave: true
      }
    };

    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const addPoints = (points) => {
    if (!user) return;

    const updatedUser = { 
      ...user, 
      points: user.points + points,
      lastActivity: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    addPoints,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}