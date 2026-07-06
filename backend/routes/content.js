const express = require('express');
const fetch = require('node-fetch');
const { ContentCache } = require('../db');

const router = express.Router();

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_BACKDROP = 'https://image.tmdb.org/t/p/w1280';
const JIKAN_BASE = 'https://api.jikan.moe/v4';

function tmdbHeaders() {
  const key = process.env.TMDB_API_KEY;
  if (!key) return {};
  if (key.startsWith('eyJ')) return { Authorization: `Bearer ${key}` };
  return {};
}

function tmdbParams() {
  const key = process.env.TMDB_API_KEY;
  if (!key || key.startsWith('eyJ')) return '';
  return `api_key=${key}&`;
}

function normalizeCache(row) {
  return {
    key: row.content_key,
    type: row.type,
    title: row.title || row.original_title,
    original_title: row.original_title || '',
    tagline: '',
    overview: row.overview || '',
    poster: row.poster,
    backdrop: row.backdrop,
    rating: row.rating || 0,
    year: row.year || '',
    duration: row.duration || null,
    genres: row.genres ? row.genres.split(', ') : [],
    status: row.status || '',
    number_of_seasons: row.number_of_seasons,
    number_of_episodes: row.number_of_episodes,
    tmdb_id: row.tmdb_id,
    mal_id: row.mal_id,
  };
}

function normalizeTmdb(item, type) {
  return {
    key: `${type}-${item.id}`,
    type,
    title: item.title || item.name || item.original_title || item.original_name || 'Unknown',
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
    title: item.title_english || item.title || 'Unknown',
    tagline: '',
    overview: item.synopsis || '',
    poster: item.images?.jpg?.image_url || null,
    backdrop: null,
    rating: item.score || 0,
    year: item.year ? String(item.year) : (item.aired?.from ? item.aired.from.slice(0, 4) : ''),
    duration: item.episodes || null,
    genres: (item.genres || []).map((g) => g.name),
    status: item.status || '',
    number_of_seasons: null,
    number_of_episodes: item.episodes || null,
    mal_id: item.mal_id,
  };
}

// GET /api/content/trending
router.get('/trending', async (req, res) => {
  const type = req.query.type || 'movie';
  const filter = req.query.filter || 'popular';
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    let query = { type, category: filter };
    if (type === 'tv') {
      query.genres = { $not: /Animation/ };
    }
    let total = await ContentCache.countDocuments(query);
    let rows = await ContentCache.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ _id: 1 });

    // Anime fallback: Jikan 504 oldugunda populer veriden turet
    if (total === 0 && type === 'anime') {
      let fallbackSort = {};
      let fallbackFilter = { type: 'anime' };

      if (filter === 'trending') {
        fallbackSort = { synced_at: -1 };
      } else if (filter === 'new') {
        fallbackSort = { year: -1 };
      } else if (filter === 'top_rated') {
        fallbackSort = { rating: -1 };
      } else if (filter === 'most_watched') {
        fallbackSort = { rating: -1, year: -1 };
      }

      const countPipeline = [
        { $match: { type: 'anime' } },
        { $group: { _id: '$mal_id' } },
        { $count: 'total' }
      ];
      const countResult = await ContentCache.aggregate(countPipeline);
      total = countResult[0]?.total || 0;

      const pipeline = [
        { $match: { type: 'anime' } },
        { $sort: filter === 'trending' ? { synced_at: -1 } : filter === 'new' ? { year: -1 } : { rating: -1, year: -1 } },
        { $group: { _id: '$mal_id', doc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: filter === 'trending' ? { synced_at: -1 } : filter === 'new' ? { year: -1 } : { rating: -1, year: -1 } },
        { $skip: offset },
        { $limit: limit }
      ];
      rows = await ContentCache.aggregate(pipeline);
    }

    if (total > 0) {
      return res.json({
        results: rows.map(normalizeCache),
        hasMore: offset + limit < total,
        total,
        source: 'cache',
      });
    }

    return res.json({
      results: [],
      hasMore: false,
      total: 0,
      source: 'cache',
    });
  } catch (e) {
    console.error('Trending error:', e);
    res.status(500).json({ error: 'Icerik alinamadi.' });
  }
});

