import { NextResponse } from 'next/server';
import { getStats } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://social-cinebee.onrender.com';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${backendUrl}/api/content/stats`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.total > 0) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {}

  return NextResponse.json(getStats());
}
