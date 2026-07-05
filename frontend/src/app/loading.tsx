'use client';

export default function Loading() {
  return (
    <div className="px-6 py-6">
      <div className="h-10 w-48 bg-surface2 rounded-xl animate-shimmer mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-[2/3] rounded-xl animate-shimmer bg-surface2" />
            <div className="h-4 rounded-md animate-shimmer bg-surface2 w-3/4 mt-1" />
            <div className="h-3 rounded-md animate-shimmer bg-surface2 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
