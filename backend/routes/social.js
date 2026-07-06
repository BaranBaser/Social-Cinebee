const express = require('express');
const { Post, PostLike, PostComment, PostVote, User } = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { createNotification } = require('./notifications');

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
      createNotification({
        user_id: post.user_id,
        from_user_id: req.user._id,
        type: 'like',
        title: 'Gönderin beğenildi',
        body: `${req.user.username} gönderini beğendi`,
        link: '/community',
      });
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

// GET /api/social/active-users — gercek zamanli aktif kullanicilar (socket baglantisi olanlar)
router.get('/active-users', optionalAuth, async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  try {
    const { onlineUsers } = require('../socket');
    const onlineIds = [...onlineUsers.keys()];

    if (onlineIds.length === 0) return res.json({ users: [] });

    const users = await User.find({ _id: { $in: onlineIds } })
      .select('username avatar_url last_active')
      .limit(limit)
      .lean();

    res.json({ users: users.map(u => ({ id: u._id, username: u.username, avatar_url: u.avatar_url, last_active: u.last_active })) });
  } catch (err) {
    res.status(500).json({ error: 'Aktif kullanicilar alinamadi.' });
  }
});

// ── ARKADAŞLIK SİSTEMİ ──

// GET /api/social/friends — arkadaş listesi
router.get('/friends', requireAuth, async (req, res) => {
  try {
    const me = await User.findById(req.user._id).populate('friends', 'username avatar_url bio');
    const friends = (me.friends || []).map(f => ({
      id: f._id,
      username: f.username,
      avatar_url: f.avatar_url,
      bio: f.bio || '',
    }));
    res.json({ friends });
  } catch (err) {
    res.status(500).json({ error: 'Arkadaş listesi alınamadı.' });
  }
});

// GET /api/social/search?q=... — kullanıcı ara
router.get('/search', requireAuth, async (req, res) => {
  const q = req.query.q;
  if (!q || q.length < 2) return res.json({ users: [] });
  try {
    const me = await User.findById(req.user._id);
    const query = {
      username: { $regex: q, $options: 'i' },
      _id: { $ne: req.user._id }
    };
    if (me.role !== 'admin') {
      query.role = { $ne: 'admin' };
    }
    const users = await User.find(query).select('username avatar_url bio').limit(10);

    const results = users.map(u => {
      let relationship = 'none';
      if (me.friends && me.friends.includes(u._id)) relationship = 'friends';
      else {
        const outReq = (me.friend_requests || []).find(r => r.to.toString() === u._id.toString() && r.status === 'pending');
        if (outReq) relationship = 'pending_sent';
        else {
          const inReq = (me.friend_requests || []).find(r => r.from.toString() === u._id.toString() && r.status === 'pending');
          if (inReq) relationship = 'pending_received';
        }
      }
      return { id: u._id, username: u.username, avatar_url: u.avatar_url, bio: u.bio || '', relationship };
    });

    res.json({ users: results });
  } catch (err) {
    console.error('User search error:', err);
    res.status(500).json({ error: 'Kullanıcılar aranamadı.' });
  }
});

// GET /api/social/friends/requests — bekleyen arkadaşlık istekleri
router.get('/friends/requests', requireAuth, async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const incoming = (me.friend_requests || []).filter(r => r.to.toString() === req.user._id.toString() && r.status === 'pending');
    const result = [];
    for (const r of incoming) {
      const u = await User.findById(r.from).select('username avatar_url bio');
      if (u) result.push({ id: r._id, from: { id: u._id, username: u.username, avatar_url: u.avatar_url, bio: u.bio }, created_at: r.created_at });
    }
    res.json({ requests: result });
  } catch (err) {
    res.status(500).json({ error: 'İstekler alınamadı.' });
  }
});

// POST /api/social/friends/request — arkadaşlık isteği gönder
router.post('/friends/request', requireAuth, async (req, res) => {
  const { user_id } = req.body || {};
  if (!user_id) return res.status(400).json({ error: 'user_id gerekli.' });
  if (user_id === req.user._id.toString()) return res.status(400).json({ error: 'Kendine arkadaşlık isteği gönderemezsin.' });

  try {
    const target = await User.findById(user_id);
    if (!target) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    if (target.friends.includes(req.user._id)) {
      return res.status(409).json({ error: 'Bu kullanıcı zaten arkadaşın.' });
    }

    const existing = (target.friend_requests || []).find(
      r => r.from.toString() === req.user._id.toString() && r.to.toString() === user_id && r.status === 'pending'
    );
    if (existing) return res.status(409).json({ error: 'İstek zaten gönderildi.' });

    target.friend_requests.push({ from: req.user._id, to: user_id, status: 'pending' });
    await target.save();

    createNotification({
      user_id: user_id,
      from_user_id: req.user._id,
      type: 'friend_request',
      title: 'Yeni arkadaşlık isteği',
      body: `${req.user.username} seninle arkadaş olmak istiyor`,
      link: '/community',
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'İstek gönderilemedi.' });
  }
});

