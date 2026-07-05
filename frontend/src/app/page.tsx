'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ContentCard from '@/components/ContentCard';

const TYPES = [
  { key: 'movie', label: 'Filmler', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" />
    </svg>
  )},
  { key: 'tv', label: 'Diziler', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="15" x="2" y="3" rx="2" /><polyline points="8 21 12 17 16 21" />
    </svg>
  )},
  { key: 'anime', label: 'Anime', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )},
];

const FILTERS = [
  { key: 'popular', label: 'POPÜLER' },
  { key: 'trending', label: 'TREND' },
  { key: 'new', label: 'YENİ ÇIKANLAR' },
  { key: 'most_watched', label: 'EN ÇOK İZLENENLER' },
  { key: 'top_rated', label: 'EN YÜKSEK PUANLI' },
];

interface ContentItem {
  key: string;
  type: string;
  title: string;
  poster: string | null;
  rating: number;
  year: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [type, setType] = useState('movie');
  const [filter, setFilter] = useState('popular');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [query, setQuery] = useState(queryParam);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [warning, setWarning] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const observerTarget = useRef(null);

  const loadContent = useCallback(async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const endpoint = query.trim() ? '/content/search' : '/content/trending';
      const params = query.trim()
        ? { q: query, type, page: pageNum }
        : { type, filter, page: pageNum };
      const { data } = await api.get(endpoint, { params });
      
      const newItems = data.results || [];
      if (newItems.length < 20) setHasMore(false);
      else setHasMore(true);

      if (pageNum === 1) setItems(newItems);
      else setItems(prev => [...prev, ...newItems]);
      
      setWarning(data.warning || '');
      setLastUpdate(new Date().toLocaleTimeString('tr-TR'));
    } catch {
      if (pageNum === 1) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [type, filter, query]);

  useEffect(() => {
    setPage(1);
    loadContent(1);
  }, [loadContent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadContent(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, hasMore, loading, loadingMore, page, loadContent]);

  useEffect(() => {
    if (queryParam) setQuery(queryParam);
  }, [queryParam]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16">
      {/* Hero Section */}
      <div className="pt-12 pb-20">
        <p className="text-[#c0392b] text-[11px] font-mono uppercase tracking-[0.2em] mb-3">CINEBEE - SOCIAL - TRACKER</p>
        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-wide text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Sinematik Keşif
        </h1>
        <p className="text-gray-300 text-base md:text-lg max-w-xl mb-10">
          Ruh halinize göre dizi, film ve anime önerileri. Tek bir çatı altında.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { setFilter('popular'); setQuery(''); }}
            className="px-6 py-2.5 bg-[#c0392b] text-white rounded-lg text-sm font-semibold hover:bg-[#a93226] transition-colors"
          >
            Keşfet
          </button>
          <Link
            href="/ai-assistant"
            className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
            AI Asistanını Dene
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-3">
        {TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => { setType(t.key); setQuery(''); }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              type === t.key
                ? 'bg-[#c0392b] text-white shadow-lg shadow-[#c0392b]/20'
                : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setQuery(''); }}
              className={`px-3.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                filter === f.key
                  ? 'bg-[#c0392b]/90 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white/[0.04] text-gray-400 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/[0.06] outline-none cursor-pointer hover:bg-white/[0.08] transition-colors">
            <option>Tümü</option>
          </select>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center gap-2 mb-6 text-gray-500 text-xs mt-10">
        <span className="w-2 h-2 rounded-full bg-[#c0392b] animate-pulse-live" />
        <span className="font-bold tracking-wider text-[#c0392b]">CANLI</span>
        {lastUpdate && (
          <span className="text-xs text-gray-400">
            Son güncelleme {lastUpdate}
          </span>
        )}
      </div>

      {/* Warning */}
      {warning && (
        <div className="mb-6 text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-5 py-4">
          {warning} Backend klasöründeki <code className="text-yellow-300 font-mono">.env</code> dosyasına geçerli bir <code className="text-yellow-300 font-mono">TMDB_API_KEY</code> ekleyin. <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener" className="underline hover:text-yellow-200">Buradan ücretsiz alabilirsiniz</a>.
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[2/3] rounded-2xl animate-shimmer bg-[#1a1a1a]" />
              <div className="h-4 rounded-md animate-shimmer bg-[#1a1a1a] w-3/4 mt-1" />
              <div className="h-3 rounded-md animate-shimmer bg-[#1a1a1a] w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-sm py-20 text-center">
          {query ? `"${query}" için sonuç bulunamadı.` : 'İçerik bulunamadı.'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-10">
            {items.map((item, index) => (
              <ContentCard key={`${item.key}-${index}`} item={item} />
            ))}
          </div>
          
          {/* Intersection Observer Target */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center pb-20">
            {loadingMore && (
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c0392b] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-[#c0392b] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-[#c0392b] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            {!hasMore && items.length > 0 && !loadingMore && (
              <span className="text-gray-500 text-sm">Daha fazla içerik bulunmuyor.</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
