import { NextResponse } from 'next/server';
import { getDetail } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') || '';

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://social-cinebee.onrender.com';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${backendUrl}/api/content/detail?key=${encodeURIComponent(key)}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.content) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {}

  const content = getDetail(key);
  return NextResponse.json({ content });
}
