const express = require('express');
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

db.exec(`
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_key TEXT,
  content_type TEXT,
  content_title TEXT,
  content_poster TEXT,
  body TEXT NOT NULL DEFAULT '',
  score INTEGER,
  status TEXT CHECK (status IN ('watched', 'watchlist')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS post_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
`);

// GET /api/social/feed — herkese açık, tüm gönderiler (tarihe göre)
router.get('/feed', optionalAuth, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 30, 100);
  const offset = parseInt(req.query.offset) || 0;
  const userId = req.user ? req.user.id : null;

  let posts;
  if (userId) {
    posts = db.prepare(`
      SELECT p.*, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) as user_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset);
  } else {
    posts = db.prepare(`
      SELECT p.*, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
        0 as user_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);
  }

  res.json({ posts });
});

// POST /api/social/posts — yeni gönderi oluştur
router.post('/posts', requireAuth, (req, res) => {
  const { content_key, content_type, content_title, content_poster, body, score, status } = req.body || {};

  if (!body && !content_key) {
    return res.status(400).json({ error: 'İçerik veya metin gerekli.' });
  }
  if (score !== undefined && (score < 1 || score > 10)) {
    return res.status(400).json({ error: 'Puan 1 ile 10 arasında olmalı.' });
  }
  if (status && !['watched', 'watchlist'].includes(status)) {
    return res.status(400).json({ error: 'Durum watched veya watchlist olmalı.' });
  }

  const info = db.prepare(`
    INSERT INTO posts (user_id, content_key, content_type, content_title, content_poster, body, score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.user.id,
    content_key || null,
    content_type || null,
    content_title || null,
    content_poster || null,
    body || '',
    score || null,
    status || null
  );

  const post = db.prepare(`
    SELECT p.*, u.username, u.avatar_url, 0 as like_count, 1 as user_liked
    FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?
  `).get(info.lastInsertRowid);

  res.json({ ok: true, post });
});

// DELETE /api/social/posts/:id — kendi gönderisini sil
router.delete('/posts/:id', requireAuth, (req, res) => {
  const postId = parseInt(req.params.id);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı.' });
  if (post.user_id !== req.user.id) return res.status(403).json({ error: 'Bu gönderiyi silemezsiniz.' });

  db.prepare('DELETE FROM post_likes WHERE post_id = ?').run(postId);
  db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
  res.json({ ok: true });
});

// POST /api/social/posts/:id/like — beğeni toggle
router.post('/posts/:id/like', requireAuth, (req, res) => {
  const postId = parseInt(req.params.id);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı.' });

  const existing = db.prepare('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?').get(req.user.id, postId);

  if (existing) {
    db.prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?').run(req.user.id, postId);
  } else {
    db.prepare('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)').run(req.user.id, postId);
  }

  const likeCount = db.prepare('SELECT COUNT(*) as c FROM post_likes WHERE post_id = ?').get(postId).c;
  res.json({ ok: true, liked: !existing, like_count: likeCount });
});

// GET /api/social/posts/:id/likes — beğenileri listele
router.get('/posts/:id/likes', optionalAuth, (req, res) => {
  const postId = parseInt(req.params.id);
  const likes = db.prepare(`
    SELECT u.id, u.username, u.avatar_url, pl.created_at
    FROM post_likes pl JOIN users u ON pl.user_id = u.id
    WHERE pl.post_id = ?
    ORDER BY pl.created_at DESC
  `).all(postId);

  res.json({ likes, count: likes.length });
});

// GET /api/social/trending — en çok paylaşılan içerikler
router.get('/trending', optionalAuth, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const trending = db.prepare(`
    SELECT content_key, content_type, content_title, content_poster, COUNT(*) as post_count
    FROM posts
    WHERE content_key IS NOT NULL
    GROUP BY content_key
    ORDER BY post_count DESC
    LIMIT ?
  `).all(limit);

  res.json({ trending });
});

// GET /api/social/active-users — son zamanlarda aktif kullanıcılar
router.get('/active-users', optionalAuth, (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const users = db.prepare(`
    SELECT DISTINCT u.id, u.username, u.avatar_url,
      MAX(p.created_at) as last_active
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    WHERE p.created_at IS NOT NULL
    GROUP BY u.id
    ORDER BY last_active DESC
    LIMIT ?
  `).all(limit);

  res.json({ users });
});

module.exports = router;