// GET /api/content/search?q=...
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').toString();
  const type = req.query.type || 'movie';
  if (!q.trim()) return res.json({ results: [] });

  try {
    const typeFilter = type === 'anime' ? 'anime' : type;
    const fuzzyPattern = q.split(/[\s:.\-]+/).map(term => term.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]/g, '')).filter(t => t.length > 0).join('.*');
    const regex = new RegExp(fuzzyPattern || q, 'i');
    
    // Aggregate to group by tmdb_id/mal_id
    const rows = await ContentCache.aggregate([
      { 
        $match: { 
          $or: [{ title: regex }, { original_title: regex }], 
          type: typeFilter 
        } 
      },
      {
        $group: {
          _id: { $cond: [{ $ifNull: ["$tmdb_id", false] }, "$tmdb_id", "$mal_id"] },
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { rating: -1, year: -1 } },
      { $limit: 40 }
    ]);

    if (rows.length > 0) {
      return res.json({ results: rows.map(normalizeCache), source: 'cache' });
    }

    return res.json({ results: [], source: 'cache' });
  } catch (e) {
    console.error('Search error:', e);
    res.status(500).json({ error: 'Arama basarisiz.' });
  }
});

// GET /api/content/detail?key=movie-550
router.get('/detail', async (req, res) => {
  const key = (req.query.key || '').toString();
  if (!key) return res.status(400).json({ error: 'Gecersiz icerik anahtari.' });

  try {
    let cached = await ContentCache.findOne({ content_key: key });

    if (!cached) {
      const parts = key.split('-');
      const type = parts[0];
      const id = parseInt(parts[1], 10);

      if (type === 'anime') {
        cached = await ContentCache.findOne({ type, mal_id: id });
      } else if (type === 'movie' || type === 'tv') {
        cached = await ContentCache.findOne({ type, tmdb_id: id });
      }
    }

    if (cached) {
      const content = normalizeCache(cached);
      if (cached.source === 'tmdb' && cached.tmdb_id) {
        try {
          const r = await fetch(`${TMDB_BASE}/${cached.type}/${cached.tmdb_id}?${tmdbParams()}language=en&append_to_response=credits,similar,videos`, { headers: tmdbHeaders() });
          const data = await r.json();
          content.credits = {
            cast: (data.credits?.cast || []).slice(0, 12).map(c => ({
              name: c.name, character: c.character,
              image: c.profile_path ? `${TMDB_IMG}${c.profile_path}` : null,
            })),
          };
          content.similar = (data.similar?.results || []).slice(0, 6).map(i => normalizeTmdb(i, cached.type));
          const trailers = (data.videos?.results || []).filter(v => v.type === 'Trailer' && v.site === 'YouTube');
          content.trailer = trailers.length > 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : null;
          content.tagline = data.tagline || '';
          content.genres = (data.genres || []).map(g => g.name);
          content.duration = data.runtime || null;
        } catch {}
      }
      if (cached.source === 'jikan' && cached.mal_id) {
        try {
          const r = await fetch(`${JIKAN_BASE}/anime/${cached.mal_id}/full`);
          const data = await r.json();
          content.characters = (data.data?.characters || []).slice(0, 12).map(c => ({
            name: c.character?.name || '',
            image: c.character?.images?.jpg?.image_url || null,
            role: c.role || '',
          }));
          content.trailer = data.data?.trailer?.url || null;
        } catch {}
      }
      return res.json({ content });
    }

    const parts = key.split('-');
    const type = parts[0];
    const id = parseInt(parts[1], 10);

    if (type === 'anime') {
      const r = await fetch(`${JIKAN_BASE}/anime/${id}/full`);
      const data = await r.json();
      if (!data.data) return res.status(404).json({ error: 'Icerik bulunamadi.' });
      const anime = normalizeJikan(data.data);
      anime.characters = (data.data.characters || []).slice(0, 12).map(c => ({
        name: c.character?.name || '',
        image: c.character?.images?.jpg?.image_url || null,
        role: c.role || '',
      }));
      anime.trailer = data.data?.trailer?.url || null;
      return res.json({ content: anime });
    }

    const tmdbKey = process.env.TMDB_API_KEY;
    if (!tmdbKey) return res.status(200).json({ content: null });
    const r = await fetch(`${TMDB_BASE}/${type}/${id}?${tmdbParams()}language=en&append_to_response=credits,similar,videos`, { headers: tmdbHeaders() });
    const data = await r.json();
    if (data.success === false) return res.status(404).json({ error: 'Icerik bulunamadi.' });
    const content = normalizeTmdb(data, type);
    content.credits = {
      cast: (data.credits?.cast || []).slice(0, 12).map(c => ({
        name: c.name, character: c.character,
        image: c.profile_path ? `${TMDB_IMG}${c.profile_path}` : null,
      })),
    };
    content.similar = (data.similar?.results || []).slice(0, 6).map(i => normalizeTmdb(i, type));
    const trailers = (data.videos?.results || []).filter(v => v.type === 'Trailer' && v.site === 'YouTube');
    content.trailer = trailers.length > 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : null;
    return res.json({ content });
  } catch (e) {
    console.error('Detail error:', e);
    res.status(500).json({ error: 'Detay alinamadi.' });
  }
});

