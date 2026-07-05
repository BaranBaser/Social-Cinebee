const express = require('express');
const { ChatRoom, RoomMessage, DmMessage, User } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/rooms
router.get('/rooms', requireAuth, async (req, res) => {
  try {
    const rooms = await ChatRoom.find().sort({ _id: 1 });
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ error: 'Odalar getirilemedi.' });
  }
});

// Bir içerik için oda yoksa oluşturur, varsa döner
// POST /api/chat/rooms/for-content { content_key, name }
router.post('/rooms/for-content', requireAuth, async (req, res) => {
  const { content_key, name } = req.body || {};
  if (!content_key || !name) return res.status(400).json({ error: 'content_key ve name gerekli.' });

  try {
    let room = await ChatRoom.findOne({ content_key });
    if (!room) {
      room = await ChatRoom.create({ name: `${name} Sohbeti`, content_key });
    }
    res.json({ room });
  } catch (err) {
    res.status(500).json({ error: 'Oda oluşturulamadı.' });
  }
});

// GET /api/chat/rooms/:id/messages
router.get('/rooms/:id/messages', requireAuth, async (req, res) => {
  try {
    const messages = await RoomMessage.find({ room_id: req.params.id })
      .populate('user_id', 'username avatar_url')
      .sort({ created_at: 1 })
      .limit(200);

    res.json({
      messages: messages.map((m) => ({
        id: m._id,
        body: m.body,
        created_at: m.created_at,
        user: m.user_id ? { id: m.user_id._id, username: m.user_id.username, avatar_url: m.user_id.avatar_url } : null,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Mesajlar getirilemedi.' });
  }
});

// GET /api/chat/dm/:userId  -> iki kullanıcı arasındaki geçmiş
router.get('/dm/:userId', requireAuth, async (req, res) => {
  const otherId = req.params.userId;
  const myId = req.user._id;

  try {
    const messages = await DmMessage.find({
      $or: [
        { sender_id: myId, receiver_id: otherId },
        { sender_id: otherId, receiver_id: myId }
      ]
    })
    .sort({ created_at: 1 })
    .limit(200);

    await DmMessage.updateMany(
      { sender_id: otherId, receiver_id: myId, is_read: false },
      { $set: { is_read: true } }
    );

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'DM mesajları getirilemedi.' });
  }
});

// GET /api/chat/dm  -> konuşma listesi (son mesaja göre)
router.get('/dm', requireAuth, async (req, res) => {
  const myId = req.user._id;

  try {
    // Tüm mesajlarımdan diğer kullanıcıları bul
    const messages = await DmMessage.find({
      $or: [{ sender_id: myId }, { receiver_id: myId }]
    }).sort({ created_at: -1 });

    const map = new Map();

    for (const m of messages) {
      const otherId = m.sender_id.toString() === myId.toString() ? m.receiver_id.toString() : m.sender_id.toString();
      
      if (!map.has(otherId)) {
        map.set(otherId, {
          userId: otherId,
          last_message: m.body,
          unread: 0,
          created_at: m.created_at
        });
      }
      
      if (m.receiver_id.toString() === myId.toString() && !m.is_read) {
        map.get(otherId).unread += 1;
      }
    }

    const conversations = [];
    for (const [otherId, data] of map.entries()) {
      const u = await User.findById(otherId).select('username avatar_url');
      if (u) {
        conversations.push({
          id: u._id,
          username: u.username,
          avatar_url: u.avatar_url,
          last_message: data.last_message,
          unread: data.unread
        });
      }
    }

    res.json({ conversations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DM listesi getirilemedi.' });
  }
});

module.exports = router;
