const jwt = require('jsonwebtoken');
const { User, RoomMessage, DmMessage } = require('./db');

// userId -> Set(socketId) eşlemesi, çevrimiçi durumu ve DM yönlendirmesi için
const onlineUsers = new Map();

function attachSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Kimlik doğrulama gerekli.'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);
      if (!user || user.is_banned) return next(new Error('Yetkisiz.'));
      socket.user = { id: user._id.toString(), username: user.username, avatar_url: user.avatar_url };
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

    socket.on('room:message', async ({ roomId, body }) => {
      const text = (body || '').toString().trim().slice(0, 2000);
      if (!text || !roomId) return;
      try {
        const msg = await RoomMessage.create({
          room_id: roomId,
          user_id: uid,
          body: text
        });
        
        io.to(`room:${roomId}`).emit('room:message', {
          id: msg._id,
          roomId,
          body: msg.body,
          created_at: msg.created_at,
          user: socket.user,
        });
      } catch (err) {
        console.error('Room message error:', err);
      }
    });

    socket.on('dm:send', async ({ toUserId, body }) => {
      const text = (body || '').toString().trim().slice(0, 2000);
      if (!text || !toUserId) return;
      try {
        const msg = await DmMessage.create({
          sender_id: uid,
          receiver_id: toUserId,
          body: text
        });

        const payload = {
          id: msg._id,
          body: msg.body,
          created_at: msg.created_at,
          sender_id: uid,
          receiver_id: toUserId,
        };
        // Gönderene geri bildir
        socket.emit('dm:message', payload);
        // Karşı taraf çevrimiçiyse anlık gönder
        const targetSockets = onlineUsers.get(toUserId.toString());
        if (targetSockets) {
          targetSockets.forEach((sid) => io.to(sid).emit('dm:message', payload));
        }
      } catch (err) {
        console.error('DM error:', err);
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
