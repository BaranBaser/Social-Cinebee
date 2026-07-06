'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function SettingsContent() {
  const { user, updateUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [activeSection, setActiveSection] = useState<'password' | 'account'>('account');
  const [version, setVersion] = useState('1.0.0');
  const router = useRouter();

  useEffect(() => {
    fetch('/version.json').then(r => r.json()).then(d => setVersion(d.version)).catch(() => {});
  }, []);

  async function changePassword() {
    setPasswordError('');
    if (!currentPassword || !newPassword) { setPasswordError('Tüm alanları doldurun.'); return; }
    if (newPassword.length < 6) { setPasswordError('Yeni şifre en az 6 karakter olmalı.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Şifreler eşleşmiyor.'); return; }
    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', { current_password: currentPassword, new_password: newPassword });
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch (err: any) {
      setPasswordError(err?.response?.data?.error || 'Şifre değiştirilemedi.');
    } finally { setSavingPassword(false); }
  }

  if (!user) return null;

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Ayarlar</h1>
        <p className="text-sm text-muted">Profil ve hesap ayarlarını yönet</p>
      </div>

      <div className="flex gap-6">
        {/* Left: Profile preview + nav */}
        <div className="w-64 shrink-0 space-y-4">
          {/* Profile Card */}
          <div className="bg-surface rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="px-5 pt-6 pb-5 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center ring-4 ring-honey/20 bg-ink">
                {user.avatar_url ? (
                  <img src={user.avatar_url.split('?')[0]} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <span className="text-2xl font-bold text-honey">{user.username[0].toUpperCase()}</span>
                )}
              </div>
              <p className="text-base font-bold text-white">{user.username}</p>
              <p className="text-xs text-muted mt-0.5">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 text-[10px] font-bold tracking-wider uppercase bg-honey/15 text-honey px-2.5 py-1 rounded-full border border-honey/20">Yonetici</span>
              )}
              {user.bio && <p className="text-xs text-gray-400 mt-3 line-clamp-3 leading-relaxed">{user.bio}</p>}
            </div>
          </div>

          {/* Nav */}
          <div className="bg-surface rounded-2xl border border-white/[0.06] p-2">
            {[
              { key: 'profile' as const, label: 'Profil', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
              { key: 'password' as const, label: 'Sifre', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
              { key: 'account' as const, label: 'Hesap', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/></svg> },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => {
                  if (item.key === 'profile') {
                    router.push('/profile');
                  } else {
                    setActiveSection(item.key as 'password' | 'account');
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.key === 'profile'
                    ? 'text-muted hover:text-white hover:bg-white/[0.04]'
                    : activeSection === item.key
                      ? 'bg-honey/10 text-honey'
                      : 'text-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'password' && (
            <div className="bg-surface rounded-2xl border border-white/[0.06] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-honey/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Şifre Değiştir</h2>
                  <p className="text-xs text-muted">Hesap güvenliğini güncelle</p>
                </div>
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="bg-ink/50 rounded-xl p-4 border border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <span className="text-xs font-medium text-gray-400">Mevcut şifre</span>
                  </div>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-ink border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-700 outline-none focus:border-honey/40 focus:ring-1 focus:ring-honey/20 transition-all" />
                </div>

                <div className="bg-ink/50 rounded-xl p-4 border border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                    </div>
                    <span className="text-xs font-medium text-gray-400">Yeni şifre</span>
                  </div>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full px-4 py-2.5 bg-ink border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-700 outline-none focus:border-honey/40 focus:ring-1 focus:ring-honey/20 transition-all" />
                </div>

                <div className="bg-ink/50 rounded-xl p-4 border border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-xs font-medium text-gray-400">Şifre tekrar</span>
                  </div>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifreni tekrar gir"
                    className="w-full px-4 py-2.5 bg-ink border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-700 outline-none focus:border-honey/40 focus:ring-1 focus:ring-honey/20 transition-all" />
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-red-400/10 border border-red-400/20 rounded-xl">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    <span className="text-xs text-red-400">{passwordError}</span>
                  </div>
                )}

                <button onClick={changePassword} disabled={savingPassword}
                  className="px-6 py-2.5 bg-honey text-ink text-sm font-bold rounded-xl hover:bg-honey-light transition-all disabled:opacity-40 shadow-lg shadow-honey/10">
                  {savingPassword ? (
                    <span className="flex items-center gap-2"><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Değiştiriliyor...</span>
                  ) : passwordSaved ? (
                    <span className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Değiştirildi!</span>
                  ) : 'Şifreyi Değiştir'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="space-y-4">
              <div className="bg-surface rounded-2xl border border-white/[0.06] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-honey/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/></svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Hesap Bilgileri</h2>
                    <p className="text-xs text-muted">Hesap detayları</p>
                  </div>
                </div>

                <div className="max-w-lg space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <span className="text-sm text-gray-400">Kullanıcı adı</span>
                    <span className="text-sm font-medium text-white">{user.username}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <span className="text-sm text-gray-400">E-posta</span>
                    <span className="text-sm font-medium text-white">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <span className="text-sm text-gray-400">Hesap türü</span>
                    <span className="text-sm font-medium text-white">{user.role === 'admin' ? 'Yönetici' : 'Üye'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-400">Üyelik</span>
                    <span className="text-sm font-medium text-white">{new Date(user.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-2xl border border-red-400/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-red-400/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-red-400">Tehlikeli Bölge</h2>
                    <p className="text-xs text-muted">Geri alınamaz işlemler</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4 max-w-lg">Hesabınızı silmek istiyorsanız yönetici ile iletişime geçin. Bu işlem geri alınamaz.</p>
                <button disabled className="px-5 py-2 bg-red-400/10 text-red-400 text-sm font-medium rounded-xl border border-red-400/20 cursor-not-allowed opacity-50">
                  Hesabı Sil
                </button>
              </div>

              <div className="bg-surface rounded-2xl border border-white/[0.06] p-6">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Hakkında</h3>
                <p className="text-sm text-gray-400">Cinebee — Film, dizi ve anime takip platformu</p>
                <p className="text-xs text-gray-600 mt-1">Versiyon {version}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <ProtectedRoute><SettingsContent /></ProtectedRoute>;
}
