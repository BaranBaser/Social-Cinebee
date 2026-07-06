'use client';

import { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ContentCard from '@/components/ContentCard';

interface ContentItem {
  key: string;
  type: string;
  title: string;
  original_title?: string;
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

const FILTERS = [
  { key: 'popular', label: 'Popüler' },
  { key: 'trending', label: 'Trend' },
  { key: 'new', label: 'Yeni' },
  { key: 'top_rated', label: 'En Yüksek Puan' },
];

const SORTS = [
  { key: 'rating', label: 'Puana Göre' },
  { key: 'year', label: 'Yeniye Göre' },
];

function ParticlesBg() {
  const particles = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 5 + Math.random() * 7,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.5,
    drift: -30 + Math.random() * 60,
  }));

  return (
    <>
      <style>{`
        @keyframes particleFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: var(--p-opacity); }
          80% { opacity: var(--p-opacity); }
          100% { transform: translateY(-100vh) translateX(var(--p-drift)); opacity: 0; }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute bottom-0 rounded-full bg-honey"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 2}px ${p.size / 2}px rgba(245, 197, 24, 0.6)`,
              '--p-opacity': p.opacity,
              '--p-drift': `${p.drift}px`,
              animation: `particleFloat ${p.duration}s ${p.delay}s linear infinite`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}

function HomeInner() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || '';
  const genreParam = searchParams.get('genre') || '';
  const filterParam = searchParams.get('filter') || '';

  const [type, setType] = useState(typeParam || 'movie');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [loadingHome, setLoadingHome] = useState(true);
  const [warning, setWarning] = useState('');
  const [featured, setFeatured] = useState<ContentItem | null>(null);
  const [popular, setPopular] = useState<ContentItem[]>([]);
  const [trending, setTrending] = useState<ContentItem[]>([]);
  const [newItems, setNewItems] = useState<ContentItem[]>([]);
  const [topRated, setTopRated] = useState<ContentItem[]>([]);
  const [mostWatched, setMostWatched] = useState<ContentItem[]>([]);

  // Filter state
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState(genreParam);
  const [selectedFilter, setSelectedFilter] = useState(filterParam);
  const [selectedSort, setSelectedSort] = useState('rating');
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [filteredPage, setFilteredPage] = useState(1);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const hasActiveFilter = selectedGenre || selectedFilter || selectedSort !== 'rating';

  // Load filtered content
  const loadFiltered = useCallback(async (page = 1) => {
    setLoadingFiltered(true);
    try {
      const params: Record<string, string> = { type, page: String(page), sort: selectedSort };
      if (selectedGenre) params.genre = selectedGenre;
      if (selectedFilter) params.filter = selectedFilter;
      const { data } = await api.get('/content/browse', { params });
      if (page === 1) {
        setFilteredItems(data.results || []);
        setFilteredTotal(data.total || 0);
      } else {
        setFilteredItems(prev => [...prev, ...(data.results || [])]);
      }
    } catch {} finally { setLoadingFiltered(false); }
  }, [type, selectedGenre, selectedFilter, selectedSort]);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingFiltered && filteredItems.length < filteredTotal) {
        setFilteredPage((prev) => {
          const next = prev + 1;
          loadFiltered(next);
          return next;
        });
      }
    }, { threshold: 0.1 });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadingFiltered, filteredItems.length, filteredTotal, loadFiltered]);

  useEffect(() => {
    setType(typeParam || 'movie');
    setSelectedGenre(genreParam);
    setSelectedFilter(filterParam);
  }, [typeParam, genreParam, filterParam]);

  // Load genres for current type
  useEffect(() => {
    api.get('/content/genres', { params: { type } })
      .then(({ data }) => setGenres(data.genres || []))
      .catch(() => setGenres([]));
  }, [type]);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    }
    if (showFilters) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFilters]);

  // Load home sections
  const loadHomeData = useCallback(async () => {
    setLoadingHome(true);
    try {
      const [popRes, trendRes, newRes, topRes, watchRes] = await Promise.all([
        api.get('/content/trending', { params: { type, filter: 'popular', page: 1 } }),
        api.get('/content/trending', { params: { type, filter: 'trending', page: 1 } }),
        api.get('/content/trending', { params: { type, filter: 'new', page: 1 } }),
        api.get('/content/trending', { params: { type, filter: 'top_rated', page: 1 } }),
        api.get('/content/trending', { params: { type, filter: 'most_watched', page: 1 } }),
      ]);

      const popResults = popRes.data.results || [];
      if (popResults.length > 0) setFeatured(popResults[0]);
      setPopular(popResults.slice(1, 13));
      setTrending((trendRes.data.results || []).slice(0, 12));
      setNewItems((newRes.data.results || []).slice(0, 12));
      setTopRated((topRes.data.results || []).slice(0, 12));
      setMostWatched((watchRes.data.results || []).slice(0, 12));
    } catch (err) {
      console.error('loadHomeData error:', err);
    } finally {
      setLoadingHome(false);
    }
  }, [type]);


  useEffect(() => {
    if (!query.trim()) {
      if (hasActiveFilter) {
        setFilteredPage(1);
        loadFiltered(1);
      } else {
        loadHomeData();
      }
    }
  }, [loadHomeData, loadFiltered, query, hasActiveFilter]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  function resetFilters() {
    setSelectedGenre('');
    setSelectedFilter('');
    setSelectedSort('rating');
  }

  function applyFilter(genre: string, filter: string, sort: string) {
    setSelectedGenre(genre);
    setSelectedFilter(filter);
    setSelectedSort(sort);
    setShowFilters(false);
  }

  return (
    <div className="relative px-6 py-4 overflow-hidden">
      <ParticlesBg />
      {query.trim() ? (
        <div className="relative z-10">
          <SearchResults query={query} type={type} setType={setType} />
        </div>
      ) : (
        <div className="relative z-10 space-y-4">
          {/* Featured */}
          {featured && !hasActiveFilter && (
            <div className="relative rounded-2xl overflow-hidden bg-surface border border-white/[0.06] h-[260px] flex items-end">
              <div className="absolute inset-0">
                {featured.backdrop && (
                  <img src={featured.backdrop} alt={featured.title} className="w-full h-full object-cover opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
              </div>
              <div className="relative z-10 p-6 max-w-xl">
                <span className="inline-block text-[10px] font-black tracking-[0.2em] bg-honey text-ink px-3 py-1 rounded mb-3 uppercase">
                  Öne Çıkan
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{featured.title}</h2>
                <div className="flex items-center gap-3 mb-2 text-sm text-muted">
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
                  <p className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-1">{featured.overview}</p>
                )}
              </div>
            </div>
          )}

          {/* Filter Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter trigger */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  hasActiveFilter
                    ? 'bg-honey/10 text-honey border-honey/30'
                    : 'bg-white/[0.04] text-muted hover:text-white hover:bg-white/[0.08] border-white/[0.06]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filtrele
                {hasActiveFilter && (
                  <span className="w-1.5 h-1.5 rounded-full bg-honey" />
                )}
              </button>

              {showFilters && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-surface border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Filtrele</h3>
                    {hasActiveFilter && (
                      <button onClick={resetFilters} className="text-[11px] text-honey hover:text-honey-light transition-colors">Sıfırla</button>
                    )}
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Genre */}
                    <div>
                      <label className="text-xs text-muted font-medium mb-1.5 block">Tür</label>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                        <button
                          onClick={() => applyFilter('', selectedFilter, selectedSort)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            !selectedGenre ? 'bg-honey text-ink' : 'bg-white/[0.06] text-muted hover:text-white'
                          }`}
                        >
                          Hepsi
                        </button>
                        {genres.map(g => (
                          <button
                            key={g}
                            onClick={() => applyFilter(g, selectedFilter, selectedSort)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              selectedGenre === g ? 'bg-honey text-ink' : 'bg-white/[0.06] text-muted hover:text-white'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter */}
                    <div>
                      <label className="text-xs text-muted font-medium mb-1.5 block">Sıralama</label>
                      <div className="flex flex-wrap gap-1.5">
                        {FILTERS.map(f => (
                          <button
                            key={f.key}
                            onClick={() => applyFilter(selectedGenre, f.key, selectedSort)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              selectedFilter === f.key ? 'bg-honey text-ink' : 'bg-white/[0.06] text-muted hover:text-white'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="text-xs text-muted font-medium mb-1.5 block">Gösterim</label>
                      <div className="flex flex-wrap gap-1.5">
                        {SORTS.map(s => (
                          <button
                            key={s.key}
                            onClick={() => applyFilter(selectedGenre, selectedFilter, s.key)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              selectedSort === s.key ? 'bg-honey text-ink' : 'bg-white/[0.06] text-muted hover:text-white'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filtered Results */}
          {hasActiveFilter ? (
            <div>
              {loadingFiltered && filteredPage === 1 ? (
                <div className="grid grid-cols-6 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}>
                      <div className="aspect-[2/3] rounded-xl animate-shimmer bg-surface2" />
                      <div className="h-3 rounded-md animate-shimmer bg-surface2 w-3/4 mt-2" />
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted text-sm">Bu filtrelerle sonuç bulunamadı.</p>
                  <button onClick={resetFilters} className="text-honey text-sm mt-2 hover:text-honey-light transition-colors">Filtreleri sıfırla</button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-muted mb-3">{filteredTotal} sonuç bulundu</p>
                  <div className="grid grid-cols-6 gap-3">
                    {filteredItems.map((item, i) => (
                      <ContentCard key={`${item.key}-${i}`} item={item} />
                    ))}
                  </div>
                  {filteredItems.length < filteredTotal && (
                    <div ref={loadMoreRef} className="flex justify-center mt-6 py-4">
                      {loadingFiltered && <span className="text-sm text-muted">Yükleniyor...</span>}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <Section title="Şimdi Popüler" items={popular} loading={loadingHome} />
              <Section title="Trend" items={trending} loading={loadingHome} />
              <Section title="Yeni Eklenenler" items={newItems} loading={loadingHome} />
              <Section title="En Yüksek Puanlılar" items={topRated} loading={loadingHome} />
              <Section title="En Çok İzlenenler" items={mostWatched} loading={loadingHome} />
            </>
          )}
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

function Section({ title, items, loading }: { title: string; items: ContentItem[]; loading: boolean }) {
  return (
    <section>
      <h2 className="text-base font-bold text-white mb-2">{title}</h2>
      {loading ? (
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[2/3] rounded-xl animate-shimmer bg-surface2" />
              <div className="h-3 rounded-md animate-shimmer bg-surface2 w-3/4 mt-2" />
              <div className="h-2.5 rounded-md animate-shimmer bg-surface2 w-1/2 mt-1" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? null : (
        <div className="grid grid-cols-6 gap-3">
          {items.slice(0, 6).map((item, i) => (
            <div key={`${item.key}-${i}`}>
              <ContentCard item={item} />
            </div>
          ))}
        </div>
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
        {[{ key: 'all', label: 'Tümü' }, ...TYPES].map((t) => (
          <button key={t.key} onClick={() => setType(t.key)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            type === t.key ? 'bg-honey text-ink' : 'bg-white/[0.06] text-muted hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
          }`}>
            {t.label}
          </button>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-white mb-4">&ldquo;{query}&rdquo; için sonuçlar</h2>
      {loading ? (
        <div className="grid grid-cols-6 gap-3">
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
        <div className="grid grid-cols-6 gap-3">
          {items.map((item, i) => <ContentCard key={`${item.key}-${i}`} item={item} />)}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="px-6 py-4 overflow-hidden">
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-surface border border-white/[0.06] h-[260px]">
            <div className="absolute inset-0 animate-shimmer bg-surface2" />
          </div>
          <div className="flex gap-2">
            {TYPES.map((t) => <div key={t.key} className="h-8 w-20 rounded-full animate-shimmer bg-surface2" />)}
          </div>
          {Array.from({ length: 5 }).map((_, s) => (
            <div key={s}>
              <div className="h-4 w-32 rounded animate-shimmer bg-surface2 mb-2" />
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[2/3] rounded-xl animate-shimmer bg-surface2" />
                    <div className="h-3 rounded-md animate-shimmer bg-surface2 w-3/4 mt-2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <HomeInner />
    </Suspense>
  );
}
