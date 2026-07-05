const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/rooms
router.get('/rooms', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM chat_rooms ORDER BY id ASC').all();
  res.json({ rooms: rows });
});

// Bir içerik için oda yoksa oluşturur, varsa döner
// POST /api/chat/rooms/for-content { content_key, name }
router.post('/rooms/for-content', requireAuth, (req, res) => {
  const { content_key, name } = req.body || {};
  if (!content_key || !name) return res.status(400).json({ error: 'content_key ve name gerekli.' });

  let room = db.prepare('SELECT * FROM chat_rooms WHERE content_key = ?').get(content_key);
  if (!room) {
    const info = db
      .prepare('INSERT INTO chat_rooms (name, content_key) VALUES (?, ?)')
      .run(`${name} Sohbeti`, content_key);
    room = db.prepare('SELECT * FROM chat_rooms WHERE id = ?').get(info.lastInsertRowid);
  }
  res.json({ room });
});

// GET /api/chat/rooms/:id/messages
router.get('/rooms/:id/messages', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT m.*, u.username, u.avatar_url FROM room_messages m
       JOIN users u ON u.id = m.user_id
       WHERE m.room_id = ? ORDER BY m.created_at ASC LIMIT 200`
    )
    .all(req.params.id);
  res.json({
    messages: rows.map((r) => ({
      id: r.id,
      body: r.body,
      created_at: r.created_at,
      user: { id: r.user_id, username: r.username, avatar_url: r.avatar_url },
    })),
  });
});

// GET /api/chat/dm/:userId  -> iki kullanıcı arasındaki geçmiş
router.get('/dm/:userId', requireAuth, (req, res) => {
  const otherId = Number(req.params.userId);
  const rows = db
    .prepare(
      `SELECT * FROM dm_messages
       WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC LIMIT 200`
    )
    .all(req.user.id, otherId, otherId, req.user.id);

  db.prepare(
    `UPDATE dm_messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?`
  ).run(otherId, req.user.id);

  res.json({ messages: rows });
});

// GET /api/chat/dm  -> konuşma listesi (son mesaja göre)
router.get('/dm', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.username, u.avatar_url,
              (SELECT body FROM dm_messages d2 WHERE (d2.sender_id=u.id AND d2.receiver_id=?) OR (d2.sender_id=? AND d2.receiver_id=u.id) ORDER BY d2.created_at DESC LIMIT 1) as last_message,
              (SELECT COUNT(*) FROM dm_messages d3 WHERE d3.sender_id = u.id AND d3.receiver_id = ? AND d3.is_read = 0) as unread
       FROM users u
       WHERE u.id IN (
         SELECT sender_id FROM dm_messages WHERE receiver_id = ?
         UNION
         SELECT receiver_id FROM dm_messages WHERE sender_id = ?
       )`
    )
    .all(req.user.id, req.user.id, req.user.id, req.user.id, req.user.id);
  res.json({ conversations: rows });
});

module.exports = router;
