const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Library } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function publicUser(u) {
  return {
    id: u._id,
    username: u.username,
    email: u.email,
    bio: u.bio,
    avatar_url: u.avatar_url,
    role: u.role,
    created_at: u.created_at,
  };
}

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı, e-posta ve şifre gerekli.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı.' });
  }
  const usernameClean = String(username).trim();
  const emailClean = String(email).trim().toLowerCase();

  try {
    const exists = await User.findOne({
      $or: [{ email: emailClean }, { username: usernameClean }]
    });
    if (exists) {
      return res.status(409).json({ error: 'Bu kullanıcı adı veya e-posta zaten kayıtlı.' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const user = await User.create({
      username: usernameClean,
      email: emailClean,
      password_hash: hash
    });

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kayıt olurken bir hata oluştu.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'E-posta ve şifre gerekli.' });

  try {
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
    if (user.is_banned) return res.status(403).json({ error: 'Hesabınız askıya alınmış.' });

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Giriş yaparken bir hata oluştu.' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.put('/me', requireAuth, async (req, res) => {
  const { bio, avatar_url } = req.body || {};
  try {
    req.user.bio = bio ?? req.user.bio;
    req.user.avatar_url = avatar_url ?? req.user.avatar_url;
    await req.user.save();
    
    res.json({ user: publicUser(req.user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profil güncellenemedi.' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', requireAuth, async (req, res) => {
  const { current_password, new_password } = req.body || {};
  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Mevcut ve yeni şifre gerekli.' });
  }
  if (String(new_password).length < 6) {
    return res.status(400).json({ error: 'Yeni şifre en az 6 karakter olmalı.' });
  }
  try {
    const ok = bcrypt.compareSync(current_password, req.user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Mevcut şifre hatalı.' });
    req.user.password_hash = bcrypt.hashSync(new_password, 10);
    await req.user.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Şifre değiştirilemedi.' });
  }
});

// Sohbet için kullanıcı arama/listeleme
router.get('/users', requireAuth, async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  try {
    let query = { _id: { $ne: req.user._id }, is_banned: false };
    if (q) {
      query.username = new RegExp(q, 'i');
    }
    
    const users = await User.find(query)
      .select('_id username avatar_url')
      .sort({ created_at: -1 })
      .limit(20);

    const mappedUsers = users.map(u => ({
      id: u._id,
      username: u.username,
      avatar_url: u.avatar_url
    }));

    res.json({ users: mappedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kullanıcılar alınamadı.' });
  }
});

// Public profile
router.get('/users/:id', async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select('_id username bio avatar_url role created_at friends friend_requests');
    if (!u) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    const watchedItems = await Library.find({ user_id: u._id, status: 'watched' })
      .sort({ created_at: -1 })
      .limit(20)
      .select('content_title content_poster content_type content_key created_at');

    const totalWatched = await Library.countDocuments({ user_id: u._id, status: 'watched' });

    res.json({
      user: {
        id: u._id,
        username: u.username,
        bio: u.bio,
        avatar_url: u.avatar_url,
        role: u.role,
        created_at: u.created_at,
        friend_count: u.friends.length,
      },
      watched: {
        items: watchedItems.map(i => ({
          title: i.content_title,
          poster: i.content_poster,
          type: i.content_type,
          key: i.content_key,
          added_at: i.created_at
        })),
        total: totalWatched
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profil alınamadı.' });
  }
});

module.exports = router;
