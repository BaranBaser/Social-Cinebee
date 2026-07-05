'use client';

export default function BookmarksPage() {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Yer İşaretleri</h1>
          <p className="text-xs text-muted">Kaydettiğiniz içerikler</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-white/[0.06] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">Henüz Yer İşareti Yok</h2>
        <p className="text-sm text-muted text-center max-w-xs">
          Beğendiğiniz içerikleri yer işaretiyle kaydedin. Tüm yer işaretleriniz burada görünecek.
        </p>
      </div>
    </div>
  );
}
