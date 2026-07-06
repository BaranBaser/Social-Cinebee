'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProfilePopup from '@/components/ProfilePopup';

interface Post {
  id: string;
  user_id?: string;
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
  comment_count?: number;
  vote_score?: number;
  user_vote?: number;
}

interface Comment {
  id: string;
  body: string;
  created_at: string;
  user: { id: string; username: string; avatar_url: string } | null;
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

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [profilePopupUser, setProfilePopupUser] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>({});

  useEffect(() => { loadFeed(); }, []);

  async function loadFeed() {
    try {
      const { data } = await api.get('/social/feed', { params: { limit: 30 } });
      const postsData = data.posts || [];
      const enriched = await Promise.all(postsData.map(async (p: Post) => {
        try {
          const [voteRes, commentRes] = await Promise.all([
            api.get(`/social/posts/${p.id}/vote`).catch(() => ({ data: { score: 0, user_vote: 0 } })),
            api.get(`/social/posts/${p.id}/comments`).catch(() => ({ data: { comments: [] } })),
          ]);
          return { ...p, vote_score: voteRes.data.score, user_vote: voteRes.data.user_vote, comment_count: commentRes.data.comments.length };
        } catch { return { ...p, vote_score: 0, user_vote: 0, comment_count: 0 }; }
      }));
      setPosts(enriched);
    } catch {} finally { setLoading(false); }
  }

  async function handlePost() {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    try {
      await api.post('/social/posts', { body: newPost.trim() });
      setNewPost('');
      await loadFeed();
    } catch {} finally { setPosting(false); }
  }

