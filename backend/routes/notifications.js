const express = require('express');
const { Notification, User } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications — kullanıcının bildirimleri
router.get('/', requireAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  try {
    const notifications = await Notification.find({ user_id: req.user._id })
      .populate('from_user_id', 'username avatar_url')
      .sort({ created_at: -1 })
      .limit(limit);

    const unreadCount = await Notification.countDocuments({ user_id: req.user._id, is_read: false });

    res.json({
      notifications: notifications.map(n => ({
        id: n._id,
        type: n.type,
        title: n.title,
        body: n.body,
        link: n.link,
        is_read: n.is_read,
        created_at: n.created_at,
        from_user: n.from_user_id ? { id: n.from_user_id._id, username: n.from_user_id.username, avatar_url: n.from_user_id.avatar_url } : null,
      })),
      unread_count: unreadCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Bildirimler alınamadı.' });
  }
});

// GET /api/notifications/unread-count
router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user_id: req.user._id, is_read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
});

// POST /api/notifications/read — tümünü okundu işaretle
router.post('/read', requireAuth, async (req, res) => {
  try {
    await Notification.updateMany({ user_id: req.user._id, is_read: false }, { $set: { is_read: true } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'İşlenemedi.' });
  }
});

// POST /api/notifications/read/:id — tek bildirimi okundu işaretle
router.post('/read/:id', requireAuth, async (req, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { $set: { is_read: true } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'İşlenemedi.' });
  }
});

// Helper: bildirim oluştur (diğer route'lardan çağrılır)
async function createNotification({ user_id, from_user_id, type, title, body, link }) {
  try {
    if (String(user_id) === String(from_user_id)) return;
    const recent = await Notification.findOne({
      user_id, from_user_id, type,
      created_at: { $gte: new Date(Date.now() - 5000) }
    });
    if (recent) return;
    await Notification.create({ user_id, from_user_id, type, title, body, link });
  } catch {}
}

module.exports = router;
module.exports.createNotification = createNotification;
