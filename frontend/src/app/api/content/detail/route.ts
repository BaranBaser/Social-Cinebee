import { NextResponse } from 'next/server';
import { getDetail } from '@/lib/contentData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') || '';

  // Always use our static dataset — Render backend is outdated
  const content = getDetail(key);
  return NextResponse.json({ content });
}
