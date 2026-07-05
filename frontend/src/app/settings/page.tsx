'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
    }
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/auth/profile', { bio });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Ayarlar</h1>
          <p className="text-xs text-muted">Profil ve uygulama ayarları</p>
        </div>
      </div>

      <div className="max-w-lg space-y-6">
        <div className="bg-surface rounded-xl p-5 border border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white mb-4">Profil Bilgileri</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted block mb-1.5">Kullanıcı Adı</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-3 py-2 bg-surface2 border border-white/[0.06] rounded-lg text-sm text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs text-muted block mb-1.5">E-posta</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 bg-surface2 border border-white/[0.06] rounded-lg text-sm text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs text-muted block mb-1.5">Biyografi</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kendin hakkında kısa bir bilgi yaz..."
                className="w-full px-3 py-2 bg-surface2 border border-white/[0.06] rounded-lg text-sm text-white placeholder-muted resize-none outline-none focus:border-honey/40"
                rows={3}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-honey text-ink text-sm font-bold rounded-lg hover:bg-honey-light transition-colors disabled:opacity-40"
            >
              {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}
            </button>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white mb-2">Hakkında</h2>
          <p className="text-xs text-muted leading-relaxed">
            Cinebee — Film, dizi ve anime takip platformu. Versiyon 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
