'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ImageUploadModal from '@/components/ImageUploadModal';

interface ProfileData {
  id: string;
  username: string;
  bio: string;
  avatar_url: string;
  banner_url: string;
  role: string;
  created_at: string;
  friend_count: number;
}

interface WatchedItem {
  title: string;
  poster: string | null;
  type: string;
  key: string;
  added_at: string;
}

interface Comment {
  id: string;
  body: string;
  author: { username: string; avatar_url: string };
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'az once';
  if (mins < 60) return `${mins}dk once`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}sa once`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} gun once`;
  const months = Math.floor(days / 30);
  return `${months} ay once`;
}

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userIdParam = searchParams.get('userId');

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [watched, setWatched] = useState<WatchedItem[]>([]);
  const [totalWatched, setTotalWatched] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<'none' | 'sent' | 'received' | 'friends'>('none');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'favorites' | 'comments'>('favorites');

  const isOwnProfile = !userIdParam || userIdParam === user?.id?.toString();

  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [bannerUrl, setBannerUrl] = useState(user?.banner_url || '');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadModal, setUploadModal] = useState<'avatar' | 'banner' | null>(null);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
      setBannerUrl(user.banner_url || '');
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
      setWatched(data.watched?.items || []);
      setTotalWatched(data.watched?.total || 0);

      if (user && user.id.toString() !== userIdParam) {
        try {
          const { data: fData } = await api.get('/social/friends');
          const isFriend = (fData.friends || []).some((f: { id: string }) => f.id === userIdParam);
          if (isFriend) {
            setFriendStatus('friends');
          } else {
            const { data: rData } = await api.get('/social/friends/requests');
            const incoming = (rData.requests || []).find((r: { from: { id: string } }) => r.from.id === userIdParam);
            if (incoming) { setFriendStatus('received'); setRequestId(incoming.id); }
          }
        } catch {}
      }

      try {
        const { data: cData } = await api.get(`/profile-comments/${userIdParam}`);
        setComments(cData.comments || []);
      } catch {}
    } catch {} finally { setLoading(false); }
  }

  async function sendRequest() {
    try { await api.post('/social/friends/request', { user_id: userIdParam }); setFriendStatus('sent'); } catch {}
  }
  async function acceptRequest() {
    if (!requestId) return;
    try { await api.post(`/social/friends/accept/${requestId}`); setFriendStatus('friends'); } catch {}
  }
  async function removeFriend() {
    try { await api.delete(`/social/friends/${userIdParam}`); setFriendStatus('none'); } catch {}
  }

  async function uploadFile(file: File, type: 'avatar' | 'banner') {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(`/upload/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.ok) {
        const bustUrl = `${data.url}?t=${Date.now()}`;
        if (type === 'avatar') {
          setAvatarUrl(bustUrl);
          updateUser({ ...user, avatar_url: bustUrl });
        } else {
          setBannerUrl(bustUrl);
          updateUser({ ...user, banner_url: bustUrl });
        }
        setUploadModal(null);
      }
    } catch {} finally { setUploading(false); }
  }

  const saveProfile = async () => {
    const urlToSave = avatarUrl || '';
    const bannerToSave = bannerUrl || '';
    const { data } = await api.put('/auth/me', { bio, avatar_url: urlToSave, banner_url: bannerToSave });
    const bustUrl = urlToSave ? `${urlToSave.split('?')[0]}?t=${Date.now()}` : '';
    const bustBanner = bannerToSave ? `${bannerToSave.split('?')[0]}?t=${Date.now()}` : '';
    updateUser({ ...data.user, avatar_url: bustUrl, banner_url: bustBanner });
    setAvatarUrl(bustUrl);
    setBannerUrl(bustBanner);
    setSaved(true);
    setEditing(false);
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

  async function deleteComment(commentId: string) {
    try {
      await api.delete(`/profile-comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {}
  }

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-shimmer bg-surface h-48 rounded-2xl mb-6" />
        <div className="flex items-end gap-6 -mt-16 px-8">
          <div className="w-28 h-28 rounded-full animate-shimmer bg-surface2 border-4 border-ink" />
          <div className="pb-2 space-y-2">
            <div className="h-8 w-48 rounded animate-shimmer bg-surface2" />
            <div className="h-4 w-32 rounded animate-shimmer bg-surface2" />
          </div>
        </div>
      </div>
    );
  }

  const displayName = isOwnProfile ? user.username : profile?.username || '';
  const displayAvatar = isOwnProfile ? avatarUrl : profile?.avatar_url || '';
  const displayBanner = isOwnProfile ? bannerUrl : profile?.banner_url || '';
  const displayBio = isOwnProfile ? bio : profile?.bio || '';
  const displayRole = isOwnProfile ? user.role : profile?.role || '';
  const displayCreatedAt = isOwnProfile ? user.created_at : profile?.created_at || '';
  const displayFriendCount = isOwnProfile ? 0 : profile?.friend_count || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hidden file inputs */}
      <ImageUploadModal
        open={uploadModal === 'avatar'}
        onClose={() => setUploadModal(null)}
        onUpload={(file) => uploadFile(file, 'avatar')}
        type="avatar"
        uploading={uploading}
      />
      <ImageUploadModal
        open={uploadModal === 'banner'}
        onClose={() => setUploadModal(null)}
        onUpload={(file) => uploadFile(file, 'banner')}
        type="banner"
        uploading={uploading}
      />

      {/* Banner */}
      <div
        className="relative rounded-2xl overflow-hidden h-48 mb-0 group cursor-pointer"
        onClick={() => isOwnProfile && setUploadModal('banner')}
      >
        {displayBanner ? (
          <img src={displayBanner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-honey/20 via-ink to-ink" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(245,197,24,0.15), transparent 60%)' }} />
          </>
        )}
        {isOwnProfile && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span className="text-xs text-white font-medium">{uploading ? 'Yukleniyor...' : 'Banner Yükle'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="relative px-8 pb-6">
        <div className="flex items-end gap-6 -mt-14">
          {/* Avatar */}
          <div className="relative shrink-0 group">
            <div
              className="w-28 h-28 rounded-full bg-surface2 border-4 border-ink overflow-hidden flex items-center justify-center shadow-xl shadow-black/30 cursor-pointer"
              onClick={() => isOwnProfile && setUploadModal('avatar')}
            >
              {displayAvatar ? (
                <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-honey">{displayName[0]?.toUpperCase()}</span>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-ink rounded-full" />
            {isOwnProfile && (
              <div
                className="absolute inset-0 w-28 h-28 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer"
                onClick={() => setUploadModal('avatar')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pb-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white truncate">{displayName}</h1>
              {displayRole === 'admin' && (
                <span className="px-2 py-0.5 bg-honey/15 text-honey text-[10px] font-bold uppercase tracking-wider rounded shrink-0">Admin</span>
              )}
            </div>
            {displayCreatedAt && (
              <p className="text-xs text-gray-600 mt-1">
                {new Date(displayCreatedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })} tarihinden beri uye
              </p>
            )}
          </div>

          {/* Friend Action */}
          {!isOwnProfile && (
            <div className="pb-1 shrink-0">
              {friendStatus === 'friends' ? (
                <button onClick={removeFriend} className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                  Arkadas
                </button>
              ) : friendStatus === 'sent' ? (
                <span className="px-4 py-2 rounded-xl bg-white/[0.04] text-sm text-muted flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Gonderildi
                </span>
              ) : friendStatus === 'received' ? (
                <button onClick={acceptRequest} className="px-4 py-2 rounded-xl bg-honey text-ink text-sm font-semibold hover:bg-honey-light transition-colors flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Kabul Et
                </button>
              ) : (
                <button onClick={sendRequest} className="px-4 py-2 rounded-xl bg-honey text-ink text-sm font-semibold hover:bg-honey-light transition-colors flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  Arkadas Ekle
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bio */}
        {isOwnProfile ? (
          <div className="mt-4">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onBlur={saveProfile}
              rows={3}
              placeholder="Hakkinda bir seyler yaz..."
              className="w-full bg-ink border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-honey/40 transition-colors resize-none"
            />
          </div>
        ) : displayBio ? (
          <p className="text-sm text-gray-300 leading-relaxed mt-4">{displayBio}</p>
        ) : null}

        {/* Stats */}
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-white/[0.06]">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{!isOwnProfile ? displayFriendCount : '-'}</p>
            <p className="text-[11px] text-muted uppercase tracking-wider">Arkadas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{isOwnProfile ? '-' : totalWatched}</p>
            <p className="text-[11px] text-muted uppercase tracking-wider">Izlenen</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{comments.length}</p>
            <p className="text-[11px] text-muted uppercase tracking-wider">Yorum</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] mt-2">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'favorites' ? 'text-honey' : 'text-muted hover:text-white'
          }`}
        >
          Favoriler
          {activeTab === 'favorites' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-honey" />}
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'comments' ? 'text-honey' : 'text-muted hover:text-white'
          }`}
        >
          Yorumlar ({comments.length})
          {activeTab === 'comments' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-honey" />}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'favorites' && (
          <>
            {isOwnProfile ? (
              <div className="mb-4">
                <Link href="/library" className="text-xs text-honey hover:text-honey-light transition-colors">
                  Kutuphanenden favorilerini sec &rarr;
                </Link>
              </div>
            ) : null}
            {(isOwnProfile ? [] : watched).length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-surface mx-auto mb-4 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </div>
                <p className="text-sm text-muted">Henuz favori icerik yok</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {(isOwnProfile ? [] : watched).map((item, i) => (
                  <Link
                    key={i}
                    href={`/title/${item.key}`}
                    className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-surface2 border border-white/[0.04] hover:border-honey/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-honey/5"
                  >
                    {item.poster ? (
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-xs px-2 text-center">{item.title}</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold text-white line-clamp-2">{item.title}</p>
                      <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${item.type === 'anime' ? 'bg-rose-500/80 text-white' : item.type === 'tv' ? 'bg-emerald-500/80 text-white' : 'bg-honey/80 text-ink'}`}>
                        {item.type === 'tv' ? 'DIZI' : item.type === 'anime' ? 'ANIME' : 'FILM'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'comments' && (
          <div>
            {/* Comment Input */}
            {!isOwnProfile && (
              <div className="flex gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-surface2 border border-white/[0.06] flex items-center justify-center text-sm font-semibold text-white overflow-hidden shrink-0">
                  {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : user.username[0].toUpperCase()}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Yorum yaz..."
                    onKeyDown={(e) => e.key === 'Enter' && addComment()}
                    className="flex-1 px-4 py-2.5 bg-ink border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-honey/40 transition-colors"
                  />
                  <button
                    onClick={addComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-2.5 bg-honey text-ink rounded-xl hover:bg-honey-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-surface mx-auto mb-4 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>
                </div>
                <p className="text-sm text-muted">Henuz yorum yok</p>
                <p className="text-xs text-gray-600 mt-1">Ilk yorumu sen yap!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-surface2 border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                      {comment.author.avatar_url ? (
                        <img src={comment.author.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-honey">{comment.author.username[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1 bg-surface rounded-xl px-4 py-3 border border-white/[0.04]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{comment.author.username}</span>
                          <span className="text-[11px] text-gray-600">{timeAgo(comment.created_at)}</span>
                        </div>
                        {(isOwnProfile || comment.author.username === user.username) && (
                          <button onClick={() => deleteComment(comment.id)} className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{comment.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
