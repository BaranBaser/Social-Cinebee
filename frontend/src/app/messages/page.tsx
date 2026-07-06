'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getSocket, ensureSocket } from '@/lib/socket';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Conversation {
  id: string;
  username: string;
  avatar_url: string | null;
  last_message: string;
  unread: number;
}

interface Message {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
}

function MessagesContent() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUser, setActiveUser] = useState<{ id: string; username: string; avatar_url?: string | null } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState<{ id: string; username: string; avatar_url: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeUser) return;
    const onDm = (msg: Message) => {
      if (msg.sender_id === activeUser.id || msg.sender_id === user?.id) {
        setMessages(prev => [...prev, msg]);
      }
      loadConversations();
    };
    socket.on('dm:message', onDm);
    return () => { socket.off('dm:message', onDm); };
  }, [activeUser, user]);

  async function loadConversations() {
    try {
      const { data } = await api.get('/chat/dm');
      setConversations(data.conversations || []);
    } catch {} finally { setLoading(false); }
  }

  async function openDm(u: { id: string; username: string; avatar_url?: string | null }) {
    setActiveUser(u);
    setUserQuery('');
    setUserResults([]);
    setShowSearch(false);
    try {
      const { data } = await api.get(`/chat/dm/${u.id}`);
      setMessages(data.messages || []);
    } catch { setMessages([]); }
  }

  async function searchUsers(q: string) {
    setUserQuery(q);
    if (!q.trim()) { setUserResults([]); return; }
    try {
      const { data } = await api.get(`/auth/users?q=${encodeURIComponent(q)}`);
      setUserResults(data.users || []);
    } catch { setUserResults([]); }
  }

  function send() {
    const text = draft.trim();
    if (!text || !activeUser || !user) return;
    const token = localStorage.getItem('cinemaai_token');
    if (!token) return;
    const socket = ensureSocket(token);
    socket.emit('dm:send', { toUserId: activeUser.id, body: text });
    setMessages(prev => [...prev, { id: Date.now().toString(), body: text, created_at: new Date().toISOString(), sender_id: user.id }]);
    setDraft('');
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr + 'Z').toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="px-6 py-6 h-[calc(100vh-56px)]">
      <div className="flex h-full gap-0 bg-surface rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl shadow-black/20">
        {/* Left: Conversations */}
        <div className="w-80 shrink-0 border-r border-white/[0.06] flex flex-col bg-surface">
          {/* Header */}
          <div className="px-4 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Mesajlar</h2>
              <button onClick={() => setShowSearch(!showSearch)}
                className="w-8 h-8 rounded-xl bg-honey/10 flex items-center justify-center text-honey hover:bg-honey/20 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </button>
            </div>
            {showSearch && (
              <div className="relative">
                <input
                  autoFocus
                  value={userQuery}
                  onChange={(e) => searchUsers(e.target.value)}
                  placeholder="Kişi ara..."
                  className="w-full px-3 py-2 bg-ink rounded-xl text-sm outline-none text-white placeholder-gray-600 border border-white/[0.06] focus:border-honey/40 transition-colors"
                />
                {userQuery && userResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-ink border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-10 max-h-48 overflow-y-auto">
                    {userResults.map(u => (
                      <button key={u.id} onClick={() => openDm(u)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] text-left transition-colors border-b border-white/[0.04] last:border-0">
                        <div className="w-8 h-8 rounded-full bg-honey/15 flex items-center justify-center text-xs font-bold text-honey overflow-hidden shrink-0">
                          {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.username[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-white">{u.username}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-3 space-y-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 rounded-full animate-shimmer bg-surface2 shrink-0" />
                    <div className="flex-1"><div className="h-3 rounded animate-shimmer bg-surface2 w-1/2 mb-2" /><div className="h-2.5 rounded animate-shimmer bg-surface2 w-3/4" /></div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>
                </div>
                <p className="text-sm text-muted text-center">Henüz konuşmanız yok</p>
                <p className="text-xs text-gray-600 text-center mt-1">Yukarıdaki + butonuyla başlayın</p>
              </div>
            ) : (
              conversations.map(c => (
                <button key={c.id} onClick={() => openDm(c)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-white/[0.04] ${
                    activeUser?.id === c.id ? 'bg-honey/5 border-l-2 border-l-honey' : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                  }`}>
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-ink border border-white/[0.06] flex items-center justify-center text-sm font-semibold text-white overflow-hidden">
                      {c.avatar_url ? <img src={c.avatar_url} alt="" className="w-full h-full object-cover" /> : c.username[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold truncate ${c.unread > 0 ? 'text-white' : 'text-gray-300'}`}>{c.username}</p>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${c.unread > 0 ? 'text-gray-400' : 'text-gray-600'}`}>{c.last_message}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-honey text-ink text-[10px] font-bold rounded-full shrink-0">{c.unread}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Chat */}
        <div className="flex-1 flex flex-col bg-ink/30">
          {!activeUser ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-surface border border-white/[0.06] flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>
              </div>
              <p className="text-base font-semibold text-gray-400 mb-1">Mesajlaşmaya Başla</p>
              <p className="text-sm text-gray-600 text-center max-w-xs">Sol taraftan bir konuşma seçin veya yeni bir kişi arayın</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-3 bg-surface/50 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-full bg-honey/15 flex items-center justify-center text-sm font-bold text-honey overflow-hidden shrink-0">
                  {activeUser.avatar_url ? <img src={activeUser.avatar_url} alt="" className="w-full h-full object-cover" /> : activeUser.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{activeUser.username}</p>
                  <p className="text-[11px] text-gray-600">Çevrimiçi</p>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-600">Mesaj geçmişiniz burada görünecek</p>
                  </div>
                )}
                {messages.map((m, i) => {
                  const isMine = m.sender_id === user?.id;
                  const showTail = i === 0 || messages[i - 1]?.sender_id !== m.sender_id;
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-3' : 'mt-0.5'}`}>
                      <div className={`max-w-[70%] px-3.5 py-2 text-sm leading-relaxed ${
                        isMine
                          ? `bg-honey text-ink rounded-2xl ${showTail ? 'rounded-br-md' : 'rounded-2xl'}`
                          : `bg-surface text-white border border-white/[0.06] rounded-2xl ${showTail ? 'rounded-bl-md' : 'rounded-2xl'}`
                      }`}>
                        {m.body}
                        <div className={`text-[10px] mt-1 ${isMine ? 'text-ink/50' : 'text-gray-600'}`}>{formatTime(m.created_at)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/[0.06] bg-surface/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                    placeholder="Mesaj yaz..."
                    className="flex-1 px-4 py-2.5 bg-ink border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-honey/40 transition-colors"
                  />
                  <button onClick={send} disabled={!draft.trim()}
                    className="w-10 h-10 bg-honey hover:bg-honey-light text-ink rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-honey/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return <ProtectedRoute><MessagesContent /></ProtectedRoute>;
}
