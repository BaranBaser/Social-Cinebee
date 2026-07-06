'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface TopBarProps {
  onOpenChat: () => void;
}

export default function TopBar({ onOpenChat }: TopBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-ink/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="h-14 grid grid-cols-[1fr_auto_1fr] items-center px-6 gap-4">
        <div />

        <form onSubmit={handleSearch} className="w-80">
          <div className="flex items-center gap-2 bg-white/[0.06] rounded-full px-4 py-2 border border-white/[0.06] hover:border-white/[0.1] transition-colors focus-within:border-honey/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Film, dizi, anime ara..."
              className="bg-transparent text-sm outline-none flex-1 text-white placeholder:text-muted"
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-2">
          {user && (
            <button
              onClick={() => router.push('/?new=1')}
              className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-muted hover:text-white"
              title="Yeni Ekle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
              </svg>
            </button>
          )}

          <button
            className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-muted hover:text-white relative"
            title="Bildirimler"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-honey rounded-full" />
          </button>

          {user && (
            <button
              onClick={onOpenChat}
              className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-muted hover:text-white"
              title="Mesajlar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
              </svg>
            </button>
          )}

          {user ? (
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
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/login" className="px-3 py-1.5 text-sm rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-colors">
                Giriş yap
              </Link>
              <Link href="/register" className="px-3 py-1.5 text-sm rounded-lg bg-honey text-ink font-semibold hover:bg-honey-light transition-colors">
                Kayıt ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
