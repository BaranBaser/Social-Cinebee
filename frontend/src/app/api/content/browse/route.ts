import { NextResponse } from 'next/server';
import { getTrending, ALL_CONTENT } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movie';
  const genre = searchParams.get('genre') || '';
  const filter = searchParams.get('filter') || 'popular';
  const sort = searchParams.get('sort') || 'rating';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://social-cinebee.onrender.com';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${backendUrl}/api/content/browse?type=${type}&genre=${encodeURIComponent(genre)}&filter=${filter}&sort=${sort}&page=${page}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {}

  let filtered = ALL_CONTENT.filter(item => {
    if (type !== 'all' && item.type !== type) return false;
    if (genre && !item.genres?.some(g => g.toLowerCase().includes(genre.toLowerCase()))) return false;
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
