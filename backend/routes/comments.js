const express = require('express');
const { Comment, Rating } = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

function commentOut(c) {
  return {
    id: c._id,
    body: c.is_removed ? '[Bu yorum kaldırıldı]' : c.body,
    is_removed: !!c.is_removed,
    parent_id: c.parent_id,
    created_at: c.created_at,
    user: c.user_id ? { id: c.user_id._id, username: c.user_id.username, avatar_url: c.user_id.avatar_url } : null,
  };
}

// GET /api/comments?content_key=movie-550
router.get('/', optionalAuth, async (req, res) => {
  const contentKey = (req.query.content_key || '').toString();
  if (!contentKey) return res.status(400).json({ error: 'content_key gerekli.' });

  try {
    const comments = await Comment.find({ content_key: contentKey })
      .populate('user_id', 'username avatar_url')
      .sort({ created_at: 1 });

    const avgResult = await Rating.aggregate([
      { $match: { content_key: contentKey } },
      { $group: { _id: null, avg: { $avg: '$score' }, count: { $sum: 1 } } }
    ]);
    
    const avg = avgResult.length > 0 ? avgResult[0] : { avg: 0, count: 0 };

    let myRating = null;
    if (req.user) {
      const r = await Rating.findOne({ content_key: contentKey, user_id: req.user._id });
      myRating = r ? r.score : null;
    }

    res.json({
      comments: comments.map(commentOut),
      rating: { average: avg.avg ? Number(avg.avg.toFixed(1)) : 0, count: avg.count, mine: myRating },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yorumlar getirilemedi.' });
  }
});

// POST /api/comments  { content_key, content_title, content_type, body, parent_id? }
router.post('/', requireAuth, async (req, res) => {
  const { content_key, content_title, content_type, body, parent_id } = req.body || {};
  if (!content_key || !body || !body.trim()) {
    return res.status(400).json({ error: 'content_key ve yorum metni gerekli.' });
  }

  try {
    const newComment = await Comment.create({
      user_id: req.user._id,
      content_key,
      content_title: content_title || null,
      content_type: content_type || null,
      parent_id: parent_id || null,
      body: body.trim()
    });

    const populated = await Comment.findById(newComment._id).populate('user_id', 'username avatar_url');
    res.json({ comment: commentOut(populated) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yorum gönderilemedi.' });
  }
});

// DELETE /api/comments/:id  (yazan kişi veya admin silebilir)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Yorum bulunamadı.' });
    
    if (comment.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bu yorumu silme yetkiniz yok.' });
    }
    
    comment.is_removed = true;
    await comment.save();
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yorum silinemedi.' });
  }
});

// POST /api/comments/rate  { content_key, content_title, content_type, score }
router.post('/rate', requireAuth, async (req, res) => {
  const { content_key, content_title, content_type, score } = req.body || {};
  const s = Number(score);
  if (!content_key || !s || s < 1 || s > 10) {
    return res.status(400).json({ error: 'content_key ve 1-10 arası puan gerekli.' });
  }

  try {
    await Rating.findOneAndUpdate(
      { user_id: req.user._id, content_key },
      { 
        user_id: req.user._id, 
        content_key, 
        content_title: content_title || null, 
        content_type: content_type || null, 
        score: s 
      },
      { upsert: true, new: true }
    );

    const avgResult = await Rating.aggregate([
      { $match: { content_key } },
      { $group: { _id: null, avg: { $avg: '$score' }, count: { $sum: 1 } } }
    ]);
    const avg = avgResult.length > 0 ? avgResult[0] : { avg: 0, count: 0 };

    res.json({ rating: { average: Number(avg.avg.toFixed(1)), count: avg.count, mine: s } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Puan verilemedi.' });
  }
});

module.exports = router;
