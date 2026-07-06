const express = require('express');
const { Library, ContentCache } = require('../db');
const { requireAuth } = require('../middleware/auth');
const fetch = require('node-fetch');

const router = express.Router();

// GET /api/library?status=watched|watchlist
router.get('/', requireAuth, async (req, res) => {
  const status = req.query.status || 'watched';
  if (!['watched', 'watchlist'].includes(status)) {
    return res.status(400).json({ error: 'Gecersiz durum.' });
  }

  try {
    const items = await Library.find({ user_id: req.user._id, status })
      .sort({ created_at: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Kütüphane alınamadı.' });
  }
});

// GET /api/library/stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const watched = await Library.countDocuments({ user_id: req.user._id, status: 'watched' });
    const watchlist = await Library.countDocuments({ user_id: req.user._id, status: 'watchlist' });
    res.json({ watched, watchlist });
  } catch (err) {
    res.status(500).json({ error: 'Kütüphane istatistikleri alınamadı.' });
  }
});

// POST /api/library  { content_key, content_title, content_poster, content_type, status }
router.post('/', requireAuth, async (req, res) => {
  const { content_key, content_title, content_poster, content_type, status } = req.body || {};
  if (!content_key || !status) {
    return res.status(400).json({ error: 'content_key ve status gerekli.' });
  }
  if (!['watched', 'watchlist'].includes(status)) {
    return res.status(400).json({ error: 'Status watched veya watchlist olmali.' });
  }

  try {
    await Library.findOneAndUpdate(
      { user_id: req.user._id, content_key },
      {
        user_id: req.user._id,
        content_key,
        content_title: content_title || null,
        content_poster: content_poster || null,
        content_type: content_type || null,
        status
      },
      { upsert: true, new: true }
    );
    res.json({ ok: true, status });
  } catch (err) {
    res.status(500).json({ error: 'Kütüphaneye eklenemedi.' });
  }
});

// DELETE /api/library/:key
router.delete('/:key', requireAuth, async (req, res) => {
  const key = decodeURIComponent(req.params.key);
  try {
    await Library.findOneAndDelete({ user_id: req.user._id, content_key: key });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Kütüphaneden silinemedi.' });
  }
});

// GET /api/library/check/:key
router.get('/check/:key', requireAuth, async (req, res) => {
  const key = decodeURIComponent(req.params.key);
  try {
    const item = await Library.findOne({ user_id: req.user._id, content_key: key });
    res.json({ status: item ? item.status : null });
  } catch (err) {
    res.status(500).json({ error: 'Kütüphane durumu kontrol edilemedi.' });
  }
});

// GET /api/library/calendar
router.get('/calendar', requireAuth, async (req, res) => {
  try {
    const items = await Library.find({ user_id: req.user._id });
    if (!items.length) return res.json({ items: [] });

    const tmdbKey = process.env.TMDB_API_KEY;
    const TMDB_BASE = 'https://api.themoviedb.org/3';
    const tmdbParams = () => {
      if (!tmdbKey || tmdbKey.startsWith('eyJ')) return '';
      return `api_key=${tmdbKey}&`;
    };
    const tmdbHeaders = () => {
      if (tmdbKey && tmdbKey.startsWith('eyJ')) return { Authorization: `Bearer ${tmdbKey}` };
      return {};
    };

    const results = [];
    const now = new Date();

    // Limit concurrency to avoid rate limits
    for (const item of items) {
      if (item.content_type === 'movie' || item.content_type === 'tv') {
        const id = item.content_key.split('-')[1];
        let cache = await ContentCache.findOne({ content_key: item.content_key });
        
        // Fetch from TMDB if not cached or cache is older than 24 hours
        if (!cache || !cache.synced_at || (now - cache.synced_at) > 24 * 60 * 60 * 1000) {
          try {
            const r = await fetch(`${TMDB_BASE}/${item.content_type}/${id}?${tmdbParams()}language=en`, { headers: tmdbHeaders() });
            const data = await r.json();
            if (data && !data.success && data.success !== undefined) continue;

            if (!cache) cache = new ContentCache({ content_key: item.content_key, type: item.content_type, title: item.content_title || data.title || data.name || 'Unknown' });
            
            if (item.content_type === 'movie') {
              if (data.release_date) cache.release_date = new Date(data.release_date);
            } else if (item.content_type === 'tv') {
              if (data.next_episode_to_air) {
                cache.next_episode = {
                  air_date: new Date(data.next_episode_to_air.air_date),
                  episode_number: data.next_episode_to_air.episode_number,
                  season_number: data.next_episode_to_air.season_number,
                  name: data.next_episode_to_air.name
                };
              } else {
                cache.next_episode = null;
              }
              if (data.last_episode_to_air) {
                cache.last_episode = {
                  air_date: new Date(data.last_episode_to_air.air_date),
                  episode_number: data.last_episode_to_air.episode_number,
                  season_number: data.last_episode_to_air.season_number,
                  name: data.last_episode_to_air.name
                };
              }
            }
            cache.synced_at = new Date();
            await cache.save();
          } catch (err) {
            console.error('TMDB fetch error for calendar:', err);
          }
        }

        if (cache) {
          results.push({
            ...item.toObject(),
            release_date: cache.release_date,
            next_episode: cache.next_episode,
            last_episode: cache.last_episode
          });
        }
      } else {
        // Just return anime items without specific dates for now to avoid Jikan rate limit
        results.push(item.toObject());
      }
    }

    res.json({ items: results });
  } catch (err) {
    console.error('Calendar error:', err);
    res.status(500).json({ error: 'Takvim verileri alınamadı.' });
  }
});

module.exports = router;
