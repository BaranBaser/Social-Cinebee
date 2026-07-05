'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';

interface ContentItem {
  key: string;
  type: string;
  title: string;
  poster: string | null;
  rating: number;
  year: string;
  status?: string;
}

export default function ContentCard({ item, badge }: { item: ContentItem; badge?: string }) {
  return (
    <Link
      href={`/title/${item.key}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#141210] border border-white/[0.06] hover:border-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1"
    >
      <div className="aspect-[2/3] bg-[#111] overflow-hidden relative rounded-t-2xl">
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs px-2 text-center">
            Görsel yok
          </div>
        )}

        {/* Rating badge - top right */}
        {!!item.rating && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg font-medium">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            {Number(item.rating).toFixed(1)}
          </span>
        )}

        {/* Status badge - top left */}
        {badge === 'izlendi' && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg font-semibold uppercase tracking-wider">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            İZLENDİ
          </span>
        )}
        {badge === 'izleyecek' && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] bg-yellow-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg font-semibold uppercase tracking-wider">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
            İZLEYECEK
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-white line-clamp-2 leading-snug">{item.title}</p>
        {item.year && <p className="text-xs text-gray-500 mt-1">{item.year}</p>}
      </div>
    </Link>
  );
}
