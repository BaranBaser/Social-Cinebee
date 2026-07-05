'use client';

import { Film } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-velvet flex items-center justify-center animate-pulse">
          <Film size={24} className="text-cream" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-marquee border-t-transparent rounded-full animate-spin" />
          <span className="text-muted text-sm">Yukleniyor...</span>
        </div>
      </div>
    </div>
  );
}
