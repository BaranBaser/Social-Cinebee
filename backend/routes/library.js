const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/library?status=watched|watchlist
router.get('/', requireAuth, (req, res) => {
  const status = req.query.status || 'watched';
  if (!['watched', 'watchlist'].includes(status)) {
    return res.status(400).json({ error: 'Gecersiz durum.' });
  }
  const rows = db
    .prepare(
      `SELECT * FROM library WHERE user_id = ? AND status = ? ORDER BY created_at DESC`
    )
    .all(req.user.id, status);
  res.json({ items: rows });
});

// GET /api/library/stats
router.get('/stats', requireAuth, (req, res) => {
  const watched = db
    .prepare(`SELECT COUNT(*) as c FROM library WHERE user_id = ? AND status = 'watched'`)
    .get(req.user.id).c;
  const watchlist = db
    .prepare(`SELECT COUNT(*) as c FROM library WHERE user_id = ? AND status = 'watchlist'`)
    .get(req.user.id).c;
  res.json({ watched, watchlist });
});

// POST /api/library  { content_key, content_title, content_poster, content_type, status }
router.post('/', requireAuth, (req, res) => {
  const { content_key, content_title, content_poster, content_type, status } = req.body || {};
  if (!content_key || !status) {
    return res.status(400).json({ error: 'content_key ve status gerekli.' });
  }
  if (!['watched', 'watchlist'].includes(status)) {
    return res.status(400).json({ error: 'Status watched veya watchlist olmali.' });
  }

  db.prepare(
    `INSERT INTO library (user_id, content_key, content_title, content_poster, content_type, status)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, content_key) DO UPDATE SET status = excluded.status, content_title = excluded.content_title, content_poster = excluded.content_poster, content_type = excluded.content_type`
  ).run(req.user.id, content_key, content_title || null, content_poster || null, content_type || null, status);

  res.json({ ok: true, status });
});

// DELETE /api/library/:key
router.delete('/:key', requireAuth, (req, res) => {
  const key = decodeURIComponent(req.params.key);
  db.prepare(`DELETE FROM library WHERE user_id = ? AND content_key = ?`).run(req.user.id, key);
  res.json({ ok: true });
});

// GET /api/library/check/:key
router.get('/check/:key', requireAuth, (req, res) => {
  const key = decodeURIComponent(req.params.key);
  const row = db
    .prepare(`SELECT status FROM library WHERE user_id = ? AND content_key = ?`)
    .get(req.user.id, key);
  res.json({ status: row ? row.status : null });
});

module.exports = router;
