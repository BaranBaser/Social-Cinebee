export function avatarUrl(url: string | null | undefined, bust?: string | number): string {
  if (!url) return '';
  const base = url.split('?')[0];
  return bust ? `${base}?v=${bust}` : base;
}
