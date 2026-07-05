const jwt = require('jsonwebtoken');
const db = require('../db');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Giriş yapmanız gerekiyor.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
    if (user.is_banned) return res.status(403).json({ error: 'Hesabınız askıya alınmış.' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Oturum geçersiz veya süresi dolmuş.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Bu işlem için yönetici yetkisi gerekiyor.' });
  }
  next();
}

// Token varsa kullanıcıyı ekler, yoksa sessizce devam eder (herkese açık uçlar için)
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id);
    if (user && !user.is_banned) req.user = user;
  } catch (e) {}
  next();
}

module.exports = { requireAuth, requireAdmin, optionalAuth };
