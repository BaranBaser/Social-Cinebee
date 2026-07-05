const express = require('express');
const { Library } = require('../db');
const { requireAuth } = require('../middleware/auth');

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

module.exports = router;
