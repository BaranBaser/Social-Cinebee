'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface UserItem {
  id: string;
  username: string;
  avatar_url: string | null;
  last_active?: string;
  bio?: string;
}

function timeAgo(dateStr: string | any) {
  if (!dateStr) return 'yakın zamanda';
  try {
    const dStr = String(dateStr);
    const date = new Date(dStr + (dStr.endsWith('Z') ? '' : 'Z'));
    if (isNaN(date.getTime())) return 'yakın zamanda';
    const diff = Date.now() - date.getTime();
    if (diff < 0) return 'az önce';
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'az önce';
    if (mins < 60) return `${mins}dk`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}sa`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}g`;
    const months = Math.floor(days / 30);
    return `${months} ay`;
  } catch (e) {
    return 'yakın zamanda';
  }
}

interface SocialPanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function SocialPanel({ collapsed, onToggle }: SocialPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'friends'>('active');
  const [activeUsers, setActiveUsers] = useState<UserItem[]>([]);
  const [friends, setFriends] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (collapsed) {
    return (
      <aside className="hidden lg:flex flex-col fixed right-0 top-0 bottom-0 w-[52px] bg-ink border-l border-white/[0.06] z-20 items-center pt-4 gap-1">
        <button
          onClick={onToggle}
          className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-honey/10 flex items-center justify-center transition-colors mb-3 group"
          title="Paneli ac"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-honey transition-colors">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <button
          onClick={() => { if (activeTab !== 'active') setActiveTab('active'); else onToggle(); }}
          className="w-9 h-9 rounded-xl hover:bg-white/[0.06] flex items-center justify-center transition-colors relative group"
          title="Aktif kullanicilar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-honey transition-colors">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {activeUsers.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center border-2 border-ink">
              {activeUsers.length > 9 ? '9+' : activeUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => { if (activeTab !== 'friends') setActiveTab('friends'); else onToggle(); }}
          className="w-9 h-9 rounded-xl hover:bg-white/[0.06] flex items-center justify-center transition-colors relative group"
          title="Arkadaslar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-honey transition-colors">
            <path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
          </svg>
          {friends.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-honey text-[8px] font-bold text-ink rounded-full flex items-center justify-center border-2 border-ink">
              {friends.length > 9 ? '9+' : friends.length}
            </span>
          )}
        </button>

        {profilePopupUser && <ProfilePopup userId={profilePopupUser} onClose={() => setProfilePopupUser(null)} />}
      </aside>
    );
  }

  return (
    <aside className="flex flex-col fixed right-0 top-0 bottom-0 w-full lg:w-[300px] bg-ink lg:border-l border-white/[0.06] z-[60] lg:z-20 overflow-hidden shadow-2xl lg:shadow-none">
      <div className="flex items-center border-b border-white/[0.06] shrink-0">
        <div className="flex flex-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 ${
              activeTab === 'active' ? 'text-honey border-b-2 border-honey' : 'text-muted hover:text-white'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 ${
              activeTab === 'friends' ? 'text-honey border-b-2 border-honey' : 'text-muted hover:text-white'
            }`}
          >
            Arkadaslar
          </button>
        </div>
        <button
          onClick={onToggle}
          className="w-10 h-full flex items-center justify-center text-muted hover:text-white transition-all active:scale-90 shrink-0 hover:bg-white/[0.04]"
          title="Paneli kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
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
                onClick={() => router.push(`/profile/${user.id}`)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-all active:scale-[0.98] text-left group"
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
    </aside>
  );
}
