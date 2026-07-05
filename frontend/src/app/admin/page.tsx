'use client';

import { useEffect, useState } from 'react';
import { Users, MessageSquare, Star, Send, ShieldCheck, Ban, Trash2, Search } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AdminRoute } from '@/components/ProtectedRoute';

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="bg-surface border border-white/5 rounded-lg p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-md bg-velvet/20 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-marquee" />
      </div>
      <div>
        <p className="text-2xl font-display tracking-wide text-cream leading-none">{value ?? '—'}</p>
        <p className="text-xs text-muted mt-1">{label}</p>
      </div>
    </div>
  );
}

function AdminContent() {
  const { user: me } = useAuth();
  const [tab, setTab] = useState<'overview' | 'users' | 'comments'>('overview');
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  const loadStats = () => api.get('/admin/stats').then((r) => setStats(r.data));
  const loadUsers = (q = '') =>
    api.get('/admin/users', { params: q ? { q } : {} }).then((r) => setUsers(r.data.users));
  const loadComments = () => api.get('/admin/comments').then((r) => setComments(r.data.comments));

  useEffect(() => { loadStats(); }, []);

  useEffect(() => {
    if (tab === 'users') loadUsers(userQuery);
    if (tab === 'comments') loadComments();
  }, [tab]);

  const toggleBan = async (u: any) => {
    await api.put(`/admin/users/${u.id}`, { is_banned: u.is_banned ? 0 : 1 });
    loadUsers(userQuery);
  };

  const toggleRole = async (u: any) => {
    await api.put(`/admin/users/${u.id}`, { role: u.role === 'admin' ? 'user' : 'admin' });
    loadUsers(userQuery);
  };

  const removeUser = async (u: any) => {
    if (!confirm(`${u.username} kalıcı olarak silinsin mi?`)) return;
    await api.delete(`/admin/users/${u.id}`);
    loadUsers(userQuery);
  };

  const removeComment = async (id: number) => {
    await api.delete(`/admin/comments/${id}`);
    loadComments();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl tracking-wide text-cream mb-1">YÖNETİCİ PANELİ</h1>
      <p className="text-muted text-sm mb-6">Hoş geldin, {me?.username}. Topluluğu buradan yönet.</p>

      <div className="flex gap-2 mb-6 border-b border-white/10">
        {[
          { key: 'overview', label: 'Genel Bakış' },
          { key: 'users', label: 'Kullanıcılar' },
          { key: 'comments', label: 'Yorumlar' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'text-marquee border-marquee' : 'text-muted border-transparent hover:text-cream'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Toplam kullanıcı" value={stats.users} />
          <StatCard icon={Ban} label="Askıda olan" value={stats.bannedUsers} />
          <StatCard icon={MessageSquare} label="Yorum sayısı" value={stats.comments} />
          <StatCard icon={Star} label="Puan sayısı" value={stats.ratings} />
          <StatCard icon={Send} label="Toplam mesaj" value={stats.messages} />
        </div>
      )}

      {tab === 'users' && (
        <div>
          <div className="flex items-center gap-2 bg-surface rounded-md px-3 py-2 mb-4 max-w-sm">
            <Search size={14} className="text-muted" />
            <input
              value={userQuery}
              onChange={(e) => { setUserQuery(e.target.value); loadUsers(e.target.value); }}
              placeholder="Kullanıcı adı veya e-posta ara..."
              className="bg-transparent text-sm outline-none flex-1 text-cream placeholder:text-muted"
            />
          </div>
          <div className="bg-surface border border-white/5 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="px-4 py-3 font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 font-medium">E-posta</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-cream">{u.username}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={u.role === 'admin' ? 'text-marquee' : 'text-muted'}>
                        {u.role === 'admin' ? 'Yönetici' : 'Üye'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.is_banned ? <span className="text-velvet">Askıda</span> : <span className="text-green-500">Aktif</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => toggleRole(u)} title="Yönetici yap/kaldır" className="p-1.5 rounded-md hover:bg-surface2 text-muted hover:text-marquee">
                          <ShieldCheck size={15} />
                        </button>
                        <button onClick={() => toggleBan(u)} title={u.is_banned ? 'Askıyı kaldır' : 'Askıya al'} className="p-1.5 rounded-md hover:bg-surface2 text-muted hover:text-yellow-500">
                          <Ban size={15} />
                        </button>
                        <button onClick={() => removeUser(u)} title="Sil" className="p-1.5 rounded-md hover:bg-surface2 text-muted hover:text-velvet">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'comments' && (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-surface border border-white/5 rounded-lg p-3.5 flex justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted mb-1">
                  <span className="text-cream font-medium">{c.username}</span> · {c.content_title || c.content_key} ·{' '}
                  {new Date(c.created_at).toLocaleString('tr-TR')}
                </p>
                <p className={`text-sm ${c.is_removed ? 'text-muted italic' : 'text-cream/90'}`}>{c.body}</p>
              </div>
              {!c.is_removed && (
                <button onClick={() => removeComment(c.id)} className="text-muted hover:text-velvet shrink-0" title="Kaldir">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminContent />
    </AdminRoute>
  );
}
