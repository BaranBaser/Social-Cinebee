'use client';

export default function FilmstripRating({ value = 0, onRate, size = 'md', readOnly = false }: {
  value?: number;
  onRate?: (score: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}) {
  const frames = Array.from({ length: 10 }, (_, i) => i + 1);
  const dims = size === 'lg' ? 'w-6 h-8' : size === 'sm' ? 'w-3 h-4' : 'w-4 h-5';

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="flex bg-black/40 rounded-sm p-1 gap-[2px]">
        {frames.map((f) => {
          const filled = f <= Math.round(value);
          return (
            <button
              key={f}
              type="button"
              disabled={readOnly}
              onClick={() => onRate && onRate(f)}
              title={`${f}/10`}
              className={`${dims} rounded-[2px] transition-colors ${
                filled ? 'bg-honey' : 'bg-surface2 border border-white/10'
              } ${!readOnly ? 'hover:bg-honey-light cursor-pointer' : 'cursor-default'}`}
            />
          );
        })}
      </div>
    </div>
  );
}
