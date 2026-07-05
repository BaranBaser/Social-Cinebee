'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ContentCard from '@/components/ContentCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface LibraryItem {
  id: number;
  content_key: string;
  content_title: string;
  content_poster: string;
  content_type: string;
  status: string;
  created_at: string;
}

function LibraryContent() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'watched' | 'watchlist'>('watched');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [stats, setStats] = useState({ watched: 0, watchlist: 0 });
  const [loading, setLoading] = useState(true);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const [libRes, statsRes] = await Promise.all([
        api.get('/library', { params: { status: tab } }),
        api.get('/library/stats'),
      ]);
      setItems(libRes.data.items || []);
      setStats(statsRes.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLibrary(); }, [tab]);

  const removeItem = async (key: string) => {
    await api.delete(`/library/${encodeURIComponent(key)}`);
    loadLibrary();
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        Kütüphanem
      </h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('watched')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
            tab === 'watched'
              ? 'bg-[#c0392b] text-white shadow-lg shadow-[#c0392b]/20'
              : 'bg-white/[0.04] text-gray-500 hover:text-white border border-white/[0.06]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          İzledi ({stats.watched})
        </button>
        <button
          onClick={() => setTab('watchlist')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
            tab === 'watchlist'
              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
              : 'bg-white/[0.04] text-gray-500 hover:text-white border border-white/[0.06]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
          İzleyecek ({stats.watchlist})
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-white/[0.04] rounded-2xl" />
              <div className="mt-2.5 h-3.5 bg-white/[0.04] rounded-md w-3/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 mx-auto mb-4">
            <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          </svg>
          <p className="text-gray-500 text-sm">
            {tab === 'watched' ? 'Henüz hiçbir içerik izlemediniz.' : 'İzleme listeniz boş.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-10">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ContentCard
                item={{
                  key: item.content_key,
                  type: item.content_type || 'movie',
                  title: item.content_title || '',
                  poster: item.content_poster,
                  rating: 0,
                  year: '',
                }}
                badge={tab === 'watched' ? 'izlendi' : 'izleyecek'}
              />
              <button
                onClick={() => removeItem(item.content_key)}
                className="absolute top-3 right-3 z-10 p-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                title="Kutuphaneden kaldir"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <ProtectedRoute>
      <LibraryContent />
    </ProtectedRoute>
  );
}