// POST /api/social/friends/accept/:requestId — isteği kabul et
router.post('/friends/accept/:requestId', requireAuth, async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const reqDoc = me.friend_requests.id(req.params.requestId);
    if (!reqDoc || reqDoc.to.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'İstek bulunamadı.' });
    }
    reqDoc.status = 'accepted';
    me.friends.push(reqDoc.from);
    await me.save();

    const sender = await User.findById(reqDoc.from);
    if (sender) {
      sender.friends.push(req.user._id);
      const senderReq = sender.friend_requests.find(
        r => r.from.toString() === req.user._id.toString() && r.status === 'pending'
      );
      if (senderReq) senderReq.status = 'accepted';
      await sender.save();

      createNotification({
        user_id: reqDoc.from,
        from_user_id: req.user._id,
        type: 'friend_accept',
        title: 'Arkadaşlık isteği kabul edildi',
        body: `${req.user.username} arkadaşlık isteğini kabul etti`,
        link: '/community',
      });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'İstek kabul edilemedi.' });
  }
});

// POST /api/social/friends/reject/:requestId — isteği reddet
router.post('/friends/reject/:requestId', requireAuth, async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const reqDoc = me.friend_requests.id(req.params.requestId);
    if (!reqDoc || reqDoc.to.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'İstek bulunamadı.' });
    }
    reqDoc.status = 'rejected';
    await me.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'İstek reddedilemedi.' });
  }
});

// DELETE /api/social/friends/:userId — arkadaşı kaldır
router.delete('/friends/:userId', requireAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { friends: req.params.userId } });
    await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.user._id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Arkadaş kaldırılamadı.' });
  }
});

// ── GÖNDERİ YORUMLARI ──

// GET /api/social/posts/:id/comments
router.get('/posts/:id/comments', optionalAuth, async (req, res) => {
  try {
    const comments = await PostComment.find({ post_id: req.params.id })
      .populate('user_id', 'username avatar_url')
      .sort({ created_at: 1 });

    res.json({
      comments: comments.map(c => ({
        id: c._id,
        body: c.body,
        created_at: c.created_at,
        user: c.user_id ? { id: c.user_id._id, username: c.user_id.username, avatar_url: c.user_id.avatar_url } : null,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Yorumlar alınamadı.' });
  }
});

// POST /api/social/posts/:id/comments
router.post('/posts/:id/comments', requireAuth, async (req, res) => {
  const { body } = req.body || {};
  if (!body || !body.trim()) return res.status(400).json({ error: 'Yorum metni gerekli.' });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı.' });

    const comment = await PostComment.create({
      post_id: req.params.id,
      user_id: req.user._id,
      body: body.trim(),
    });

    createNotification({
      user_id: post.user_id,
      from_user_id: req.user._id,
      type: 'comment',
      title: 'Gönderine yorum yapıldı',
      body: `${req.user.username}: "${body.trim().slice(0, 80)}"`,
      link: '/community',
    });

    const populated = await PostComment.findById(comment._id).populate('user_id', 'username avatar_url');
    res.json({
      comment: {
        id: populated._id,
        body: populated.body,
        created_at: populated.created_at,
        user: populated.user_id ? { id: populated.user_id._id, username: populated.user_id.username, avatar_url: populated.user_id.avatar_url } : null,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Yorum gönderilemedi.' });
  }
});

// ── GÖNDERİ OYLAMA (UPVOTE / DOWNVOTE) ──

// POST /api/social/posts/:id/vote { value: 1 | -1 }
router.post('/posts/:id/vote', requireAuth, async (req, res) => {
  const { value } = req.body || {};
  if (value !== 1 && value !== -1) return res.status(400).json({ error: 'Value 1 veya -1 olmalı.' });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı.' });

    const existing = await PostVote.findOne({ user_id: req.user._id, post_id: post._id });

    if (existing) {
      if (existing.value === value) {
        await PostVote.findByIdAndDelete(existing._id);
      } else {
        existing.value = value;
        await existing.save();
      }
    } else {
      await PostVote.create({ user_id: req.user._id, post_id: post._id, value });
    }

    const votes = await PostVote.aggregate([
      { $match: { post_id: post._id } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);
    const score = votes[0]?.total || 0;

    const userVote = await PostVote.findOne({ user_id: req.user._id, post_id: post._id });
    res.json({ ok: true, score, user_vote: userVote ? userVote.value : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Oylama başarısız.' });
  }
});

// GET /api/social/posts/:id/vote — kullanıcının oyunu
router.get('/posts/:id/vote', requireAuth, async (req, res) => {
  try {
    const vote = await PostVote.findOne({ user_id: req.user._id, post_id: req.params.id });
    const votes = await PostVote.aggregate([
      { $match: { post_id: require('mongoose').Types.ObjectId.createFromHexString(req.params.id) } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);
    res.json({ score: votes[0]?.total || 0, user_vote: vote ? vote.value : 0 });
  } catch (err) {
    res.json({ score: 0, user_vote: 0 });
  }
});

module.exports = router;