// GET /api/content/browse?type=movie&genre=Action&filter=popular&page=1&sort=rating
router.get('/browse', async (req, res) => {
  const type = req.query.type || 'movie';
  const genre = (req.query.genre || '').trim();
  const filter = req.query.filter || 'popular';
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || 'rating';
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    let match = { type };
    if (genre) {
      match.genres = new RegExp(genre, 'i');
    }

    let sortObj = {};
    if (filter === 'new') sortObj = { year: -1 };
    else if (filter === 'old') sortObj = { year: 1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'year') sortObj = { year: -1 };
    else if (sort === 'title') sortObj = { title: 1 };
    else sortObj = { rating: -1 };

    // For anime: deduplicate by mal_id
    const isAnime = type === 'anime';
    let total, rows;

    if (isAnime) {
      const countPipeline = [
        { $match: match },
        { $group: { _id: '$mal_id' } },
        { $count: 'total' }
      ];
      const countResult = await ContentCache.aggregate(countPipeline);
      total = countResult[0]?.total || 0;

      const pipeline = [
        { $match: match },
        { $sort: sortObj },
        { $group: { _id: '$mal_id', doc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: sortObj },
        { $skip: offset },
        { $limit: limit }
      ];
      rows = await ContentCache.aggregate(pipeline);
    } else {
      // For movie/tv: deduplicate by tmdb_id
      const countPipeline = [
        { $match: match },
        { $group: { _id: '$tmdb_id' } },
        { $count: 'total' }
      ];
      const countResult = await ContentCache.aggregate(countPipeline);
      total = countResult[0]?.total || 0;

      const pipeline = [
        { $match: match },
        { $sort: sortObj },
        { $group: { _id: '$tmdb_id', doc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: sortObj },
        { $skip: offset },
        { $limit: limit }
      ];
      rows = await ContentCache.aggregate(pipeline);
    }

    return res.json({
      results: rows.map(normalizeCache),
      hasMore: offset + limit < total,
      total,
      source: 'cache',
    });
  } catch (e) {
    console.error('Browse error:', e);
    res.status(500).json({ error: 'İçerik alınamadı.' });
  }
});

// GET /api/content/genres?type=movie
router.get('/genres', async (req, res) => {
  const type = req.query.type || 'movie';
  try {
    const rows = await ContentCache.find({ type }).select('genres -_id').limit(5000);
    const genreSet = new Set();
    rows.forEach(r => {
      if (r.genres) {
        r.genres.split(', ').forEach(g => { if (g.trim()) genreSet.add(g.trim()); });
      }
    });
    const sorted = Array.from(genreSet).sort();
    res.json({ genres: sorted });
  } catch (e) {
    res.status(500).json({ genres: [] });
  }
});

// GET /api/content/stats
router.get('/stats', async (req, res) => {
  try {
    const movies = await ContentCache.countDocuments({ type: 'movie' });
    const tv = await ContentCache.countDocuments({ type: 'tv' });
    const anime = await ContentCache.countDocuments({ type: 'anime' });
    const lastSyncDoc = await ContentCache.findOne().sort({ synced_at: -1 });
    const lastSync = lastSyncDoc ? lastSyncDoc.synced_at : null;
    res.json({ movies, tv, anime, total: movies + tv + anime, lastSync });
  } catch (err) {
    res.status(500).json({ error: 'Stats failed' });
  }
});

module.exports = router;