  async function handleVote(postId: string, value: 1 | -1) {
    if (!user) return;
    try {
      const { data } = await api.post(`/social/posts/${postId}/vote`, { value });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, vote_score: data.score, user_vote: data.user_vote } : p));
    } catch {}
  }

  async function handleLike(postId: string) {
    if (!user) return;
    try {
      const { data } = await api.post(`/social/posts/${postId}/like`);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: data.like_count, user_liked: data.liked ? 1 : 0 } : p));
    } catch {}
  }

  async function handleDelete(postId: string) {
    if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/social/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch {}
  }

  async function toggleComments(postId: string) {
    if (expandedPost === postId) { setExpandedPost(null); return; }
    setExpandedPost(postId);
    if (!comments[postId]) {
      try {
        const { data } = await api.get(`/social/posts/${postId}/comments`);
        setComments(prev => ({ ...prev, [postId]: data.comments || [] }));
      } catch {}
    }
  }

  async function submitComment(postId: string) {
    const text = (commentDrafts[postId] || '').trim();
    if (!text || commentLoading[postId]) return;
    setCommentLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const { data } = await api.post(`/social/posts/${postId}/comments`, { body: text });
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), data.comment] }));
      setCommentDrafts(prev => ({ ...prev, [postId]: '' }));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p));
    } catch {} finally { setCommentLoading(prev => ({ ...prev, [postId]: false })); }
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

      {user && (
        <div className="bg-surface rounded-xl p-4 border border-white/[0.06] mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Ne izledin? Düşüncelerini paylaş..."
            className="w-full bg-transparent text-sm text-white placeholder-muted resize-none outline-none min-h-[60px]"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button onClick={handlePost} disabled={!newPost.trim() || posting}
              className="px-4 py-1.5 bg-honey text-ink text-sm font-bold rounded-lg hover:bg-honey-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {posting ? 'Paylaşılıyor...' : 'Paylaş'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-4 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full animate-shimmer bg-surface2" />
                <div className="flex-1"><div className="h-4 rounded animate-shimmer bg-surface2 w-1/4 mb-1" /><div className="h-3 rounded animate-shimmer bg-surface2 w-1/6" /></div>
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
            <div key={post.id} className="bg-surface rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
              <div className="p-4">
                <div className="flex gap-3">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button onClick={() => handleVote(post.id, 1)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${post.user_vote === 1 ? 'bg-honey text-ink' : 'text-muted hover:text-honey hover:bg-honey/10'}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </button>
                    <span className={`text-sm font-bold ${(post.vote_score || 0) > 0 ? 'text-honey' : (post.vote_score || 0) < 0 ? 'text-red-400' : 'text-muted'}`}>
                      {post.vote_score || 0}
                    </span>
                    <button onClick={() => handleVote(post.id, -1)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${post.user_vote === -1 ? 'bg-red-400/20 text-red-400' : 'text-muted hover:text-red-400 hover:bg-red-400/10'}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <button onClick={() => setProfilePopupUser(post.user_id || post.id)} className="w-8 h-8 rounded-full bg-surface2 border border-white/[0.06] flex items-center justify-center text-xs font-semibold text-white overflow-hidden shrink-0 hover:ring-2 hover:ring-honey/50 transition-all">
                        {post.avatar_url ? (
                          <img src={post.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          post.username[0].toUpperCase()
                        )}
                      </button>
                      <button onClick={() => setProfilePopupUser(post.user_id || post.id)} className="text-sm font-semibold text-white hover:text-honey transition-colors">{post.username}</button>
                      <span className="text-[11px] text-muted">{timeAgo(post.created_at)}</span>
                    </div>

                    {post.content_title && (
                      <div className="flex items-center gap-3 bg-surface2 rounded-lg p-3 mb-3 border border-white/[0.04]">
                        {post.content_poster && <img src={post.content_poster} alt="" className="w-10 h-14 rounded object-cover" />}
                        <div>
                          <p className="text-sm font-medium text-white">{post.content_title}</p>
                          {post.score && <p className="text-xs text-honey">{post.score}/10</p>}
                        </div>
                      </div>
                    )}

                    {post.body && <p className="text-sm text-gray-300 leading-relaxed mb-3">{post.body}</p>}

                    <div className="flex items-center gap-4">
                      <button onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${post.user_liked ? 'text-honey' : 'text-muted hover:text-honey'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={post.user_liked ? '#f5c518' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        {post.like_count}
                      </button>
                      <button onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 text-xs text-muted hover:text-honey transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>
                        </svg>
                        {post.comment_count || 0} yorum
                      </button>
                      {user && (user.id === post.user_id || user.role === 'admin') && (
                        <button onClick={() => handleDelete(post.id)} className="text-xs text-muted hover:text-red-400 transition-colors ml-auto">Sil</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments section */}
              {expandedPost === post.id && (
                <div className="border-t border-white/[0.06] p-4 bg-ink/50">
                  {(comments[post.id] || []).map((c) => (
                    <div key={c.id} className="flex gap-2 mb-3 last:mb-0">
                      <button onClick={() => setProfilePopupUser(c.user?.id)} className="w-6 h-6 rounded-full bg-honey flex items-center justify-center text-[10px] font-bold text-ink shrink-0 overflow-hidden hover:ring-2 hover:ring-honey/50 transition-all">
                        {c.user?.avatar_url ? <img src={c.user.avatar_url} alt="" className="w-full h-full object-cover" /> : c.user?.username[0].toUpperCase()}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setProfilePopupUser(c.user?.id)} className="text-xs font-semibold text-white hover:text-honey transition-colors">{c.user?.username}</button>
                          <span className="text-[10px] text-gray-600">{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-xs text-gray-300 mt-0.5">{c.body}</p>
                      </div>
                    </div>
                  ))}
                  {user && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                      <input
                        value={commentDrafts[post.id] || ''}
                        onChange={(e) => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                        placeholder="Yorum yaz..."
                        className="flex-1 bg-surface rounded-lg px-3 py-1.5 text-xs outline-none text-white placeholder-muted border border-white/[0.06] focus:border-honey/40"
                      />
                      <button onClick={() => submitComment(post.id)} disabled={!commentDrafts[post.id]?.trim() || commentLoading[post.id]}
                        className="px-3 py-1.5 bg-honey text-ink text-xs font-bold rounded-lg hover:bg-honey-light transition-colors disabled:opacity-40">
                        {commentLoading[post.id] ? '...' : 'Gönder'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {profilePopupUser && <ProfilePopup userId={profilePopupUser} onClose={() => setProfilePopupUser(null)} />}
    </div>
  );
}
