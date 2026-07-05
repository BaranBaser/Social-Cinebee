'use client';

export default function GroupsPage() {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Gruplar</h1>
          <p className="text-xs text-muted">Film ve dizi gruplarını keşfet</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-white/[0.06] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
            <path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">Gruplar Yakında</h2>
        <p className="text-sm text-muted text-center max-w-xs">
          Ortak ilgi alanlarına sahip kişilerle gruplar oluşturup film ve dizi tartışabileceğiniz özellik yakında gelecek.
        </p>
      </div>
    </div>
  );
}
