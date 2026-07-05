const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_BACKDROP = 'https://image.tmdb.org/t/p/w1280';
const JIKAN_BASE = 'https://api.jikan.moe/v4';

function tmdbKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key || key === 'buraya_tmdb_api_anahtariniz') return null;
  return key;
}

function tmdbHeaders() {
  const key = tmdbKey();
  if (!key) return {};
  if (key.startsWith('eyJ')) {
    return { 'Authorization': `Bearer ${key}` };
  }
  return {};
}

function tmdbParams(key) {
  if (key.startsWith('eyJ')) return '';
  return `api_key=${key}&`;
}

function normalizeTmdb(item, type) {
  return {
    key: `${type}-${item.id}`,
    type,
    title: item.original_title || item.original_name || item.title || item.name || 'Unknown',
    tagline: item.tagline || '',
    overview: item.overview || '',
    poster: item.poster_path ? `${TMDB_IMG}${item.poster_path}` : null,
    backdrop: item.backdrop_path ? `${TMDB_IMG_BACKDROP}${item.backdrop_path}` : null,
    rating: item.vote_average || 0,
    year: (item.release_date || item.first_air_date || '').slice(0, 4),
    duration: item.runtime || item.episode_run_time?.[0] || null,
    genres: (item.genres || []).map((g) => g.name),
    status: item.status || '',
    number_of_seasons: item.number_of_seasons || null,
    number_of_episodes: item.number_of_episodes || null,
    tmdb_id: item.id,
  };
}

function normalizeJikan(item) {
  return {
    key: `anime-${item.mal_id}`,
    type: 'anime',
    title: item.title || item.title_english || 'Bilinmeyen',
    tagline: '',
    overview: item.synopsis || '',
    poster: item.images?.jpg?.image_url || null,
    backdrop: null,
    rating: item.score || 0,
    year: item.year || (item.aired?.from ? item.aired.from.slice(0, 4) : ''),
    duration: item.episodes || null,
    genres: (item.genres || []).map((g) => g.name),
    status: item.status || '',
    number_of_seasons: null,
    number_of_episodes: item.episodes || null,
    mal_id: item.mal_id,
  };
}

