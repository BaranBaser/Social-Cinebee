import { NextResponse } from 'next/server';
import { searchContent } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'movie';

  // Always use our static dataset — Render backend is outdated
  return NextResponse.json(searchContent(q, type));
}
