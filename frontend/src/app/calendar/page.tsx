'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarAPIItem {
  _id: string;
  content_key: string;
  content_title: string;
  content_poster: string | null;
  content_type: string | null;
  status: string;
  release_date?: string;
  next_episode?: {
    air_date: string;
    episode_number: number;
    season_number: number;
    name: string;
  } | null;
  last_episode?: {
    air_date: string;
    episode_number: number;
    season_number: number;
    name: string;
  } | null;
}

interface EventItem {
  date: string;
  title: string;
  poster: string | null;
  type: string;
  key: string;
  label: string;
  isPast: boolean;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<CalendarAPIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (user) loadItems();
  }, [user]);

  async function loadItems() {
    try {
      const { data } = await api.get('/library/calendar');
      setItems(data.items || []);
    } catch {} finally { setLoading(false); }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  // Adjust so Monday is first day of week (optional, standard is Sunday = 0)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const events: EventItem[] = [];
  items.forEach(item => {
    if (item.content_type === 'movie' && item.release_date) {
      const d = new Date(item.release_date);
      events.push({
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        title: item.content_title,
        poster: item.content_poster,
        type: 'movie',
        key: item.content_key,
        label: 'Film Vizyonda',
        isPast: d < today
      });
    } else if (item.content_type === 'tv') {
      if (item.next_episode?.air_date) {
        const d = new Date(item.next_episode.air_date);
        events.push({
          date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
          title: item.content_title,
          poster: item.content_poster,
          type: 'tv',
          key: item.content_key,
          label: `S${item.next_episode.season_number} E${item.next_episode.episode_number}`,
          isPast: false
        });
      }
      if (item.last_episode?.air_date) {
        const d = new Date(item.last_episode.air_date);
        events.push({
          date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
          title: item.content_title,
          poster: item.content_poster,
          type: 'tv',
          key: item.content_key,
          label: `S${item.last_episode.season_number} E${item.last_episode.episode_number}`,
          isPast: true
        });
      }
    }
  });

  const eventsByDate: Record<string, EventItem[]> = {};
  events.forEach(ev => {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
    // prevent duplicates
    if (!eventsByDate[ev.date].find(e => e.key === ev.key && e.label === ev.label)) {
      eventsByDate[ev.date].push(ev);
    }
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevMonth();
      if (e.key === 'ArrowRight') nextMonth();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [year, month]);

  // Sidebar events
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const sidebarEvents = events
    .filter(e => e.date.startsWith(monthPrefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  const sidebarGroups: Record<string, EventItem[]> = {};
  sidebarEvents.forEach(e => {
    if (!sidebarGroups[e.date]) sidebarGroups[e.date] = [];
    if (!sidebarGroups[e.date].find(x => x.key === e.key && x.label === e.label)) {
      sidebarGroups[e.date].push(e);
    }
  });

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Takvim</h2>
        <p className="text-muted max-w-sm mb-6">Takvimi kullanmak ve kütüphanenizdeki dizilerin yeni bölümlerini takip etmek için giriş yapmalısınız.</p>
        <Link href="/login" className="bg-honey hover:bg-honey-light text-ink font-bold py-2.5 px-6 rounded-lg transition-colors">
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 min-h-screen">
      <div className="flex flex-col xl:flex-row gap-8 max-w-[1400px] mx-auto">
        
        {/* Main Calendar Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              {monthNames[month]} <span className="text-white/40">{year}</span>
            </h1>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-10 h-10 rounded-full bg-surface2 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-surface2 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {dayNames.map(d => (
              <div key={d} className="text-center text-sm font-semibold text-muted py-2">{d}</div>
            ))}
            
            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-[4/5]" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = eventsByDate[dateKey] || [];
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              
              return (
                <div key={day} className={`aspect-[4/5] rounded-xl p-2 flex flex-col relative transition-all duration-300 overflow-hidden ${
                  isToday ? 'bg-honey/10 ring-2 ring-honey border-transparent' : 'bg-surface border border-white/[0.04] hover:border-white/[0.15]'
                }`}>
                  <span className={`text-sm mb-2 ${isToday ? 'text-honey font-bold' : 'text-white/60 font-medium'}`}>{day}</span>
                  
                  <div className={`flex-1 grid gap-1 ${dayEvents.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} overflow-hidden`}>
                    {dayEvents.slice(0, 4).map((ev, idx) => (
                      <Link key={idx} href={`/title/${ev.key}`} className="relative block w-full h-full rounded-md overflow-hidden group">
                        {ev.poster ? (
                          <img src={ev.poster} alt={ev.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-white/5" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 flex flex-col">
                          <span className="text-[10px] font-bold text-honey truncate leading-tight drop-shadow-md">{ev.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {dayEvents.length > 4 && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold text-white">
                      +{dayEvents.length - 4}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:w-80 shrink-0">
          <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-honey"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
              Yaklaşan Yayınlar
            </h2>
            
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-12 h-16 bg-white/5 rounded" />
                    <div className="flex-1 py-1">
                      <div className="h-4 bg-white/5 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-white/5 rounded w-3/4" />
                    </div>
                  </div>
                ))
              ) : Object.keys(sidebarGroups).length === 0 ? (
                <p className="text-sm text-muted text-center py-10">Bu ay için yayın bulunamadı.</p>
              ) : (
                Object.entries(sidebarGroups).map(([date, dayEvs]) => {
                  const dObj = new Date(date);
                  const isPast = dObj < new Date(today.setHours(0,0,0,0));
                  return (
                    <div key={date} className={`relative ${isPast ? 'opacity-50' : ''}`}>
                      <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                        {dObj.getDate()} {monthNames[dObj.getMonth()]}
                      </h3>
                      <div className="space-y-3">
                        {dayEvs.map((ev, idx) => (
                          <Link key={idx} href={`/title/${ev.key}`} className="flex gap-3 group">
                            {ev.poster ? (
                              <img src={ev.poster} alt="" className="w-10 h-14 rounded object-cover shadow-md" />
                            ) : (
                              <div className="w-10 h-14 rounded bg-white/5" />
                            )}
                            <div className="flex-1 min-w-0 pt-0.5">
                              <p className="text-sm font-semibold text-white/90 group-hover:text-honey transition-colors truncate">
                                {ev.title}
                              </p>
                              <p className="text-[11px] text-muted mt-0.5">{ev.label}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
