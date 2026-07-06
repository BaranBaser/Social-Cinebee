'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserPlus, UserMinus, Check, Clock, MessageSquare, Send } from 'lucide-react';

interface ProfileData {
  id: string;
  username: string;
  bio: string;
  avatar_url: string;
  role: string;
  created_at: string;
  friend_count: number;
  watched_items?: Array<{ content_key: string; title: string; poster_url: string }>;
}

interface Comment {
  id: string;
  body: string;
  author: { username: string; avatar_url: string };
  created_at: string;
}

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<'none' | 'sent' | 'received' | 'friends'>('none');
  const [requestId, setRequestId] = useState<string | null>(null);
  
  const isOwnProfile = !userIdParam || userIdParam === user?.id?.toString();
  
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  useEffect(() => {
    if (!userIdParam || isOwnProfile) {
      setLoading(false);
      return;
    }
    loadUserProfile();
  }, [userIdParam, isOwnProfile]);

  async function loadUserProfile() {
    setLoading(true);
    try {
      const { data } = await api.get(`/auth/users/${userIdParam}`);
      setProfile(data.user);
      
      if (user && user.id.toString() !== userIdParam) {
        const { data: fData } = await api.get('/social/friends');
        const isFriend = (fData.friends || []).some((f: { id: string }) => f.id === userIdParam);
        if (isFriend) {
          setFriendStatus('friends');
        } else {
          const { data: rData } = await api.get('/social/friends/requests');
          const incoming = (rData.requests || []).find((r: { from: { id: string } }) => r.from.id === userIdParam);
          if (incoming) {
            setFriendStatus('received');
            setRequestId(incoming.id);
          } else {
            setFriendStatus('none');
          }
        }
      }
      
      try {
        const { data: cData } = await api.get(`/profile-comments/${userIdParam}`);
        setComments(cData.comments || []);
      } catch {}
    } catch {} finally {
      setLoading(false);
    }
  }

  async function sendRequest() {
    try {
      await api.post('/social/friends/request', { user_id: userIdParam });
      setFriendStatus('sent');
    } catch {}
  }

  async function acceptRequest() {
    if (!requestId) return;
    try {
      await api.post(`/social/friends/accept/${requestId}`);
      setFriendStatus('friends');
    } catch {}
  }

  async function removeFriend() {
    try {
      await api.delete(`/social/friends/${userIdParam}`);
      setFriendStatus('none');
    } catch {}
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlToSave = avatarUrl || '';
    const { data } = await api.put('/auth/me', { bio, avatar_url: urlToSave });
    updateUser({ ...data.user, avatar_url: urlToSave });
    setAvatarUrl(urlToSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  async function addComment() {
    if (!commentText.trim() || !userIdParam) return;
    try {
      await api.post(`/profile-comments/${userIdParam}`, { body: commentText.trim() });
      setCommentText('');
      const { data: cData } = await api.get(`/profile-comments/${userIdParam}`);
      setComments(cData.comments || []);
    } catch {}
  }

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="space-y-4">
          <div className="h-32 rounded-xl animate-shimmer bg-surface" />
          <div className="h-8 rounded animate-shimmer bg-surface w-1/3" />
          <div className="h-4 rounded animate-shimmer bg-surface w-2/3" />
        </div>
      </div>
    );
  }

  if (isOwnProfile) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="font-display text-4xl tracking-wide text-white mb-6">PROFİLİM</h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-honey flex items-center justify-center text-2xl font-semibold text-ink overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              user.username[0].toUpperCase()
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-white">{user.username}</p>
            <p className="text-sm text-muted">{user.email}</p>
            {user.role === 'admin' && (
              <span className="text-[11px] uppercase tracking-wider text-honey font-mono">Yönetici</span>
            )}
          </div>
        </div>

        <form onSubmit={save} className="bg-surface border border-white/5 rounded-lg p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted block mb-1">Avatar URL</label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-surface2 rounded-md px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-honey"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Hakkımda</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Favori türlerin, izlediğin son diziler..."
              className="w-full bg-surface2 rounded-md px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-honey resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-honey hover:bg-honey-light text-ink font-semibold rounded-md py-2.5 text-sm transition-colors"
          >
            {saved ? 'Kaydedildi ✓' : 'Kaydet'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-surface rounded-2xl border border-white/[0.06] overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-honey/20 to-honey/5" />
        <div className="px-8 pb-8 -mt-16">
          <div className="flex items-end gap-6 mb-6">
            <div className="w-32 h-32 rounded-full bg-surface2 border-4 border-surface overflow-hidden flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-honey">{profile?.username?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-white">{profile?.username}</h1>
              <p className="text-muted mt-1">{profile?.friend_count} arkadaş</p>
            </div>
            <div className="pb-2">
              {friendStatus === 'friends' ? (
                <button onClick={removeFriend} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-red-400 hover:bg-red-400/10 transition-colors">
                  <UserMinus size={14} /> Arkadaşı Kaldır
                </button>
              ) : friendStatus === 'sent' ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] text-sm text-muted">
                  <Clock size={14} /> İstek Gönderildi
                </span>
              ) : friendStatus === 'received' ? (
                <button onClick={acceptRequest} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-honey text-ink text-sm font-semibold hover:bg-honey-light transition-colors">
                  <Check size={14} /> İsteği Kabul Et
                </button>
              ) : (
                <button onClick={sendRequest} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-honey text-ink text-sm font-semibold hover:bg-honey-light transition-colors">
                  <UserPlus size={14} /> Arkadaş Ekle
                </button>
              )}
            </div>
          </div>
          
          {profile?.bio && (
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{profile.bio}</p>
          )}
        </div>
      </div>

      {profile?.watched_items && profile.watched_items.length > 0 && (
        <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Favoriler</h2>
          <div className="grid grid-cols-4 gap-3">
            {profile.watched_items.map((item, i) => (
              <div key={i} className="aspect-[2/3] rounded-lg bg-surface2 overflow-hidden relative group">
                {item.poster_url ? (
                  <img src={item.poster_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-xs">{item.title}</div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white font-medium truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-white/[0.06] p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare size={18} /> Profil Yorumları
        </h2>
        
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">Henüz yorum yapılmamış.</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface2 overflow-hidden shrink-0 flex items-center justify-center">
                  {comment.author.avatar_url ? (
                    <img src={comment.author.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-honey">{comment.author.username[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-white">{comment.author.username}</span>
                    <span className="text-xs text-muted">{new Date(comment.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{comment.body}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Yorum yaz..."
            onKeyDown={(e) => e.key === 'Enter' && addComment()}
            className="flex-1 px-4 py-2.5 bg-ink border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-honey/40 focus:ring-1 focus:ring-honey/20 transition-all"
          />
          <button
            onClick={addComment}
            disabled={!commentText.trim()}
            className="px-4 py-2.5 bg-honey text-ink rounded-xl hover:bg-honey-light transition-colors disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
