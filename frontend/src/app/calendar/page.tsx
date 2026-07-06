'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface LibraryItem {
  _id: string;
  content_key: string;
  content_title: string;
  content_poster: string | null;
  content_type: string | null;
  status: string;
  created_at: string;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (user) loadItems();
  }, [user]);

  async function loadItems() {
    try {
      const { data } = await api.get('/library', { params: { status: 'watched' } });
      setItems(data.items || []);
    } catch {} finally { setLoading(false); }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const itemsByDate: Record<string, LibraryItem[]> = {};
  items.forEach(item => {
    const d = new Date(item.created_at + 'Z');
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!itemsByDate[key]) itemsByDate[key] = [];
    itemsByDate[key].push(item);
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Takvim</h1>
          <p className="text-xs text-muted">İzlediğin içeriklerin tarihleri</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-white/[0.06] p-5 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/[0.06] text-muted hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 className="text-lg font-bold text-white">{monthNames[month]} {year}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/[0.06] text-muted hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(d => (
            <div key={d} className="text-center text-[11px] font-semibold text-muted py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayItems = itemsByDate[dateKey] || [];
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            return (
              <div key={day} className={`aspect-square rounded-lg p-1 text-xs relative ${isToday ? 'bg-honey/20 border border-honey/40' : dayItems.length > 0 ? 'bg-white/[0.04]' : ''}`}>
                <span className={`text-[11px] ${isToday ? 'text-honey font-bold' : 'text-muted'}`}>{day}</span>
                {dayItems.length > 0 && (
                  <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 flex-wrap">
                    {dayItems.slice(0, 3).map((item, idx) => (
                      <Link key={idx} href={`/title/${item.content_key}`}
                        className="w-2 h-2 rounded-full bg-honey/60 hover:bg-honey transition-colors shrink-0"
                        title={item.content_title} />
                    ))}
                    {dayItems.length > 3 && <span className="text-[8px] text-honey">+{dayItems.length - 3}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!loading && items.length > 0 && (
        <div className="mt-6 max-w-2xl">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Bu Ay İzlenenler ({items.filter(i => { const d = new Date(i.created_at + 'Z'); return d.getMonth() === month && d.getFullYear() === year; }).length})</h3>
          <div className="space-y-2">
            {items.filter(i => { const d = new Date(i.created_at + 'Z'); return d.getMonth() === month && d.getFullYear() === year; }).map(item => (
              <Link key={item._id} href={`/title/${item.content_key}`}
                className="flex items-center gap-3 bg-surface rounded-xl p-3 border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                {item.content_poster && <img src={item.content_poster} alt="" className="w-10 h-14 rounded object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.content_title}</p>
                  <p className="text-[11px] text-muted">{new Date(item.created_at + 'Z').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</p>
                </div>
                <span className="text-[10px] text-honey font-semibold uppercase">{item.content_type}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!user && (
        <div className="text-center py-10">
          <p className="text-sm text-muted">Takvimi kullanmak için <Link href="/login" className="text-honey hover:underline">giriş yap</Link>.</p>
        </div>
      )}
    </div>
  );
}