// GET /api/content/trending?type=movie|tv|anime&filter=popular|trending|new|most_watched|top_rated&page=1
router.get('/trending', async (req, res) => {
  const type = req.query.type || 'movie';
  const filter = req.query.filter || 'popular';
  const page = req.query.page || '1';
  try {
    if (type === 'anime') {
      let endpoint = 'top/anime';
      let params = `limit=20&page=${page}`;
      if (filter === 'new') endpoint = 'seasons/now';
      else if (filter === 'trending') params = `limit=20&filter=bypopularity&page=${page}`;
      const r = await fetch(`${JIKAN_BASE}/${endpoint}?${params}`);
      const data = await r.json();
      return res.json({ results: (data.data || []).map(normalizeJikan) });
    }

    const key = tmdbKey();
    if (!key) return res.status(200).json({ results: [], warning: 'TMDB_API_KEY tanimli degil.' });

    let path;
    switch (filter) {
      case 'trending':
        path = `trending/${type}/week`;
        break;
      case 'new':
        path = type === 'tv' ? 'tv/on_the_air' : 'movie/upcoming';
        break;
      case 'most_watched':
        path = type === 'tv' ? 'tv/top_rated' : 'movie/top_rated';
        break;
      case 'top_rated':
        path = type === 'tv' ? 'tv/top_rated' : 'movie/top_rated';
        break;
      default:
        path = type === 'tv' ? 'tv/popular' : 'movie/popular';
    }

    const r = await fetch(`${TMDB_BASE}/${path}?${tmdbParams(key)}page=${page}`, {
      headers: tmdbHeaders(),
    });
    const data = await r.json();
    return res.json({ results: (data.results || []).map((i) => normalizeTmdb(i, type)) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Icerik alinamadi.' });
  }
});

// GET /api/content/search?q=...&type=movie|tv|anime&page=1
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').toString();
  const type = req.query.type || 'movie';
  const page = req.query.page || '1';
  if (!q.trim()) return res.json({ results: [] });

  try {
    if (type === 'anime') {
      const r = await fetch(`${JIKAN_BASE}/anime?q=${encodeURIComponent(q)}&limit=20&page=${page}`);
      const data = await r.json();
      return res.json({ results: (data.data || []).map(normalizeJikan) });
    }

    const key = tmdbKey();
    if (!key) return res.status(200).json({ results: [], warning: 'TMDB_API_KEY tanimli degil.' });

    const path = type === 'tv' ? 'search/tv' : 'search/movie';
    const r = await fetch(
      `${TMDB_BASE}/${path}?${tmdbParams(key)}query=${encodeURIComponent(q)}&page=${page}`,
      { headers: tmdbHeaders() }
    );
    const data = await r.json();
    return res.json({ results: (data.results || []).map((i) => normalizeTmdb(i, type)) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Arama basarisiz.' });
  }
});

// GET /api/content/detail?key=movie-550
router.get('/detail', async (req, res) => {
  const key = (req.query.key || '').toString();
  const [type, id] = key.split('-');
  if (!type || !id) return res.status(400).json({ error: 'Gecersiz icerik anahtari.' });

  try {
    if (type === 'anime') {
      const r = await fetch(`${JIKAN_BASE}/anime/${id}/full`);
      const data = await r.json();
      if (!data.data) return res.status(404).json({ error: 'Icerik bulunamadi.' });

      const anime = normalizeJikan(data.data);
      anime.characters = (data.data.characters || []).slice(0, 12).map((c) => ({
        name: c.character?.name || '',
        image: c.character?.images?.jpg?.image_url || null,
        role: c.role || '',
      }));
      anime.trailer = data.data.trailer?.url || null;
      anime.related = [];
      if (data.data.relations) {
        for (const rel of data.data.relations) {
          if (rel.entry) {
            for (const entry of rel.entry) {
              anime.related.push({
                key: `anime-${entry.mal_id}`,
                title: entry.name,
                type: 'anime',
              });
            }
          }
        }
      }
      anime.related = anime.related.slice(0, 6);
      return res.json({ content: anime });
    }

    const key2 = tmdbKey();
    if (!key2) return res.status(200).json({ content: null, warning: 'TMDB_API_KEY tanimli degil.' });

    const r = await fetch(
      `${TMDB_BASE}/${type}/${id}?${tmdbParams(key2)}append_to_response=credits,similar,videos`,
      { headers: tmdbHeaders() }
    );
    const data = await r.json();
    if (data.success === false) return res.status(404).json({ error: 'Icerik bulunamadi.' });

    const content = normalizeTmdb(data, type);
    content.credits = {
      cast: (data.credits?.cast || []).slice(0, 12).map((c) => ({
        name: c.name || '',
        character: c.character || '',
        image: c.profile_path ? `${TMDB_IMG}${c.profile_path}` : null,
      })),
    };
    content.similar = (data.similar?.results || []).slice(0, 6).map((i) => normalizeTmdb(i, type));
    const trailers = (data.videos?.results || []).filter(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );
    content.trailer = trailers.length > 0
      ? `https://www.youtube.com/watch?v=${trailers[0].key}`
      : null;

    return res.json({ content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Detay alinamadi.' });
  }
});

// GET /api/content/genres?type=movie|tv
router.get('/genres', async (req, res) => {
  const type = req.query.type || 'movie';
  if (type === 'anime') {
    return res.json({ genres: [] });
  }
  const key = tmdbKey();
  if (!key) return res.status(200).json({ genres: [], warning: 'TMDB_API_KEY tanimli degil.' });
  try {
    const r = await fetch(`${TMDB_BASE}/genre/${type}/list?${tmdbParams(key)}`, {
      headers: tmdbHeaders(),
    });
    const data = await r.json();
    res.json({ genres: data.genres || [] });
  } catch (e) {
    res.status(500).json({ genres: [] });
  }
});

module.exports = router;
