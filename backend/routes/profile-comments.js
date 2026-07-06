const express = require('express');
const { ProfileComment } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/profile-comments/:userId
router.get('/:userId', async (req, res) => {
  try {
    const comments = await ProfileComment.find({ user_id: req.params.userId })
      .populate('author_id', 'username avatar_url')
      .sort({ created_at: -1 });
    res.json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yorumlar alınamadı.' });
  }
});

// POST /api/profile-comments/:userId
router.post('/:userId', requireAuth, async (req, res) => {
  const { body } = req.body || {};
  if (!body || !body.trim()) {
    return res.status(400).json({ error: 'Yorum boş olamaz.' });
  }
  try {
    const comment = await ProfileComment.create({
      user_id: req.params.userId,
      author_id: req.user._id,
      body: body.trim().slice(0, 500)
    });
    await comment.populate('author_id', 'username avatar_url');
    res.status(201).json({ comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yorum eklenemedi.' });
  }
});

// DELETE /api/profile-comments/:commentId
router.delete('/:commentId', requireAuth, async (req, res) => {
  try {
    const comment = await ProfileComment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Yorum bulunamadi.' });
    const isAuthor = comment.author_id.toString() === req.user._id.toString();
    const isProfileOwner = comment.user_id.toString() === req.user._id.toString();
    if (!isAuthor && !isProfileOwner) {
      return res.status(403).json({ error: 'Bu yorumu silme yetkiniz yok.' });
    }
    await comment.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yorum silinemedi.' });
  }
});

module.exports = router;
