require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const commentsRoutes = require('./routes/comments');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const libraryRoutes = require('./routes/library');
const { attachSocket } = require('./socket');
const { startAutoSync } = require('./sync');

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET tanimli degil. .env dosyanizi kontrol edin.');
}

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/social', require('./routes/social'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/profile-comments', require('./routes/profile-comments'));
app.use('/api/upload', require('./routes/upload'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PUBLIC_DIR = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_DIR));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'), (err) => {
    if (err) res.status(404).send('Frontend henuz derlenmemis (npm run build calistirin).');
  });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
attachSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`CinemaAI Social sunucusu http://localhost:${PORT} adresinde calisiyor`);
  startAutoSync(6 * 60 * 60 * 1000);
});
