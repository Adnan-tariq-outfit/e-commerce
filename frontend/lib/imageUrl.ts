const BACKEND =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ??
  'http://localhost:3001';

export function getImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BACKEND}/${path}`;
}
