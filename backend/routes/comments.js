const express = require('express');
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

function commentOut(row) {
  return {
    id: row.id,
    body: row.is_removed ? '[Bu yorum kaldırıldı]' : row.body,
    is_removed: !!row.is_removed,
    parent_id: row.parent_id,
    created_at: row.created_at,
    user: { id: row.user_id, username: row.username, avatar_url: row.avatar_url },
  };
}

// GET /api/comments?content_key=movie-550
router.get('/', optionalAuth, (req, res) => {
  const contentKey = (req.query.content_key || '').toString();
  if (!contentKey) return res.status(400).json({ error: 'content_key gerekli.' });

  const rows = db
    .prepare(
      `SELECT c.*, u.username, u.avatar_url FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.content_key = ?
       ORDER BY c.created_at ASC`
    )
    .all(contentKey);

  const avg = db
    .prepare(`SELECT AVG(score) as avg, COUNT(*) as count FROM ratings WHERE content_key = ?`)
    .get(contentKey);

  let myRating = null;
  if (req.user) {
    const r = db
      .prepare(`SELECT score FROM ratings WHERE content_key = ? AND user_id = ?`)
      .get(contentKey, req.user.id);
    myRating = r ? r.score : null;
  }

  res.json({
    comments: rows.map(commentOut),
    rating: { average: avg.avg ? Number(avg.avg.toFixed(1)) : 0, count: avg.count, mine: myRating },
  });
});

// POST /api/comments  { content_key, content_title, content_type, body, parent_id? }
router.post('/', requireAuth, (req, res) => {
  const { content_key, content_title, content_type, body, parent_id } = req.body || {};
  if (!content_key || !body || !body.trim()) {
    return res.status(400).json({ error: 'content_key ve yorum metni gerekli.' });
  }
  const info = db
    .prepare(
      `INSERT INTO comments (user_id, content_key, content_title, content_type, parent_id, body)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.id, content_key, content_title || null, content_type || null, parent_id || null, body.trim());

  const row = db
    .prepare(
      `SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON u.id=c.user_id WHERE c.id = ?`
    )
    .get(info.lastInsertRowid);
  res.json({ comment: commentOut(row) });
});

// DELETE /api/comments/:id  (yazan kişi veya admin silebilir)
router.delete('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Yorum bulunamadı.' });
  if (row.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Bu yorumu silme yetkiniz yok.' });
  }
  db.prepare('UPDATE comments SET is_removed = 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// POST /api/comments/rate  { content_key, content_title, content_type, score }
router.post('/rate', requireAuth, (req, res) => {
  const { content_key, content_title, content_type, score } = req.body || {};
  const s = Number(score);
  if (!content_key || !s || s < 1 || s > 10) {
    return res.status(400).json({ error: 'content_key ve 1-10 arası puan gerekli.' });
  }
  db.prepare(
    `INSERT INTO ratings (user_id, content_key, content_title, content_poster, content_type, score)
     VALUES (@user_id, @content_key, @content_title, NULL, @content_type, @score)
     ON CONFLICT(user_id, content_key) DO UPDATE SET score = excluded.score`
  ).run({
    user_id: req.user.id,
    content_key,
    content_title: content_title || null,
    content_type: content_type || null,
    score: s,
  });

  const avg = db
    .prepare(`SELECT AVG(score) as avg, COUNT(*) as count FROM ratings WHERE content_key = ?`)
    .get(content_key);
  res.json({ rating: { average: Number(avg.avg.toFixed(1)), count: avg.count, mine: s } });
});

module.exports = router;
