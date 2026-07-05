'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Post {
  id: number;
  username: string;
  avatar_url: string | null;
  content_title: string | null;
  content_poster: string | null;
  content_type: string | null;
  body: string;
  score: number | null;
  status: string | null;
  like_count: number;
  user_liked: number;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'az önce';
  if (mins < 60) return `${mins} dakika önce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} saat önce`;
  const days = Math.floor(hrs / 24);
  return `${days} gün önce`;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      const { data } = await api.get('/social/feed', { params: { limit: 30 } });
      setPosts(data.posts || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handlePost() {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    try {
      await api.post('/social/posts', { body: newPost.trim() });
      setNewPost('');
      await loadFeed();
    } catch {
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(postId: number) {
    try {
      const { data } = await api.post(`/social/posts/${postId}/like`);
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, like_count: data.like_count, user_liked: data.liked ? 1 : 0 }
          : p
      ));
    } catch {
    }
  }

  async function handleDelete(postId: number) {
    if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/social/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch {
    }
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Topluluk</h1>
          <p className="text-xs text-muted">Film ve dizi tutkunlarıyla bağlantı kur</p>
        </div>
      </div>

      {/* Post composer */}
      <div className="bg-surface rounded-xl p-4 border border-white/[0.06] mb-6">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Ne izledin? Düşüncelerini paylaş..."
          className="w-full bg-transparent text-sm text-white placeholder-muted resize-none outline-none min-h-[60px]"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handlePost}
            disabled={!newPost.trim() || posting}
            className="px-4 py-1.5 bg-honey text-ink text-sm font-bold rounded-lg hover:bg-honey-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {posting ? 'Paylaşılıyor...' : 'Paylaş'}
          </button>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-4 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full animate-shimmer bg-surface2" />
                <div className="flex-1">
                  <div className="h-4 rounded animate-shimmer bg-surface2 w-1/4 mb-1" />
                  <div className="h-3 rounded animate-shimmer bg-surface2 w-1/6" />
                </div>
              </div>
              <div className="h-3 rounded animate-shimmer bg-surface2 w-3/4 mb-2" />
              <div className="h-3 rounded animate-shimmer bg-surface2 w-1/2" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Henüz Gönderi Yok</h2>
          <p className="text-sm text-muted">İlk gönderiyi sen paylaş!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-surface rounded-xl p-4 border border-white/[0.06] hover:border-white/[0.1] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-surface2 border border-white/[0.06] flex items-center justify-center text-sm font-semibold text-white shrink-0">
                  {post.avatar_url ? (
                    <img src={post.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    post.username[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{post.username}</p>
                  <p className="text-[11px] text-muted">{timeAgo(post.created_at)}</p>
                </div>
              </div>

              {post.content_title && (
                <div className="flex items-center gap-3 bg-surface2 rounded-lg p-3 mb-3 border border-white/[0.04]">
                  {post.content_poster && (
                    <img src={post.content_poster} alt="" className="w-10 h-14 rounded object-cover" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{post.content_title}</p>
                    {post.score && (
                      <p className="text-xs text-honey">{post.score}/10</p>
                    )}
                    {post.status && (
                      <p className="text-xs text-muted">{post.status === 'watched' ? 'İzledi' : 'İzleme Listesinde'}</p>
                    )}
                  </div>
                </div>
              )}

              {post.body && (
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{post.body}</p>
              )}

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    post.user_liked ? 'text-honey' : 'text-muted hover:text-honey'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={post.user_liked ? '#f5c518' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  {post.like_count}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
