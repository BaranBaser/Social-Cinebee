const express = require('express');
const { User, Comment, Rating, RoomMessage, DmMessage, ChatRoom } = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const users = await User.countDocuments();
    const comments = await Comment.countDocuments({ is_removed: false });
    const ratings = await Rating.countDocuments();
    const roomMsgs = await RoomMessage.countDocuments();
    const dmMsgs = await DmMessage.countDocuments();
    const messages = roomMsgs + dmMsgs;
    const bannedUsers = await User.countDocuments({ is_banned: true });
    
    res.json({ users, comments, ratings, messages, bannedUsers });
  } catch (err) {
    res.status(500).json({ error: 'İstatistikler alınamadı.' });
  }
});

// GET /api/admin/users?q=
router.get('/users', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  try {
    let query = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      query = { $or: [{ username: regex }, { email: regex }] };
    }
    
    const users = await User.find(query)
      .select('id username email role is_banned created_at')
      .sort({ created_at: -1 });
      
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Kullanıcılar alınamadı.' });
  }
});

// PUT /api/admin/users/:id  { role?, is_banned? }
router.put('/users/:id', async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    if (target._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Kendi hesabınızı buradan değiştiremezsiniz.' });
    }

    const role = req.body?.role ?? target.role;
    const is_banned = req.body?.is_banned ?? target.is_banned;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Geçersiz rol.' });

    target.role = role;
    target.is_banned = !!is_banned;
    await target.save();

    const updated = await User.findById(req.params.id).select('id username email role is_banned created_at');
    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ error: 'Kullanıcı güncellenemedi.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ error: 'Kendi hesabınızı silemezsiniz.' });
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Kullanıcı silinemedi.' });
  }
});

// GET /api/admin/comments?q=
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user_id', 'username')
      .sort({ created_at: -1 })
      .limit(200);

    const formatted = comments.map(c => ({
      ...c.toObject(),
      username: c.user_id ? c.user_id.username : 'Bilinmiyor'
    }));

    res.json({ comments: formatted });
  } catch (err) {
    res.status(500).json({ error: 'Yorumlar alınamadı.' });
  }
});

// DELETE /api/admin/comments/:id
router.delete('/comments/:id', async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { is_removed: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Yorum silinemedi.' });
  }
});

// GET /api/admin/rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await ChatRoom.find().sort({ _id: 1 });
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ error: 'Odalar alınamadı.' });
  }
});

module.exports = router;
