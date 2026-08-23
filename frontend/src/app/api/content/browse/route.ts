import { NextResponse } from 'next/server';
import { ALL_CONTENT } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movie';
  const genre = searchParams.get('genre') || '';
  const filter = searchParams.get('filter') || '';
  const sort = searchParams.get('sort') || 'rating';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;

  // Always use our static dataset — Render backend is outdated
  let filtered = ALL_CONTENT.filter(item => {
    if (type !== 'all' && item.type !== type) return false;
    if (genre && !item.genres?.some(g => g.toLowerCase().includes(genre.toLowerCase()))) return false;
    if (filter && !item.categories?.includes(filter)) return false;
    return true;
  });

  if (sort === 'year') {
    filtered.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
  } else {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const offset = (page - 1) * limit;
  const results = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    results,
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
    source: 'static_fallback'
  });
}
