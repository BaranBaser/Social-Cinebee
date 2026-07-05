const express = require('express');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const users = db.prepare('SELECT COUNT(*) c FROM users').get().c;
  const comments = db.prepare('SELECT COUNT(*) c FROM comments WHERE is_removed = 0').get().c;
  const ratings = db.prepare('SELECT COUNT(*) c FROM ratings').get().c;
  const messages =
    db.prepare('SELECT COUNT(*) c FROM room_messages').get().c +
    db.prepare('SELECT COUNT(*) c FROM dm_messages').get().c;
  const bannedUsers = db.prepare('SELECT COUNT(*) c FROM users WHERE is_banned = 1').get().c;
  res.json({ users, comments, ratings, messages, bannedUsers });
});

// GET /api/admin/users?q=
router.get('/users', (req, res) => {
  const q = (req.query.q || '').toString().trim();
  let rows;
  if (q) {
    rows = db
      .prepare(
        `SELECT id, username, email, role, is_banned, created_at FROM users
         WHERE username LIKE ? OR email LIKE ? ORDER BY created_at DESC`
      )
      .all(`%${q}%`, `%${q}%`);
  } else {
    rows = db
      .prepare('SELECT id, username, email, role, is_banned, created_at FROM users ORDER BY created_at DESC')
      .all();
  }
  res.json({ users: rows });
});

// PUT /api/admin/users/:id  { role?, is_banned? }
router.put('/users/:id', (req, res) => {
  const target = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!target) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
  if (target.id === req.user.id) {
    return res.status(400).json({ error: 'Kendi hesabınızı buradan değiştiremezsiniz.' });
  }

  const role = req.body?.role ?? target.role;
  const is_banned = req.body?.is_banned ?? target.is_banned;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Geçersiz rol.' });

  db.prepare('UPDATE users SET role = ?, is_banned = ? WHERE id = ?').run(
    role,
    is_banned ? 1 : 0,
    req.params.id
  );
  const updated = db
    .prepare('SELECT id, username, email, role, is_banned, created_at FROM users WHERE id = ?')
    .get(req.params.id);
  res.json({ user: updated });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'Kendi hesabınızı silemezsiniz.' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/comments?q=
router.get('/comments', (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.*, u.username FROM comments c JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC LIMIT 200`
    )
    .all();
  res.json({ comments: rows });
});

// DELETE /api/admin/comments/:id
router.delete('/comments/:id', (req, res) => {
  db.prepare('UPDATE comments SET is_removed = 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/rooms
router.get('/rooms', (req, res) => {
  const rows = db.prepare('SELECT * FROM chat_rooms ORDER BY id ASC').all();
  res.json({ rooms: rows });
});

module.exports = router;
