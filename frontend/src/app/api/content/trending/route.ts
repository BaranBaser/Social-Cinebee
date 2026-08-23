import { NextResponse } from 'next/server';
import { getTrending } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movie';
  const filter = searchParams.get('filter') || 'popular';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Always use our static dataset — Render backend is outdated
  const data = getTrending(type, filter, page);
  return NextResponse.json(data);
}
