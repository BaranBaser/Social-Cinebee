'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface ActiveUser {
  id: number;
  username: string;
  avatar_url: string | null;
  last_active: string;
}

interface FeedPost {
  id: number;
  username: string;
  avatar_url: string | null;
  content_title: string | null;
  body: string;
  like_count: number;
  created_at: string;
}

interface TrendItem {
  content_key: string;
  content_type: string;
  content_title: string;
  content_poster: string | null;
  post_count: number;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'az önce';
  if (mins < 60) return `${mins}dk`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}sa`;
  const days = Math.floor(hrs / 24);
  return `${days}g`;
}

export default function SocialPanel() {
  const [activeTab, setActiveTab] = useState<'friends' | 'feed' | 'trends'>('friends');
  const [friends, setFriends] = useState<ActiveUser[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === 'friends') {
        const { data } = await api.get('/social/active-users', { params: { limit: 15 } });
        setFriends(data.users || []);
      } else if (activeTab === 'feed') {
        const { data } = await api.get('/social/feed', { params: { limit: 10 } });
        setPosts(data.posts || []);
      } else {
        const { data } = await api.get('/social/trending', { params: { limit: 10 } });
        setTrends(data.trending || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="hidden lg:flex flex-col fixed right-0 top-0 bottom-0 w-[300px] bg-ink border-l border-white/[0.06] z-20 overflow-hidden">
      <div className="flex border-b border-white/[0.06] shrink-0">
        {([
          { key: 'friends' as const, label: 'Arkadaşlar' },
          { key: 'feed' as const, label: 'Akış' },
          { key: 'trends' as const, label: 'Trendler' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab.key ? 'text-honey border-b-2 border-honey' : 'text-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'friends' && (
          <div className="p-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-3">Aktif Kullanıcılar</h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="w-9 h-9 rounded-full animate-shimmer bg-surface2" />
                    <div className="flex-1">
                      <div className="h-3 rounded animate-shimmer bg-surface2 w-1/2 mb-1" />
                      <div className="h-2 rounded animate-shimmer bg-surface2 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : friends.length === 0 ? (
              <p className="text-xs text-muted text-center py-8 px-2">
                Henüz aktif kullanıcı bulunmuyor. Bir gönderi paylaşarak başlayın!
              </p>
            ) : (
              <div className="space-y-1">
                {friends.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-surface2 border border-white/[0.06] flex items-center justify-center text-sm font-semibold text-white">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.username[0].toUpperCase()
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-ink rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.username}</p>
                      <p className="text-xs text-muted">{timeAgo(user.last_active)} önce aktif</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="p-3 space-y-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-1">Sosyal Akış</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-surface rounded-xl p-3 border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full animate-shimmer bg-surface2" />
                      <div className="flex-1">
                        <div className="h-3 rounded animate-shimmer bg-surface2 w-1/3 mb-1" />
                        <div className="h-2 rounded animate-shimmer bg-surface2 w-1/4" />
                      </div>
                    </div>
                    <div className="h-3 rounded animate-shimmer bg-surface2 w-3/4 mb-1" />
                    <div className="h-3 rounded animate-shimmer bg-surface2 w-1/2" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="text-xs text-muted text-center py-8 px-2">
                Henüz gönderi yok. Topluluk sayfasından ilk paylaşımı yap!
              </p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-surface rounded-xl p-3 border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-surface2 border border-white/[0.06] flex items-center justify-center text-xs font-semibold text-white">
                      {post.avatar_url ? (
                        <img src={post.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        post.username[0].toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{post.username}</p>
                      <p className="text-[11px] text-muted">{timeAgo(post.created_at)} önce</p>
                    </div>
                  </div>
                  {post.content_title && (
                    <p className="text-xs text-honey mb-1">{post.content_title}</p>
                  )}
                  <p className="text-sm text-gray-300 leading-relaxed mb-2 line-clamp-2">{post.body}</p>
                  <div className="flex items-center gap-3 text-muted">
                    <span className="flex items-center gap-1 text-xs">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#f5c518" stroke="#f5c518" strokeWidth="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      {post.like_count}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="p-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-3">Trend İçerikler</h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5">
                    <div className="w-10 h-14 rounded animate-shimmer bg-surface2" />
                    <div className="flex-1">
                      <div className="h-3 rounded animate-shimmer bg-surface2 w-2/3 mb-1" />
                      <div className="h-2 rounded animate-shimmer bg-surface2 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : trends.length === 0 ? (
              <p className="text-xs text-muted text-center py-8 px-2">
                Henüz trend içerik bulunmuyor.
              </p>
            ) : (
              <div className="space-y-1">
                {trends.map((trend, i) => (
                  <div key={trend.content_key} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <span className="text-xs font-bold text-muted w-5">{i + 1}</span>
                    {trend.content_poster && (
                      <img src={trend.content_poster} alt="" className="w-8 h-11 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{trend.content_title}</p>
                      <p className="text-xs text-muted">{trend.post_count} gönderi</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
