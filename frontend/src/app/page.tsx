'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ContentCard from '@/components/ContentCard';

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
  { key: 'movie', label: 'Filmler' },
  { key: 'tv', label: 'Diziler' },
  { key: 'anime', label: 'Animeler' },
];

function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative group">
      <div ref={ref} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {children}
      </div>
    </div>
  );
}

function HomeInner() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || '';

  const [type, setType] = useState(typeParam || 'movie');
  const [query, setQuery] = useState(queryParam);
  const [loading, setLoading] = useState(true);
  const [loadingHome, setLoadingHome] = useState(true);
  const [warning, setWarning] = useState('');
  const [featured, setFeatured] = useState<ContentItem | null>(null);
  const [popular, setPopular] = useState<ContentItem[]>([]);
  const [trending, setTrending] = useState<ContentItem[]>([]);
  const [newItems, setNewItems] = useState<ContentItem[]>([]);
  const [topRated, setTopRated] = useState<ContentItem[]>([]);
  const [mostWatched, setMostWatched] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (typeParam) setType(typeParam);
  }, [typeParam]);

  const loadHomeData = useCallback(async () => {
    setLoadingHome(true);
    console.log('[CINEBEE] loadHomeData called, type:', type);
    try {
      const [popRes, trendRes, newRes, topRes, watchRes] = await Promise.all([
        api.get('/content/trending', { params: { type, filter: 'popular', page: 1 } }),
        api.get('/content/trending', { params: { type, filter: 'trending', page: 1 } }),
        api.get('/content/trending', { params: { type, filter: 'new', page: 1 } }),
        api.get('/content/trending', { params: { type, filter: 'top_rated', page: 1 } }),
        api.get('/content/trending', { params: { type, filter: 'most_watched', page: 1 } }),
      ]);

      const popResults = popRes.data.results || [];
      console.log('[CINEBEE] Results:', popResults.length, 'popular items');
      if (popResults.length > 0) setFeatured(popResults[0]);
      setPopular(popResults.slice(1, 13));
      setTrending((trendRes.data.results || []).slice(0, 12));
      setNewItems((newRes.data.results || []).slice(0, 12));
      setTopRated((topRes.data.results || []).slice(0, 12));
      setMostWatched((watchRes.data.results || []).slice(0, 12));
    } catch (err) {
      console.error('[CINEBEE] loadHomeData error:', err);
    } finally {
      setLoadingHome(false);
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (!query.trim()) {
      loadHomeData();
    }
  }, [loadHomeData, query]);

  useEffect(() => {
    if (queryParam) setQuery(queryParam);
  }, [queryParam]);

  return (
    <div className="px-6 py-6">
      {query.trim() ? (
        <SearchResults query={query} type={type} setType={setType} />
      ) : (
        <div className="space-y-10">
          {featured && (
            <div className="relative rounded-2xl overflow-hidden bg-surface border border-white/[0.06] min-h-[340px] flex items-end">
              <div className="absolute inset-0">
                {featured.backdrop && (
                  <img src={featured.backdrop} alt={featured.title} className="w-full h-full object-cover opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
              </div>
              <div className="relative z-10 p-8 max-w-xl">
                <span className="inline-block text-[10px] font-black tracking-[0.2em] bg-honey text-ink px-3 py-1 rounded mb-4 uppercase">
                  Öne Çıkan
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{featured.title}</h2>
                <div className="flex items-center gap-3 mb-3 text-sm text-muted">
                  <span>{featured.year}</span>
                  {featured.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518" stroke="#f5c518" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {featured.rating.toFixed(1)}
                    </span>
                  )}
                  <span className="text-xs bg-white/[0.08] px-2 py-0.5 rounded uppercase font-semibold">
                    {featured.type === 'tv' ? 'Dizi' : featured.type === 'anime' ? 'Anime' : 'Film'}
                  </span>
                </div>
                {featured.overview && (
                  <p className="text-sm text-gray-300 leading-relaxed mb-5 line-clamp-2">{featured.overview}</p>
                )}
                <div className="flex gap-3">
                  <Link href={`/title/${featured.key}`} className="px-6 py-2.5 bg-honey text-ink rounded-lg text-sm font-bold hover:bg-honey-light transition-colors">
                    Hemen İzle
                  </Link>
                  <button className="px-6 py-2.5 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/[0.06] transition-colors">
                    + Listeye Ekle
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
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
          </div>

          <Section title="Şimdi Popüler" items={popular} loading={loadingHome} type={type} filter="popular" />
          <Section title="Trend" items={trending} loading={loadingHome} type={type} filter="trending" />
          <Section title="Yeni Eklenenler" items={newItems} loading={loadingHome} type={type} filter="new" />
          <Section title="En Yüksek Puanlılar" items={topRated} loading={loadingHome} type={type} filter="top_rated" />
          <Section title="En Çok İzlenenler" items={mostWatched} loading={loadingHome} type={type} filter="most_watched" />
        </div>
      )}

      {warning && (
        <div className="fixed bottom-6 right-6 max-w-sm text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-5 py-4 z-50">
          {warning}
        </div>
      )}
    </div>
  );
}

function Section({ title, items, loading, type, filter }: { title: string; items: ContentItem[]; loading: boolean; type: string; filter: string }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <Link href={`/discover?type=${type}&filter=${filter}`} className="text-xs text-honey hover:text-honey-light transition-colors font-medium">
          Tümünü Gör →
        </Link>
      </div>
      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[160px]">
              <div className="aspect-[2/3] rounded-xl animate-shimmer bg-surface2" />
              <div className="h-4 rounded-md animate-shimmer bg-surface2 w-3/4 mt-2" />
              <div className="h-3 rounded-md animate-shimmer bg-surface2 w-1/2 mt-1" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? null : (
        <ScrollRow>
          {items.map((item, i) => (
            <div key={`${item.key}-${i}`} className="flex-shrink-0 w-[160px]">
              <ContentCard item={item} />
            </div>
          ))}
        </ScrollRow>
      )}
    </section>
  );
}

function SearchResults({ query, type, setType }: { query: string; type: string; setType: (t: string) => void }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/content/search', { params: { q: query, type, page: 1 } })
      .then(({ data }) => setItems(data.results || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [query, type]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        {TYPES.map((t) => (
          <button key={t.key} onClick={() => setType(t.key)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            type === t.key ? 'bg-honey text-ink' : 'bg-white/[0.06] text-muted hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
          }`}>
            {t.label}
          </button>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-white mb-4">&ldquo;{query}&rdquo; için sonuçlar</h2>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[2/3] rounded-xl animate-shimmer bg-surface2" />
              <div className="h-4 rounded-md animate-shimmer bg-surface2 w-3/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-muted text-sm py-20 text-center">&ldquo;{query}&rdquo; için sonuç bulunamadı.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((item, i) => <ContentCard key={`${item.key}-${i}`} item={item} />)}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="px-6 py-6">
        <div className="space-y-10">
          <div className="relative rounded-2xl overflow-hidden bg-surface border border-white/[0.06] min-h-[340px]">
            <div className="absolute inset-0 animate-shimmer bg-surface2" />
          </div>
          <div className="flex gap-3">
            {TYPES.map((t) => <div key={t.key} className="h-10 w-24 rounded-full animate-shimmer bg-surface2" />)}
          </div>
        </div>
      </div>
    }>
      <HomeInner />
    </Suspense>
  );
}
