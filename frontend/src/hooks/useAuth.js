'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { auth } from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      if (auth.isAuthenticated()) {
        const userData = await auth.getMe();
        setUser(userData);
      }
    } catch {
      auth.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username, password) => {
    const data = await auth.login(username, password);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await auth.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setUser(null);
    auth.logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
