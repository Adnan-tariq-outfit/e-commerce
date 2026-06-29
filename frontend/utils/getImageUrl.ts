export function getImageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';
  return `${base}/${path}`;
}
