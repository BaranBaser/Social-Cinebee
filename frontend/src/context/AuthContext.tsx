'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import api from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';

interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatar_url: string;
  banner_url: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cinemaai_token') : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      connectSocket(token);
    } catch {
      localStorage.removeItem('cinemaai_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('cinemaai_token', data.token);
    setUser(data.user);
    connectSocket(data.token);
    return data.user;
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('cinemaai_token', data.token);
    setUser(data.user);
    connectSocket(data.token);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('cinemaai_token');
    setUser(null);
    disconnectSocket();
  };

  const updateUser = (patch: Partial<User>) => setUser((u) => (u ? { ...u, ...patch } : u));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
