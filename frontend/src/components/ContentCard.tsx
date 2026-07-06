'use client';

import Link from 'next/link';


interface ContentItem {
  key: string;
  type: string;
  title: string;
  poster: string | null;
  rating: number;
  year: string;
  status?: string;
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; color: string }> = {
    movie: { label: 'FİLM', color: 'bg-honey text-ink' },
    tv: { label: 'DİZİ', color: 'bg-emerald-500 text-white' },
    anime: { label: 'ANİME', color: 'bg-rose-500 text-white' },
  };
  const c = config[type] || config.movie;
  return (
    <span className={`absolute top-2.5 left-2.5 text-[9px] font-black tracking-wider px-2 py-0.5 rounded ${c.color}`}>
      {c.label}
    </span>
  );
}

export default function ContentCard({ item, badge }: { item: ContentItem; badge?: string }) {
  return (
    <Link
      href={`/title/${item.key}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-surface border border-white/[0.06] hover:border-honey/30 transition-all duration-300 ease-out hover:shadow-[0_0_20px_rgba(245,197,24,0.12)] hover:-translate-y-1"
    >
      <div className="aspect-[2/3] bg-surface2 overflow-hidden relative rounded-t-xl">
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs px-2 text-center">
            Görsel yok
          </div>
        )}

        <TypeBadge type={item.type} />

        {!!item.rating && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg font-medium">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#f5c518" stroke="#f5c518" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            {Number(item.rating).toFixed(1)}
          </span>
        )}

        {badge === 'izlendi' && (
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[10px] bg-emerald-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg font-semibold uppercase tracking-wider">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            İZLENDİ
          </span>
        )}
        {badge === 'izleyecek' && (
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[10px] bg-honey/90 backdrop-blur-sm text-ink px-2 py-1 rounded-lg font-semibold uppercase tracking-wider">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
            İZLEYECEK
          </span>
        )}
      </div>

      <div className="p-2.5">
        <p className="text-[13px] font-semibold text-white line-clamp-2 leading-snug">{item.title}</p>
        {item.year && <p className="text-xs text-muted mt-1">{item.year}</p>}
      </div>
    </Link>
  );
}
