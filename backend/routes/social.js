const express = require('express');
const { Post, PostLike, User } = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/social/feed — herkese açık, tüm gönderiler (tarihe göre)
router.get('/feed', optionalAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 30, 100);
  const offset = parseInt(req.query.offset) || 0;
  const userId = req.user ? req.user._id : null;

  try {
    const posts = await Post.find()
      .populate('user_id', 'username avatar_url')
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit);

    const formattedPosts = [];
    for (const p of posts) {
      const like_count = await PostLike.countDocuments({ post_id: p._id });
      let user_liked = 0;
      if (userId) {
        const liked = await PostLike.findOne({ post_id: p._id, user_id: userId });
        if (liked) user_liked = 1;
      }

      formattedPosts.push({
        ...p.toObject(),
        id: p._id,
        username: p.user_id ? p.user_id.username : 'Bilinmiyor',
        avatar_url: p.user_id ? p.user_id.avatar_url : null,
        like_count,
        user_liked
      });
    }

    res.json({ posts: formattedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Akış alınamadı.' });
  }
});

// POST /api/social/posts — yeni gönderi oluştur
router.post('/posts', requireAuth, async (req, res) => {
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

  try {
    const newPost = await Post.create({
      user_id: req.user._id,
      content_key: content_key || null,
      content_type: content_type || null,
      content_title: content_title || null,
      content_poster: content_poster || null,
      body: body || '',
      score: score || null,
      status: status || null
    });

    const populated = await Post.findById(newPost._id).populate('user_id', 'username avatar_url');

    res.json({ 
      ok: true, 
      post: {
        ...populated.toObject(),
        id: populated._id,
        username: populated.user_id.username,
        avatar_url: populated.user_id.avatar_url,
        like_count: 0,
        user_liked: 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Gönderi paylaşılamadı.' });
  }
});

// DELETE /api/social/posts/:id — kendi gönderisini sil
router.delete('/posts/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı.' });
    if (post.user_id.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Bu gönderiyi silemezsiniz.' });

    await PostLike.deleteMany({ post_id: post._id });
    await Post.findByIdAndDelete(post._id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Gönderi silinemedi.' });
  }
});

// POST /api/social/posts/:id/like — beğeni toggle
router.post('/posts/:id/like', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı.' });

    const existing = await PostLike.findOne({ user_id: req.user._id, post_id: post._id });

    if (existing) {
      await PostLike.findByIdAndDelete(existing._id);
    } else {
      await PostLike.create({ user_id: req.user._id, post_id: post._id });
    }

    const likeCount = await PostLike.countDocuments({ post_id: post._id });
    res.json({ ok: true, liked: !existing, like_count: likeCount });
  } catch (err) {
    res.status(500).json({ error: 'Beğenme işlemi başarısız.' });
  }
});

// GET /api/social/posts/:id/likes — beğenileri listele
router.get('/posts/:id/likes', optionalAuth, async (req, res) => {
  try {
    const likes = await PostLike.find({ post_id: req.params.id })
      .populate('user_id', 'username avatar_url')
      .sort({ created_at: -1 });

    const formattedLikes = likes.map(l => ({
      id: l.user_id ? l.user_id._id : null,
      username: l.user_id ? l.user_id.username : 'Bilinmiyor',
      avatar_url: l.user_id ? l.user_id.avatar_url : null,
      created_at: l.created_at
    })).filter(l => l.id);

    res.json({ likes: formattedLikes, count: formattedLikes.length });
  } catch (err) {
    res.status(500).json({ error: 'Beğeniler alınamadı.' });
  }
});

// GET /api/social/trending — en çok paylaşılan içerikler
router.get('/trending', optionalAuth, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  try {
    const trending = await Post.aggregate([
      { $match: { content_key: { $ne: null } } },
      { $group: {
          _id: '$content_key',
          content_type: { $first: '$content_type' },
          content_title: { $first: '$content_title' },
          content_poster: { $first: '$content_poster' },
          post_count: { $sum: 1 }
      }},
      { $sort: { post_count: -1 } },
      { $limit: limit },
      { $project: {
          _id: 0,
          content_key: '$_id',
          content_type: 1,
          content_title: 1,
          content_poster: 1,
          post_count: 1
      }}
    ]);

    res.json({ trending });
  } catch (err) {
    res.status(500).json({ error: 'Trendler alınamadı.' });
  }
});

// GET /api/social/active-users — son zamanlarda aktif kullanıcılar
router.get('/active-users', optionalAuth, async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  try {
    const activeUsersAgg = await Post.aggregate([
      { $group: {
          _id: '$user_id',
          last_active: { $max: '$created_at' }
      }},
      { $sort: { last_active: -1 } },
      { $limit: limit }
    ]);

    const users = [];
    for (const u of activeUsersAgg) {
      const userDoc = await User.findById(u._id).select('username avatar_url');
      if (userDoc) {
        users.push({
          id: userDoc._id,
          username: userDoc.username,
          avatar_url: userDoc.avatar_url,
          last_active: u.last_active
        });
      }
    }

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Aktif kullanıcılar alınamadı.' });
  }
});

module.exports = router;
