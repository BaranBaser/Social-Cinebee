'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saved, setSaved] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlToSave = avatarUrl || '';
    const { data } = await api.put('/auth/me', { bio, avatar_url: urlToSave });
    const bustUrl = urlToSave ? `${urlToSave.split('?')[0]}?t=${Date.now()}` : '';
    updateUser({ ...data.user, avatar_url: bustUrl });
    setAvatarUrl(bustUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

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

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
