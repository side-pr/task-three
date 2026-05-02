

function getInternalBaseUrl() {
  if (typeof window !== 'undefined') return '/api/internal';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/internal`;
  return 'http://localhost:3000/api/internal';
}

export const INTERNAL_API_SERVER_URL = getInternalBaseUrl();
export const API_SERVER_URL = process.env.API_SERVER_URL;
