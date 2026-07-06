'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/', label: 'Ana Sayfa', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  )},
  { href: '/?type=tv', label: 'Diziler', typeParam: 'tv', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="15" x="2" y="3" rx="2" /><polyline points="8 21 12 17 16 21" />
    </svg>
  )},
  { href: '/?type=movie', label: 'Filmler', typeParam: 'movie', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" />
    </svg>
  )},
  { href: '/?type=anime', label: 'Animeler', typeParam: 'anime', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )},
  { href: '/library', label: 'Listelerim', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  )},
  { href: '/calendar', label: 'Takvim', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )},
  { href: '/community', label: 'Topluluk', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )},
  { href: '/updates', label: 'Yenilikler', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-7l-2 2" /><path d="M12 15l2 2" /><path d="M22 13a10 10 0 1 0-20 0" /><path d="M12 3v2" />
    </svg>
  )},
];

const bottomItems = [
  { href: '/messages', label: 'Mesajlar', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  )},
  { href: '/settings', label: 'Ayarlar', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )},
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get('type');
  const { user } = useAuth();

  return (
    <aside className="fixed md:left-0 md:top-0 bottom-0 left-0 right-0 w-full md:w-[240px] h-[60px] md:h-auto bg-ink/95 backdrop-blur-xl md:bg-ink md:backdrop-blur-none border-t md:border-t-0 md:border-r border-white/[0.06] flex flex-row md:flex-col z-40 md:z-30 overflow-x-auto md:overflow-y-auto scrollbar-hide pb-safe md:pb-0">
      <div className="hidden md:block px-5 pt-6 pb-4">
        <div className="relative group w-max">
          <Link href="/" className="flex items-center gap-2 relative z-10">
            <span className="text-2xl font-bold text-white tracking-tight">cinebee</span>
            <span className="text-lg">🐝</span>
          </Link>
          <div className="absolute top-[100%] left-1 right-8 h-4 pointer-events-none overflow-hidden">
             <style>{`
               @keyframes honeyDrip {
                 0% { d: path('M0,0 Q10,0 20,5 T40,5 T60,2 T80,10 T100,0 Z'); }
                 50% { d: path('M0,0 Q10,15 20,5 T40,12 T60,5 T80,18 T100,0 Z'); }
                 100% { d: path('M0,0 Q10,0 20,5 T40,5 T60,2 T80,10 T100,0 Z'); }
               }
             `}</style>
             <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-honey fill-current" style={{ filter: 'drop-shadow(0 2px 3px rgba(245, 197, 24, 0.4))' }}>
               <path d="M0,0 Q10,0 20,5 T40,5 T60,2 T80,10 T100,0 Z" style={{ animation: 'honeyDrip 4s ease-in-out infinite' }} />
             </svg>
          </div>
        </div>
      </div>



      <nav className="flex-1 flex flex-row md:flex-col w-full md:w-auto px-2 md:px-3 py-0 md:py-2 justify-around md:justify-start items-center md:items-stretch">
        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 space-y-0 md:space-y-0.5 w-full md:w-auto justify-around md:justify-start">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/' && !typeFromUrl && !searchParams.get('q')
              : 'typeParam' in item
                ? pathname === '/' && typeFromUrl === item.typeParam
                : pathname === item.href || pathname.startsWith(item.href + '?') || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-center md:justify-start gap-3 px-3 py-3 md:py-2.5 rounded-xl md:rounded-lg text-sm font-medium transition-all duration-300 relative active:scale-90 md:active:scale-100 ${
                  isActive
                    ? 'text-honey md:bg-honey/10 md:border-l-[3px] md:border-honey md:pl-[9px]'
                    : 'text-muted hover:text-white hover:bg-white/[0.04] md:border-l-[3px] md:border-transparent md:pl-[9px]'
                }`}
              >
                {isActive && <span className="absolute md:hidden top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-honey rounded-b-full shadow-[0_2px_8px_rgba(245,197,24,0.6)]" />}
                <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-honey' : 'text-muted group-hover:scale-110'}`}>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block my-4 mx-3 border-t border-white/[0.06]" />

        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 space-y-0 md:space-y-0.5 w-full md:w-auto justify-around md:justify-start">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-center md:justify-start gap-3 px-3 py-3 md:py-2.5 rounded-xl md:rounded-lg text-sm font-medium transition-all duration-300 relative active:scale-90 md:active:scale-100 ${
                  isActive
                    ? 'text-honey md:bg-honey/10 md:border-l-[3px] md:border-honey md:pl-[9px]'
                    : 'text-muted hover:text-white hover:bg-white/[0.04] md:border-l-[3px] md:border-transparent md:pl-[9px]'
                }`}
              >
                {isActive && <span className="absolute md:hidden top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-honey rounded-b-full shadow-[0_2px_8px_rgba(245,197,24,0.6)]" />}
                <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-honey' : 'text-muted group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="hidden md:block px-3 pb-4 mt-auto">
        <div className="rounded-xl overflow-hidden relative active:scale-[0.98] transition-transform mb-4" style={{ background: 'linear-gradient(135deg, #f5c518, #e0b000, #f5c518)' }}>
          <div className="px-4 py-4 relative z-10">
            <p className="text-[10px] font-black tracking-[0.2em] text-ink/70 uppercase mb-1">Premium</p>
            <p className="text-xs text-ink/90 font-semibold leading-snug mb-2.5">Sınırsız erişim,<br />özel içerikler</p>
            <button className="w-full py-2 bg-ink text-white text-xs font-bold rounded-lg hover:bg-ink/90 transition-colors">
              Yükselt
            </button>
          </div>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(0,0,0,0.15), transparent 60%)' }} />
        </div>

        {user && (
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] active:scale-95 transition-all">
            <div className="w-9 h-9 rounded-full bg-honey/20 border border-honey/30 flex items-center justify-center text-sm font-bold text-honey shrink-0 overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                user.username[0].toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.username}</p>
              <div className="flex items-center gap-1.5">
                {user.role === 'admin' && <span title="Geliştirici" className="text-sm">🍯🔧</span>}
                <p className="text-[11px] text-muted truncate">{user.role === 'admin' ? 'Yönetici' : 'Üye'}</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
