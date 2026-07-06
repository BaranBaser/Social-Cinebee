'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string;
  is_read: boolean;
  created_at: string;
  from_user: { id: string; username: string; avatar_url: string } | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'az önce';
  if (mins < 60) return `${mins}dk önce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}sa önce`;
  const days = Math.floor(hrs / 24);
  return `${days}g önce`;
}

function NotificationsContent() {
  const { refresh } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data } = await api.get('/notifications', { params: { limit: 50 } });
      setNotifications(data.notifications || []);
    } catch {} finally { setLoading(false); }
  }

  async function markAllRead() {
    try {
      await api.post('/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      refresh();
    } catch {}
  }

  async function markRead(id: string) {
    try {
      await api.post(`/notifications/read/${id}`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      refresh();
    } catch {}
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'comment': return '💬';
      case 'like': return '❤️';
      case 'friend_request': return '👤';
      case 'friend_accept': return '👥';
      default: return '🔔';
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bildirimler</h1>
            <p className="text-xs text-muted">Son bildirimleriniz</p>
          </div>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button onClick={markAllRead} className="text-xs text-honey hover:text-honey-light transition-colors font-medium">
            Tümünü okundu işaretle
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-4 border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full animate-shimmer bg-surface2" />
                <div className="flex-1">
                  <div className="h-3 rounded animate-shimmer bg-surface2 w-1/3 mb-2" />
                  <div className="h-2 rounded animate-shimmer bg-surface2 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Henüz Bildirim Yok</h2>
          <p className="text-sm text-muted text-center max-w-xs">
            Yeni bildirimleriniz burada görünecek.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => { markRead(n.id); if (n.link) window.location.href = n.link; }}
              className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                n.is_read
                  ? 'bg-surface border-white/[0.04] hover:bg-white/[0.02]'
                  : 'bg-honey/5 border-honey/20 hover:bg-honey/10'
              }`}
            >
              <span className="text-xl mt-0.5">{typeIcon(n.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${n.is_read ? 'text-gray-400' : 'text-white'}`}>{n.title}</p>
                  {!n.is_read && <span className="w-2 h-2 rounded-full bg-honey shrink-0" />}
                </div>
                <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-[10px] text-gray-600 mt-1">{timeAgo(n.created_at)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return <ProtectedRoute><NotificationsContent /></ProtectedRoute>;
}
