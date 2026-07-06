'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = '/';
    } catch (err: any) {
              setError(err?.response?.data?.error || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-16 relative mb-2">
            <Image src="/full_logo.png" alt="Cinebee" fill className="object-contain" />
          </div>
          <p className="text-muted text-sm mt-1">Topluluğuna tekrar hoş geldin</p>
        </div>

        <form onSubmit={submit} className="bg-surface border border-white/5 rounded-lg p-6 flex flex-col gap-4">
          {error && (
            <div className="text-sm text-velvet bg-velvet/10 border border-velvet/30 rounded-md px-3 py-2">
              {error}
            </div>
          )}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface2 rounded-md px-3 py-2 text-sm text-cream outline-none focus:ring-1 focus:ring-marquee"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-marquee hover:bg-marquee2 text-ink font-semibold rounded-md py-2.5 text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-marquee hover:underline">Kayıt ol</Link>
        </p>
      </div>
    </div>
  );
}
