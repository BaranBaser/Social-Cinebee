'use client';

export default function CalendarPage() {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Takvim</h1>
          <p className="text-xs text-muted">Yayın tarihlerini takip edin</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-white/[0.06] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">Takvim Yakında</h2>
        <p className="text-sm text-muted text-center max-w-xs">
          Film ve dizi yayın tarihlerini takip edebileceğiniz takvim özelliği yakında burada olacak.
        </p>
      </div>
    </div>
  );
}
