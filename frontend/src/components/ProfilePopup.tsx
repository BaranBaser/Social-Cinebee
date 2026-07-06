'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, UserPlus, UserMinus, Check, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ProfileData {
  id: string;
  username: string;
  bio: string;
  avatar_url: string;
  role: string;
  created_at: string;
  friend_count: number;
}

interface Props {
  userId: string;
  onClose: () => void;
}

export default function ProfilePopup({ userId, onClose }: Props) {
  const router = useRouter();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<'none' | 'sent' | 'received' | 'friends'>('none');
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  async function loadProfile() {
    setLoading(true);
    try {
      const { data } = await api.get(`/auth/users/${userId}`);
      setProfile(data.user);

      if (me && me.id !== userId) {
        const { data: fData } = await api.get('/social/friends');
        const isFriend = (fData.friends || []).some((f: { id: string }) => f.id === userId);
        if (isFriend) {
          setFriendStatus('friends');
        } else {
          const { data: rData } = await api.get('/social/friends/requests');
          const incoming = (rData.requests || []).find((r: { from: { id: string } }) => r.from.id === userId);
          if (incoming) {
            setFriendStatus('received');
            setRequestId(incoming.id);
          } else {
            setFriendStatus('none');
          }
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function sendRequest() {
    try {
      await api.post('/social/friends/request', { user_id: userId });
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
      await api.delete(`/social/friends/${userId}`);
      setFriendStatus('none');
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/[0.06] text-muted hover:text-white transition-colors z-10">
          <X size={16} />
        </button>

        {loading ? (
          <div className="p-8 space-y-4">
            <div className="w-20 h-20 rounded-full animate-shimmer bg-surface2 mx-auto" />
            <div className="h-4 rounded animate-shimmer bg-surface2 w-1/2 mx-auto" />
            <div className="h-3 rounded animate-shimmer bg-surface2 w-2/3 mx-auto" />
          </div>
        ) : profile ? (
          <>
            <div className="h-20 bg-gradient-to-r from-honey/20 to-honey/5" />
            <div className="px-6 pb-6 -mt-10 text-center">
              <div 
                onClick={() => { onClose(); router.push(`/profile/${profile.id}`); }}
                className="cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-surface2 border-4 border-surface mx-auto mb-3 overflow-hidden flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-honey">{profile.username[0].toUpperCase()}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{profile.username}</h3>
                {profile.bio && <p className="text-sm text-muted mt-1 line-clamp-3">{profile.bio}</p>}
              </div>
              <p className="text-xs text-gray-600 mt-2">{profile.friend_count} arkadaş</p>

              {me && me.id !== profile.id && (
                <div className="mt-4">
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
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-muted text-sm">Kullanıcı bulunamadı.</div>
        )}
      </div>
    </div>
  );
}
