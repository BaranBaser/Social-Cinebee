'use client';

export default function NotificationsPage() {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Bildirimler</h1>
          <p className="text-xs text-muted">Son bildirimleriniz</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-white/[0.06] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">Henüz Bildirim Yok</h2>
        <p className="text-sm text-muted text-center max-w-xs">
          Yeni bildirimleriniz burada görünecek. Beğeniler, yorumlar ve takipçilerinizle ilgili güncellemeler burada yer alacak.
        </p>
      </div>
    </div>
  );
}
