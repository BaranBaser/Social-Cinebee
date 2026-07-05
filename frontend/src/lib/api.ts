import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('cinemaai_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== 'undefined' && err?.response?.status === 401) {
      localStorage.removeItem('cinemaai_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// Strip category suffix from content_key to get base key
// "movie-550-popular" → "movie-550", "anime-1234-trending" → "anime-1234"
export function baseKey(key: string): string {
  const categories = ['popular', 'trending', 'new', 'top_rated', 'most_watched'];
  const parts = key.split('-');
  if (parts.length >= 3 && categories.includes(parts[parts.length - 1])) {
    return parts.slice(0, 2).join('-');
  }
  return key;
}
