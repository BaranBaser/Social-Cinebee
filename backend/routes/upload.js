const express = require('express');
const multer = require('multer');
const path = require('path');
const { User } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece PNG, JPG, GIF, WebP dosyalari yukleyebilirsiniz.'));
    }
  }
});

router.post('/avatar', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Dosya yuklenemedi.' });
  const fileUrl = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user._id, { avatar_url: fileUrl });
  res.json({ ok: true, url: fileUrl });
});

router.post('/banner', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Dosya yuklenemedi.' });
  const fileUrl = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user._id, { banner_url: fileUrl });
  res.json({ ok: true, url: fileUrl });
});

module.exports = router;
