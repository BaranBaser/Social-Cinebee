'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import Link from 'next/link';
import api, { baseKey } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import FilmstripRating from '@/components/FilmstripRating';
import ProfilePopup from '@/components/ProfilePopup';

interface CastMember {
  name: string;
  character: string;
  image: string | null;
  role?: string;
}

interface ContentData {
  key: string;
  type: string;
  title: string;
  tagline: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  rating: number;
  year: string;
  duration: number | null;
  genres: string[];
  status: string;
  number_of_seasons: number | null;
  number_of_episodes: number | null;
  trailer: string | null;
  credits?: { cast: CastMember[] };
  characters?: CastMember[];
  similar?: ContentData[];
}

interface Comment {
  id: number;
  body: string;
  is_removed: boolean;
  created_at: string;
  user: { id: number; username: string; avatar_url: string };
}

export default function ContentDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const key = params.key as string;
  const bk = baseKey(key);

  const [content, setContent] = useState<ContentData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [rating, setRating] = useState({ average: 0, count: 0, mine: null as number | null });
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [libraryStatus, setLibraryStatus] = useState<string | null>(null);
  const [profilePopupUser, setProfilePopupUser] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      const { data } = await api.get('/comments', { params: { content_key: bk } });
      setComments(data.comments);
      setRating(data.rating);
    } catch {}
  };

  const loadLibraryStatus = async () => {
    try {
      const { data } = await api.get(`/library/check/${encodeURIComponent(bk)}`);
      setLibraryStatus(data.status);
    } catch {}
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/content/detail', { params: { key } }).then((r) => setContent(r.data.content)),
      loadComments(),
      user ? loadLibraryStatus() : Promise.resolve(),
    ]).finally(() => setLoading(false));
  }, [key, user]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    await api.post('/comments', {
      content_key: bk,
      content_title: content?.title,
      content_type: content?.type,
      body: draft,
    });
    setDraft('');
    loadComments();
  };

  const deleteComment = async (id: number) => {
    await api.delete(`/comments/${id}`);
    loadComments();
  };

  const rate = async (score: number) => {
    const { data } = await api.post('/comments/rate', {
      content_key: bk,
      content_title: content?.title,
      content_type: content?.type,
      score,
    });
    setRating(data.rating);
  };

  const toggleLibrary = async (status: 'watched' | 'watchlist') => {
    if (libraryStatus === status) {
      await api.delete(`/library/${encodeURIComponent(bk)}`);
      setLibraryStatus(null);
    } else {
      await api.post('/library', {
        content_key: bk,
        content_title: content?.title,
        content_poster: content?.poster,
        content_type: content?.type,
        status,
      });
      setLibraryStatus(status);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="animate-pulse">
          <div className="h-80 bg-white/5 rounded-2xl mb-8" />
          <div className="h-8 bg-white/5 rounded-lg w-1/3 mb-4" />
          <div className="h-4 bg-white/5 rounded-lg w-2/3" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-10 text-gray-500">
        İçerik bulunamadı. <Link href="/" className="text-honey hover:underline">Ana sayfaya dön</Link>
      </div>
    );
  }

  const cast = content.credits?.cast || content.characters || [];

  return (
    <div>
      <div className="relative h-72 md:h-[420px] overflow-hidden">
        {content.backdrop ? (
          <img src={content.backdrop} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-surface2 to-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative -mt-48 z-10 pb-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          Geri
        </button>

        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          <div className="w-48 shrink-0 mx-auto sm:mx-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-surface shadow-2xl shadow-black/50 border border-white/[0.06]">
              {content.poster && (
                <img src={content.poster} alt={content.title} className="w-full h-full object-cover" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {content.title}
            </h1>
            {content.tagline && (
              <p className="text-sm text-gray-400 italic mb-4">{content.tagline}</p>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-5 flex-wrap">
              {content.rating > 0 && (
                <span className="flex items-center gap-1 text-honey font-semibold">
                  <Star size={14} className="fill-honey" /> {content.rating.toFixed(1)}
                </span>
              )}
              {content.year && <span>{content.year}</span>}
              {content.duration && <span>{content.duration}dk</span>}
              {content.genres?.slice(0, 3).map((g) => (
                <span key={g} className="px-3 py-1 bg-white/[0.04] rounded-full text-xs text-gray-300 border border-white/[0.06]">{g}</span>
              ))}
              {content.number_of_seasons && (
                <span className="text-xs text-gray-500">{content.number_of_seasons} Sezon</span>
              )}
            </div>

            <div className="flex gap-3 flex-wrap mb-6">
              {content.trailer && (
                <a href={content.trailer} target="_blank" rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-honey text-ink rounded-xl text-sm font-semibold hover:bg-honey-light transition-colors flex items-center gap-2 shadow-lg shadow-honey/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  Fragmanı İzle
                </a>
              )}
              <button onClick={() => toggleLibrary('watched')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  libraryStatus === 'watched' ? 'bg-honey text-ink shadow-lg shadow-honey/20' : 'bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                }`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {libraryStatus === 'watched' ? 'İzlendi' : 'İzledim'}
              </button>
              <button onClick={() => toggleLibrary('watchlist')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  libraryStatus === 'watchlist' ? 'bg-honey text-ink shadow-lg shadow-honey/20' : 'bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                }`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                {libraryStatus === 'watchlist' ? 'İzleyecek' : 'İzleyeceğim'}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-mono mb-3">ÖZET</h2>
          <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">{content.overview || 'Açıklama bulunmuyor.'}</p>
        </div>

        <div className="mb-10">
          <div className="bg-surface border border-white/[0.06] rounded-2xl p-5 inline-block">
            <p className="text-xs text-gray-400 mb-2">
                  Topluluk puanı: <span className="text-honey font-semibold">{rating.average || '—'}</span> ({rating.count} oy)
            </p>
            {user ? (
              <>
                <FilmstripRating value={rating.mine || 0} onRate={rate} />
                <p className="text-[11px] text-gray-500 mt-1.5">
                  {rating.mine ? `Senin puanın: ${rating.mine}/10` : 'Puan vermek için bir çerçeveye tıkla'}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-500">
                Puan vermek için <Link href="/login" className="text-honey hover:underline">giriş yap</Link>.
              </p>
            )}
          </div>
        </div>

        {cast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-mono mb-5">OYUNCULAR</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {cast.map((c, i) => (
                <div key={i} className="flex flex-col items-center shrink-0 w-24">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-surface2 mb-2 border-2 border-white/5">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg font-bold">{c.name[0]}</div>
                    )}
                  </div>
                  <p className="text-xs text-white text-center font-medium leading-tight">{c.name}</p>
                  <p className="text-[10px] text-gray-500 text-center mt-0.5">{c.character || c.role || ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.similar && content.similar.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-mono mb-5">BENZER YAPIMLAR</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {content.similar.map((s) => (
                <Link key={s.key} href={`/title/${s.key}`}
                  className="group relative rounded-2xl overflow-hidden bg-surface border border-white/[0.06] hover:border-white/15 transition-all">
                  <div className="aspect-[2/3] overflow-hidden relative">
                    {s.poster ? (
                      <img src={s.poster} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Görsel yok</div>
                    )}
                    {s.rating > 0 && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md">
                        <Star size={10} className="text-honey fill-honey" /> {s.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-white line-clamp-2">{s.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-mono mb-5">YORUMLAR ({comments.length})</h2>
          {user ? (
            <form onSubmit={submitComment} className="flex gap-2 mb-6">
              <input value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder="Bu içerik hakkında ne düşünüyorsun?"
                className="flex-1 bg-surface border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm outline-none text-white placeholder:text-gray-600 focus:ring-1 focus:ring-honey/50" />
              <button type="submit" className="bg-honey hover:bg-honey-light text-ink font-semibold rounded-xl px-5 text-sm transition-colors shadow-lg shadow-honey/20">
                Gönder
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mb-6">
              Yorum yapmak için <Link href="/login" className="text-honey hover:underline">giriş yap</Link>.
            </p>
          )}
          <div className="flex flex-col gap-3">
            {comments.length === 0 && <p className="text-sm text-gray-500">Henüz yorum yok. İlk yorumu sen yaz.</p>}
            {comments.map((c) => (
              <div key={c.id} className="bg-surface border border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setProfilePopupUser(String(c.user.id))} className="w-7 h-7 rounded-full bg-honey flex items-center justify-center text-[11px] font-bold text-ink shrink-0 overflow-hidden hover:ring-2 hover:ring-honey/50 transition-all">
                      {c.user.avatar_url ? (
                        <img src={c.user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        c.user.username?.[0]?.toUpperCase() || '?'
                      )}
                    </button>
                    <button onClick={() => setProfilePopupUser(String(c.user.id))} className="text-sm font-medium text-white hover:text-honey transition-colors">{c.user.username}</button>
                    <span className="text-[11px] text-gray-500">{new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {user && (String(user.id) === String(c.user.id) || user.role === 'admin') && !c.is_removed && (
                    <button onClick={() => deleteComment(c.id)} className="text-gray-500 hover:text-red-400 transition-colors" title="Yorumu sil">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    </button>
                  )}
                </div>
                <p className={`text-sm ${c.is_removed ? 'text-gray-500 italic' : 'text-gray-300'}`}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {profilePopupUser && <ProfilePopup userId={profilePopupUser} onClose={() => setProfilePopupUser(null)} />}
    </div>
  );
}
