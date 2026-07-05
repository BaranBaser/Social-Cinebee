'use client';

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-8">
      <div className="h-10 w-48 bg-[#1a1a1a] rounded-xl animate-shimmer mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-[2/3] rounded-2xl animate-shimmer bg-[#1a1a1a]" />
            <div className="h-4 rounded-md animate-shimmer bg-[#1a1a1a] w-3/4 mt-1" />
            <div className="h-3 rounded-md animate-shimmer bg-[#1a1a1a] w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
