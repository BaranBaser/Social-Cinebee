import { NextResponse } from 'next/server';
import { searchContent } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'movie';

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://social-cinebee.onrender.com';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${backendUrl}/api/content/search?q=${encodeURIComponent(q)}&type=${type}`, {
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

  return NextResponse.json(searchContent(q, type));
}
