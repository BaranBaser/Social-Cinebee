'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface SearchResult {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string;
  relationship: 'none' | 'friends' | 'pending_sent' | 'pending_received';
}

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchUsers(query.trim());
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  async function searchUsers(q: string) {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/social/search', { params: { q } });
      setResults(data.users || []);
    } catch {
      setError('Arama yapılamadı.');
    } finally {
      setLoading(false);
    }
  }

  async function sendRequest(userId: string) {
    try {
      await api.post('/social/friends/request', { user_id: userId });
      setResults(prev => prev.map(u => u.id === userId ? { ...u, relationship: 'pending_sent' } : u));
    } catch {
      alert('İstek gönderilemedi.');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="bg-surface border border-white/[0.08] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col" onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-honey"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            Arkadaş Ekle
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/[0.1] text-muted hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Kullanıcı adı ara..."
              className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-honey/50 outline-none rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-muted transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
        </div>

        <div className="flex-1 overflow-y-auto max-h-80 p-4 pt-0 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-honey border-t-transparent rounded-full animate-spin" />
            </div>
          ) : query.length > 0 && query.length < 2 ? (
            <p className="text-center text-sm text-muted py-8">Aramak için en az 2 harf girin.</p>
          ) : results.length === 0 && query.length >= 2 ? (
            <p className="text-center text-sm text-muted py-8">Kullanıcı bulunamadı.</p>
          ) : (
            <div className="space-y-2">
              {results.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="w-10 h-10 rounded-full bg-honey/20 border border-honey/30 flex items-center justify-center text-sm font-bold text-honey shrink-0 overflow-hidden">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      u.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{u.username}</p>
                    <p className="text-[11px] text-muted truncate">{u.bio || 'Merhaba!'}</p>
                  </div>
                  {u.relationship === 'none' && (
                    <button onClick={() => sendRequest(u.id)} className="px-3 py-1.5 rounded-lg bg-honey text-ink text-xs font-bold hover:bg-honey-light transition-colors shrink-0">
                      Ekle
                    </button>
                  )}
                  {u.relationship === 'pending_sent' && (
                    <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white/50 text-xs font-semibold shrink-0 cursor-not-allowed">
                      İstek Gönderildi
                    </span>
                  )}
                  {u.relationship === 'pending_received' && (
                    <span className="px-3 py-1.5 rounded-lg bg-white/10 text-honey text-xs font-semibold shrink-0">
                      İstek Var
                    </span>
                  )}
                  {u.relationship === 'friends' && (
                    <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white/50 text-xs font-semibold shrink-0">
                      Arkadaş
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
