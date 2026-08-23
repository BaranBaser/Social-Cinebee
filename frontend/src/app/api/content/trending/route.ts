import { NextResponse } from 'next/server';
import { getTrending } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movie';
  const filter = searchParams.get('filter') || 'popular';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Try proxying to backend if available, with timeout
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://social-cinebee.onrender.com';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${backendUrl}/api/content/trending?type=${type}&filter=${filter}&page=${page}`, {
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
  } catch (err) {
    // Backend unreachable or timeout -> use robust fallback
  }

  const fallbackData = getTrending(type, filter, page);
  return NextResponse.json(fallbackData);
}
