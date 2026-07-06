'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProfilePopup from '@/components/ProfilePopup';

interface UserItem {
  id: string;
  username: string;
  avatar_url: string | null;
  last_active?: string;
  bio?: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'az once';
  if (mins < 60) return `${mins}dk`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}sa`;
  const days = Math.floor(hrs / 24);
  return `${days}g`;
}

export default function SocialPanel() {
  const [activeTab, setActiveTab] = useState<'active' | 'friends'>('active');
  const [activeUsers, setActiveUsers] = useState<UserItem[]>([]);
  const [friends, setFriends] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePopupUser, setProfilePopupUser] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === 'active') {
        const { data } = await api.get('/social/active-users', { params: { limit: 50 } });
        setActiveUsers(data.users || []);
      } else {
        const { data } = await api.get('/social/friends');
        setFriends(data.friends || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  const users = activeTab === 'active' ? activeUsers : friends;

  return (
    <aside className="hidden lg:flex flex-col fixed right-0 top-0 bottom-0 w-[300px] bg-ink border-l border-white/[0.06] z-20 overflow-hidden">
      <div className="flex border-b border-white/[0.06] shrink-0">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'active' ? 'text-honey border-b-2 border-honey' : 'text-muted hover:text-white'
          }`}
        >
          Aktif Kullanicilar
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'friends' ? 'text-honey border-b-2 border-honey' : 'text-muted hover:text-white'
          }`}
        >
          Arkadaslar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="p-3 space-y-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg">
                <div className="w-9 h-9 rounded-full animate-shimmer bg-surface2" />
                <div className="flex-1">
                  <div className="h-3 rounded animate-shimmer bg-surface2 w-1/2 mb-1" />
                  <div className="h-2 rounded animate-shimmer bg-surface2 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-xs text-muted text-center py-12 px-4">
            {activeTab === 'active' ? 'Henuz kullanici yok.' : 'Henuz arkadasiniz yok.'}
          </p>
        ) : (
          <div className="py-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setProfilePopupUser(user.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors text-left group"
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-surface2 border border-white/[0.06] flex items-center justify-center text-sm font-semibold text-white overflow-hidden group-hover:ring-2 group-hover:ring-honey/30 transition-all">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.username[0].toUpperCase()
                    )}
                  </div>
                  {activeTab === 'active' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-ink rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-honey transition-colors">{user.username}</p>
                  {activeTab === 'active' && user.last_active && (
                    <p className="text-[11px] text-gray-600">{timeAgo(user.last_active)} once aktif</p>
                  )}
                  {activeTab === 'friends' && user.bio && (
                    <p className="text-[11px] text-gray-600 truncate">{user.bio}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {profilePopupUser && <ProfilePopup userId={profilePopupUser} onClose={() => setProfilePopupUser(null)} />}
    </aside>
  );
}
