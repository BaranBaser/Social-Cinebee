const jwt = require('jsonwebtoken');
const db = require('./db');

// userId -> Set(socketId) eşlemesi, çevrimiçi durumu ve DM yönlendirmesi için
const onlineUsers = new Map();

function attachSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Kimlik doğrulama gerekli.'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id);
      if (!user || user.is_banned) return next(new Error('Yetkisiz.'));
      socket.user = { id: user.id, username: user.username, avatar_url: user.avatar_url };
      next();
    } catch (e) {
      next(new Error('Geçersiz oturum.'));
    }
  });

  io.on('connection', (socket) => {
    const uid = socket.user.id;
    if (!onlineUsers.has(uid)) onlineUsers.set(uid, new Set());
    onlineUsers.get(uid).add(socket.id);
    io.emit('presence:update', { onlineUserIds: [...onlineUsers.keys()] });

    socket.on('room:join', (roomId) => {
      socket.join(`room:${roomId}`);
    });

    socket.on('room:leave', (roomId) => {
      socket.leave(`room:${roomId}`);
    });

    socket.on('room:message', ({ roomId, body }) => {
      const text = (body || '').toString().trim().slice(0, 2000);
      if (!text || !roomId) return;
      const info = db
        .prepare('INSERT INTO room_messages (room_id, user_id, body) VALUES (?, ?, ?)')
        .run(roomId, uid, text);
      const row = db.prepare('SELECT * FROM room_messages WHERE id = ?').get(info.lastInsertRowid);
      io.to(`room:${roomId}`).emit('room:message', {
        id: row.id,
        roomId,
        body: row.body,
        created_at: row.created_at,
        user: socket.user,
      });
    });

    socket.on('dm:send', ({ toUserId, body }) => {
      const text = (body || '').toString().trim().slice(0, 2000);
      if (!text || !toUserId) return;
      const info = db
        .prepare('INSERT INTO dm_messages (sender_id, receiver_id, body) VALUES (?, ?, ?)')
        .run(uid, toUserId, text);
      const row = db.prepare('SELECT * FROM dm_messages WHERE id = ?').get(info.lastInsertRowid);
      const payload = {
        id: row.id,
        body: row.body,
        created_at: row.created_at,
        sender_id: uid,
        receiver_id: toUserId,
      };
      // Gönderene geri bildir
      socket.emit('dm:message', payload);
      // Karşı taraf çevrimiçiyse anlık gönder
      const targetSockets = onlineUsers.get(Number(toUserId));
      if (targetSockets) {
        targetSockets.forEach((sid) => io.to(sid).emit('dm:message', payload));
      }
    });

    socket.on('typing:room', ({ roomId }) => {
      socket.to(`room:${roomId}`).emit('typing:room', { userId: uid, username: socket.user.username });
    });

    socket.on('disconnect', () => {
      const set = onlineUsers.get(uid);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) onlineUsers.delete(uid);
      }
      io.emit('presence:update', { onlineUserIds: [...onlineUsers.keys()] });
    });
  });
}

module.exports = { attachSocket };
