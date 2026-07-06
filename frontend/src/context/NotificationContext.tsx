'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface NotificationContextType {
  unreadCount: number;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({ unreadCount: 0, refresh: async () => {} });

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) { setUnreadCount(0); return; }
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnreadCount(data.count || 0);
    } catch { setUnreadCount(0); }
  }, [user]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
