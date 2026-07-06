'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket) socket.disconnect();
  const url = process.env.NEXT_PUBLIC_API_URL || '';
  socket = io(url, {
    auth: { token },
    path: url ? undefined : '/socket.io',
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });
  socket.on('connect_error', (err) => {
    console.error('[Socket] connect_error:', err.message);
  });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function ensureSocket(token: string): Socket {
  if (socket && socket.connected) return socket;
  return connectSocket(token);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
