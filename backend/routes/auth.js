const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function publicUser(u) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    bio: u.bio,
    avatar_url: u.avatar_url,
    role: u.role,
    created_at: u.created_at,
  };
}

router.post('/register', (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı, e-posta ve şifre gerekli.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı.' });
  }
  const usernameClean = String(username).trim();
  const emailClean = String(email).trim().toLowerCase();

  const exists = db
    .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
    .get(emailClean, usernameClean);
  if (exists) {
    return res.status(409).json({ error: 'Bu kullanıcı adı veya e-posta zaten kayıtlı.' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)')
    .run(usernameClean, emailClean, hash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'E-posta ve şifre gerekli.' });

  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(String(email).trim().toLowerCase());
  if (!user) return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
  if (user.is_banned) return res.status(403).json({ error: 'Hesabınız askıya alınmış.' });

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.put('/me', requireAuth, (req, res) => {
  const { bio, avatar_url } = req.body || {};
  db.prepare('UPDATE users SET bio = ?, avatar_url = ? WHERE id = ?').run(
    bio ?? req.user.bio,
    avatar_url ?? req.user.avatar_url,
    req.user.id
  );
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ user: publicUser(user) });
});

// Sohbet için kullanıcı arama/listeleme
router.get('/users', requireAuth, (req, res) => {
  const q = (req.query.q || '').toString().trim();
  let rows;
  if (q) {
    rows = db
      .prepare(
        `SELECT id, username, avatar_url FROM users WHERE username LIKE ? AND id != ? AND is_banned = 0 LIMIT 20`
      )
      .all(`%${q}%`, req.user.id);
  } else {
    rows = db
      .prepare(
        `SELECT id, username, avatar_url FROM users WHERE id != ? AND is_banned = 0 ORDER BY created_at DESC LIMIT 20`
      )
      .all(req.user.id);
  }
  res.json({ users: rows });
});

module.exports = router;
