'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Film } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      router.push('/');
    } catch (err: any) {
              setError(err?.response?.data?.error || 'Kayıt oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-md bg-velvet flex items-center justify-center mb-3">
            <Film size={24} className="text-cream" />
          </div>
          <h1 className="font-display text-4xl tracking-wide text-cream">
            CINEMA<span className="text-marquee">AI</span>
          </h1>
          <p className="text-muted text-sm mt-1">Topluluğa katıl, izle, tartış</p>
        </div>

        <form onSubmit={submit} className="bg-surface border border-white/5 rounded-lg p-6 flex flex-col gap-4">
          {error && (
            <div className="text-sm text-velvet bg-velvet/10 border border-velvet/30 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs text-muted block mb-1">Kullanıcı adı</label>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface2 rounded-md px-3 py-2 text-sm text-cream outline-none focus:ring-1 focus:ring-marquee"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface2 rounded-md px-3 py-2 text-sm text-cream outline-none focus:ring-1 focus:ring-marquee"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Şifre</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface2 rounded-md px-3 py-2 text-sm text-cream outline-none focus:ring-1 focus:ring-marquee"
            />
            <p className="text-[11px] text-muted mt-1">En az 6 karakter</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-marquee hover:bg-marquee2 text-ink font-semibold rounded-md py-2.5 text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Oluşturuluyor...' : 'Kayıt ol'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Zaten hesabın var mı?{' '}
          <Link href="/login" className="text-marquee hover:underline">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}
