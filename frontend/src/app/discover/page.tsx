'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ContentCard from '@/components/ContentCard';
import { Suspense } from 'react';

interface ContentItem {
  key: string;
  type: string;
  title: string;
  poster: string | null;
  backdrop?: string | null;
  rating: number;
  year: string;
  overview?: string;
  status?: string;
}

const TYPES = [
  { key: 'all', label: 'Tümü' },
  { key: 'movie', label: 'Filmler' },
  { key: 'tv', label: 'Diziler' },
  { key: 'anime', label: 'Animeler' },
];

const FILTERS = [
  { key: 'popular', label: 'Popüler' },
  { key: 'trending', label: 'Trend' },
  { key: 'new', label: 'Yeni Çıkanlar' },
  { key: 'top_rated', label: 'En Yüksek Puanlı' },
  { key: 'most_watched', label: 'En Çok İzlenen' },
];

function DiscoverInner() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'all';
  const filterParam = searchParams.get('filter') || 'popular';

  const [type, setType] = useState(typeParam);
  const [filter, setFilter] = useState(filterParam);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadContent = useCallback(async (pageNum: number, reset: boolean) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      if (type === 'all') {
        const [movieRes, tvRes, animeRes] = await Promise.all([
          api.get('/content/trending', { params: { type: 'movie', filter, page: pageNum } }),
          api.get('/content/trending', { params: { type: 'tv', filter, page: pageNum } }),
          api.get('/content/trending', { params: { type: 'anime', filter, page: pageNum } }),
        ]);
        const movieItems = (movieRes.data.results || []);
        const tvItems = (tvRes.data.results || []);
        const animeItems = (animeRes.data.results || []);

        const all: ContentItem[] = [];
        const maxLen = Math.max(movieItems.length, tvItems.length, animeItems.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < movieItems.length) all.push(movieItems[i]);
          if (i < tvItems.length) all.push(tvItems[i]);
          if (i < animeItems.length) all.push(animeItems[i]);
        }

        if (reset) setItems(all);
        else setItems(prev => [...prev, ...all]);
        setHasMore(movieItems.length >= 20 || tvItems.length >= 20 || animeItems.length >= 20);
      } else {
        const { data } = await api.get('/content/trending', { params: { type, filter, page: pageNum } });
        const results = data.results || [];
        if (reset) setItems(results);
        else setItems(prev => [...prev, ...results]);
        setHasMore(results.length >= 20);
      }
    } catch {
      if (reset) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [type, filter]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadContent(1, true);
  }, [loadContent]);

  useEffect(() => {
    if (!observerRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const next = page + 1;
          setPage(next);
          loadContent(next, false);
        }
      },
      { threshold: 0, rootMargin: '400px' }
    );
    obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading, loadingMore, page, loadContent]);

  return (
    <div className="px-6 py-6">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              type === t.key
                ? 'bg-honey text-ink shadow-lg shadow-honey/20'
                : 'bg-white/[0.04] text-muted hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-muted hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[2/3] rounded-xl animate-shimmer bg-surface2" />
              <div className="h-4 rounded-md animate-shimmer bg-surface2 w-3/4" />
              <div className="h-3 rounded-md animate-shimmer bg-surface2 w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-muted text-sm py-20 text-center">İçerik bulunamadı.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map((item, i) => (
              <ContentCard key={`${item.key}-${i}`} item={item} />
            ))}
          </div>
          <div ref={observerRef} className="h-20 flex items-center justify-center">
            {loadingMore && (
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-honey animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-honey animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-honey animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            {!hasMore && items.length > 0 && !loadingMore && (
              <span className="text-muted text-xs">Tüm içerikler yüklendi.</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="px-6 py-6">
        <div className="flex gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 w-24 rounded-full animate-shimmer bg-surface2" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[2/3] rounded-xl animate-shimmer bg-surface2" />
              <div className="h-4 rounded-md animate-shimmer bg-surface2 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    }>
      <DiscoverInner />
    </Suspense>
  );
}
