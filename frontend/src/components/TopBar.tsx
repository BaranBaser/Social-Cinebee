'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import api from '@/lib/api';
import AddFriendModal from './AddFriendModal';

interface TopBarProps {
  onOpenChat: () => void;
  socialCollapsed?: boolean;
  setSocialCollapsed?: (val: boolean) => void;
}

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

export default function TopBar({ onOpenChat, socialCollapsed, setSocialCollapsed }: TopBarProps) {
  const { user, logout } = useAuth();
  const { unreadCount, refresh } = useNotifications();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowLiveSearch(false);
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}&type=all`);
    }
  };

  useEffect(() => {
    if (!showNotifs) return;
    loadNotifs();
  }, [showNotifs]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowLiveSearch(false);
      }
    }
    if (showNotifs || showLiveSearch) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifs, showLiveSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        performLiveSearch(searchQuery.trim());
      } else {
        setLiveResults([]);
        setShowLiveSearch(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  async function performLiveSearch(q: string) {
    setIsSearching(true);
    try {
      const { data } = await api.get('/content/search', { params: { q, type: 'all' } });
      setLiveResults(data.results || []);
      setShowLiveSearch(true);
    } catch {
      setLiveResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  async function loadNotifs() {
    setLoadingNotifs(true);
    try {
      const { data } = await api.get('/notifications', { params: { limit: 15 } });
      setNotifications(data.notifications || []);
    } catch {} finally { setLoadingNotifs(false); }
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

  async function handleAcceptFriend(n: Notification) {
    if (!n.from_user) return;
    try {
      await api.post(`/social/friends/accept-from/${n.from_user.id}`);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
      refresh();
    } catch {}
  }

  async function handleRejectFriend(n: Notification) {
    if (!n.from_user) return;
    try {
      await api.post(`/social/friends/reject-from/${n.from_user.id}`);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true, title: 'Arkadaşlık isteği reddedildi' } : x));
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
    <header className="sticky top-0 z-20 bg-ink/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="h-14 flex items-center px-4 md:px-6 gap-2 md:gap-4">
        <div className="hidden md:block flex-1" />

        <div ref={searchRef} className="flex-1 md:flex-none w-full md:w-80 relative">
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-2 bg-white/[0.06] rounded-full px-3 md:px-4 py-2 border border-white/[0.06] hover:border-white/[0.1] transition-colors focus-within:border-honey/40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!showLiveSearch && e.target.value.trim()) setShowLiveSearch(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setShowLiveSearch(true);
                }}
                placeholder="Film, dizi, anime ara..."
                className="bg-transparent text-sm outline-none flex-1 text-white placeholder:text-muted"
              />
              {isSearching && (
                <div className="w-4 h-4 rounded-full border-2 border-honey border-t-transparent animate-spin shrink-0" />
              )}
            </div>
          </form>

          {showLiveSearch && searchQuery.trim() && (
            <div className="absolute top-full mt-2 w-full bg-surface border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden max-h-[70vh] flex flex-col">
              {isSearching && liveResults.length === 0 ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-12 h-16 rounded bg-surface2 animate-shimmer shrink-0" />
                      <div className="flex-1 space-y-2 mt-1">
                        <div className="h-3 w-3/4 rounded bg-surface2 animate-shimmer" />
                        <div className="h-2 w-1/2 rounded bg-surface2 animate-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : liveResults.length > 0 ? (
                <div className="overflow-y-auto p-2">
                  {['movie', 'series', 'anime'].map(type => {
                    const filtered = liveResults.filter(r => r.type === type);
                    if (filtered.length === 0) return null;
                    return (
                      <div key={type} className="mb-4 last:mb-0">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-2">
                          {type === 'movie' ? 'Filmler' : type === 'series' ? 'Diziler' : 'Animeler'}
                        </h4>
                        <div className="flex flex-col gap-1">
                          {filtered.slice(0, 4).map(r => (
                            <Link
                              key={r.id || r.tmdb_id || r.mal_id}
                              href={`/title/${r.id || r.tmdb_id || r.mal_id}`}
                              onClick={() => setShowLiveSearch(false)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors"
                            >
                              <div className="w-10 h-14 bg-surface2 rounded overflow-hidden shrink-0">
                                {r.poster_path || r.image_url ? (
                                  <img src={r.poster_path ? `https://image.tmdb.org/t/p/w92${r.poster_path}` : r.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Yok</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{r.title}</p>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                                  {r.year && <span>{r.year}</span>}
                                  {r.rating > 0 && (
                                    <span className="flex items-center gap-0.5 text-honey">
                                      ★ {r.rating.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <button 
                    onClick={handleSearch}
                    className="w-full py-2.5 mt-1 text-xs font-semibold text-honey hover:bg-honey/10 rounded-xl transition-colors"
                  >
                    Tüm sonuçları gör ({liveResults.length})
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-400">Sonuç bulunamadı</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 shrink-0">
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-muted hover:text-white relative"
                title="Bildirimler"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-honey text-ink text-[10px] font-bold rounded-full px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Bildirimler</h3>
                    {notifications.some(n => !n.is_read) && (
                      <button onClick={markAllRead} className="text-[11px] text-honey hover:text-honey-light transition-colors font-medium">
                        Tümünü okundu işaretle
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loadingNotifs ? (
                      <div className="p-4 space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full animate-shimmer bg-surface2 shrink-0" />
                            <div className="flex-1"><div className="h-2.5 rounded animate-shimmer bg-surface2 w-2/3 mb-1.5" /><div className="h-2 rounded animate-shimmer bg-surface2 w-1/2" /></div>
                          </div>
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted">Bildirim bulunmuyor</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`flex flex-col transition-colors border-b border-white/[0.04] last:border-0 ${
                            n.is_read ? 'hover:bg-white/[0.02]' : 'bg-honey/[0.03] hover:bg-honey/[0.06]'
                          }`}
                        >
                          <button
                            onClick={() => { markRead(n.id); setShowNotifs(false); if (n.link && n.type !== 'friend_request') router.push(n.link); }}
                            className="w-full text-left flex items-start gap-2.5 px-4 py-3"
                          >
                            <span className="text-base mt-0.5">{typeIcon(n.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className={`text-xs font-semibold ${n.is_read ? 'text-gray-400' : 'text-white'}`}>{n.title}</p>
                                {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-honey shrink-0" />}
                              </div>
                              <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>
                              <p className="text-[10px] text-gray-700 mt-1">{timeAgo(n.created_at)} önce</p>
                            </div>
                          </button>
                          {n.type === 'friend_request' && !n.is_read && n.from_user && (
                            <div className="flex gap-2 px-4 pb-3 pt-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAcceptFriend(n); }}
                                className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-honey text-ink hover:bg-honey-light transition-colors"
                              >
                                Kabul Et
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRejectFriend(n); }}
                                className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-white/[0.06] text-red-400 hover:bg-red-400/10 transition-colors"
                              >
                                Reddet
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {user ? (
            <>
              <button
                onClick={() => setShowAddFriend(true)}
                className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-muted hover:text-white"
                title="Arkadaş Ekle"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
                </svg>
              </button>

              <AddFriendModal isOpen={showAddFriend} onClose={() => setShowAddFriend(false)} />

              <button
                onClick={onOpenChat}
                className="p-2 rounded-lg hover:bg-white/[0.06] active:scale-95 transition-all text-muted hover:text-white"
                title="Mesajlar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
                </svg>
              </button>

              <button
                onClick={() => setSocialCollapsed?.(!socialCollapsed)}
                className="lg:hidden p-2 rounded-lg bg-honey/10 text-honey hover:bg-honey/20 active:scale-95 transition-all"
                title="Sosyal Panel"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <line x1="9" y1="10" x2="15" y2="10"/>
                  <line x1="12" y1="7" x2="12" y2="13"/>
                </svg>
              </button>

              <div className="relative ml-1">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-surface2 border border-white/[0.06] flex items-center justify-center text-sm font-semibold text-white overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user.username[0].toUpperCase()
                    )}
                  </div>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-white/[0.06] rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                        <p className="text-xs text-muted truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/profile" className="block px-4 py-2 text-sm text-muted hover:text-white hover:bg-white/[0.04] transition-colors" onClick={() => setShowUserMenu(false)}>
                          Profilim
                        </Link>
                        <Link href="/library" className="block px-4 py-2 text-sm text-muted hover:text-white hover:bg-white/[0.04] transition-colors" onClick={() => setShowUserMenu(false)}>
                          Kütüphanem
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="block px-4 py-2 text-sm text-honey hover:bg-honey/10 transition-colors" onClick={() => setShowUserMenu(false)}>
                            Yönetici Paneli
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-white/[0.06] py-1">
                        <button
                          onClick={() => { logout(); router.push('/'); setShowUserMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-sm font-medium rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-colors">
                Giriş yap
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm font-bold rounded-lg bg-honey text-ink hover:bg-honey-light transition-colors">
                Kayıt ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
