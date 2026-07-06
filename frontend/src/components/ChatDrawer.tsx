'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Send, Hash, Search, Circle } from 'lucide-react';
import api from '@/lib/api';
import { getSocket, ensureSocket } from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: number;
  body: string;
  created_at: string;
  user?: { id: number; username: string; avatar_url: string };
  sender_id?: number;
  receiver_id?: number;
  roomId?: number;
}

interface Room {
  id: number;
  name: string;
  content_key: string | null;
}

interface Conversation {
  id: number;
  username: string;
  avatar_url: string;
  last_message: string;
  unread: number;
}

function MessageBubble({ mine, name, body, time }: { mine: boolean; name: string; body: string; time: string }) {
  return (
    <div className={`flex flex-col mb-3 ${mine ? 'items-end' : 'items-start'}`}>
      {!mine && <span className="text-[11px] text-marquee mb-0.5 px-1">{name}</span>}
      <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap break-words ${
        mine ? 'bg-velvet text-cream rounded-br-sm' : 'bg-surface2 text-cream rounded-bl-sm'
      }`}>
        {body}
      </div>
      <span className="text-[10px] text-muted mt-0.5 px-1">
        {new Date(time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}

export default function ChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<'rooms' | 'dm'>('rooms');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [roomMessages, setRoomMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeDmUser, setActiveDmUser] = useState<{ id: number; username: string } | null>(null);
  const [dmMessages, setDmMessages] = useState<Message[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState<{ id: number; username: string }[]>([]);
  const [onlineIds, setOnlineIds] = useState<number[]>([]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !user) return;
    api.get('/chat/rooms').then((r) => setRooms(r.data.rooms || [])).catch(() => {});
    api.get('/chat/dm').then((r) => setConversations(r.data.conversations || [])).catch(() => {});
  }, [open, user]);

  useEffect(() => {
    if (!open || !user) return;
    const socket = getSocket();
    if (!socket) return;

    const onRoomMsg = (msg: Message) => {
      setRoomMessages((prev) => {
        if (activeRoom && msg.roomId === activeRoom.id) {
          return [...prev, msg];
        }
        return prev;
      });
    };
    const onDmMsg = (msg: Message) => {
      setDmMessages((prev) => {
        if (activeDmUser && (msg.sender_id === activeDmUser.id || msg.receiver_id === activeDmUser.id)) {
          return [...prev, msg];
        }
        return prev;
      });
      api.get('/chat/dm').then((r) => setConversations(r.data.conversations || [])).catch(() => {});
    };
    const onPresence = (p: { onlineUserIds: number[] }) => setOnlineIds(p.onlineUserIds || []);

    socket.on('room:message', onRoomMsg);
    socket.on('dm:message', onDmMsg);
    socket.on('presence:update', onPresence);

    return () => {
      socket.off('room:message', onRoomMsg);
      socket.off('dm:message', onDmMsg);
      socket.off('presence:update', onPresence);
    };
  }, [open, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [roomMessages, dmMessages]);

  const openRoom = async (room: Room) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cinemaai_token') : null;
    if (!token) return;
    const socket = ensureSocket(token);
    if (activeRoom) socket.emit('room:leave', activeRoom.id);
    setActiveRoom(room);
    setActiveDmUser(null);
    socket.emit('room:join', room.id);
    try {
      const { data } = await api.get(`/chat/rooms/${room.id}/messages`);
      setRoomMessages(data.messages || []);
    } catch { setRoomMessages([]); }
  };

  const openDm = async (u: { id: number; username: string }) => {
    setActiveDmUser(u);
    setActiveRoom(null);
    try {
      const { data } = await api.get(`/chat/dm/${u.id}`);
      setDmMessages(data.messages || []);
    } catch { setDmMessages([]); }
  };

  const searchUsers = async (q: string) => {
    setUserQuery(q);
    const { data } = await api.get(`/auth/users${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    setUserResults(data.users);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('cinemaai_token') : null;
    if (!token) return;
    const socket = ensureSocket(token);
    if (activeRoom) {
      socket.emit('room:message', { roomId: activeRoom.id, body: text });
    } else if (activeDmUser) {
      socket.emit('dm:send', { toUserId: activeDmUser.id, body: text });
    }
    setDraft('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-ink border-l border-white/10 flex flex-col">
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/10 shrink-0">
          <span className="font-display text-xl tracking-wide">SOHBET</span>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-md">
            <X size={18} />
          </button>
        </div>

        {!activeRoom && !activeDmUser && (
          <>
            <div className="flex border-b border-white/10 shrink-0">
              <button
                className={`flex-1 py-2.5 text-sm font-medium ${tab === 'rooms' ? 'text-marquee border-b-2 border-marquee' : 'text-muted'}`}
                onClick={() => setTab('rooms')}
              >
                Odalar
              </button>
              <button
                className={`flex-1 py-2.5 text-sm font-medium ${tab === 'dm' ? 'text-marquee border-b-2 border-marquee' : 'text-muted'}`}
                onClick={() => { setTab('dm'); searchUsers(''); }}
              >
                Mesajlar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {tab === 'rooms' && rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => openRoom(r)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-surface text-left"
                >
                  <Hash size={16} className="text-marquee shrink-0" />
                  <span className="text-sm text-cream truncate">{r.name}</span>
                </button>
              ))}

              {tab === 'dm' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-surface rounded-md px-2.5 py-1.5">
                    <Search size={14} className="text-muted" />
                    <input
                      value={userQuery}
                      onChange={(e) => searchUsers(e.target.value)}
                      placeholder="Kullanıcı ara..."
                      className="bg-transparent text-sm outline-none flex-1 text-cream placeholder:text-muted"
                    />
                  </div>
                  {userQuery && (
                    <div className="flex flex-col">
                      {userResults.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => openDm(u)}
                          className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-surface text-left"
                        >
                          <div className="w-7 h-7 rounded-full bg-velvet flex items-center justify-center text-xs font-semibold shrink-0">
                            {u.username[0].toUpperCase()}
                          </div>
                          <span className="text-sm text-cream truncate">{u.username}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-white/10 mt-1 pt-1">
                    {conversations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openDm(c)}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-surface text-left"
                      >
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-full bg-velvet flex items-center justify-center text-xs font-semibold">
                            {c.username[0].toUpperCase()}
                          </div>
                          {onlineIds.includes(c.id) && (
                            <Circle size={9} className="absolute -bottom-0.5 -right-0.5 fill-green-500 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-cream truncate">{c.username}</p>
                          <p className="text-xs text-muted truncate">{c.last_message}</p>
                        </div>
                        {c.unread > 0 && (
                          <span className="text-[10px] bg-marquee text-ink rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                            {c.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {(activeRoom || activeDmUser) && (
          <>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 shrink-0">
              <button
                onClick={() => { setActiveRoom(null); setActiveDmUser(null); }}
                className="text-muted hover:text-cream text-sm"
              >
                ←
              </button>
              <span className="text-sm font-medium text-cream truncate">
                {activeRoom ? activeRoom.name : activeDmUser?.username}
              </span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
              {activeRoom && roomMessages.map((m) => (
                <MessageBubble
                  key={String(m.id)}
                  mine={m.user?.id === user?.id}
                  name={m.user?.username || ''}
                  body={m.body}
                  time={m.created_at}
                />
              ))}
              {activeDmUser && dmMessages.map((m) => (
                <MessageBubble
                  key={String(m.id)}
                  mine={m.sender_id === user?.id}
                  name={activeDmUser.username}
                  body={m.body}
                  time={m.created_at}
                />
              ))}
            </div>
            <div className="p-3 border-t border-white/10 flex gap-2 shrink-0">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Mesaj yaz..."
                className="flex-1 bg-surface rounded-md px-3 py-2 text-sm outline-none text-cream placeholder:text-muted"
              />
              <button
                onClick={send}
                className="bg-velvet hover:bg-velvet2 text-cream p-2 rounded-md transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
