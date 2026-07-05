'use client';

import { useState, useEffect } from 'react';
import { Send, ExternalLink, Bookmark, Check } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const SUGGESTION_CHIPS = [
  'Yalnızlık temalı, karanlık ve atmosferik bir bilim kurgu',
  'Hafta sonu için eğlenceli, eğlenceli bir komedi dizisi',
  'Beni şaşırtacak bir psikolojik gerilim filmi',
  "90'lar nostaljisi taşıyan bir anime",
];

interface AISuggestion {
  title: string;
  year: string;
  type: string;
  rating: string;
  reason: string;
  genres: string;
}

interface AIResponse {
  message: string;
  suggestions: AISuggestion[];
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [watchedKeys, setWatchedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      api.get('/library', { params: { status: 'watched' } })
        .then((r) => setWatchedKeys((r.data.items || []).map((i: any) => i.content_key)))
        .catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (customPrompt?: string) => {
    const text = customPrompt || prompt;
    if (!text.trim()) return;
    if (!user) {
      setError('AI Asistanı için giriş yapmanız gerekiyor.');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const { data } = await api.post('/ai/recommend', { prompt: text, watchedKeys });
      setResponse(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'AI servisine ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
        <span className="text-honey text-[11px] font-mono uppercase tracking-[0.2em]">AI</span>
      </div>

      <h1 className="text-5xl md:text-6xl text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        Keşif Asistanı
      </h1>
      <p className="text-gray-400 text-sm max-w-xl mb-8">
        Ruh halinizi anlatın, size özel öneriler sunalım. İzlediğiniz yapımlar otomatik olarak hafızada tutulur.
      </p>

      <div className="bg-surface border border-white/[0.06] rounded-2xl p-5 mb-5">
        <div className="flex gap-3 items-end">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Yalnızlık temalı, karanlık ve atmosferik bir bilim kurgu"
            rows={3}
            className="flex-1 bg-ink rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-honey/50 resize-none placeholder:text-gray-600 border border-white/[0.04]"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !prompt.trim()}
            className="bg-honey hover:bg-honey-light text-ink px-5 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0 font-medium text-sm shadow-lg shadow-honey/20"
          >
            <Send size={16} />
            {loading ? 'Aranıyor...' : 'Öneri AI'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {SUGGESTION_CHIPS.map((chip, i) => (
          <button
            key={i}
            onClick={() => { setPrompt(chip); handleSubmit(chip); }}
            className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-full text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-5 py-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-16 justify-center">
          <div className="w-5 h-5 border-2 border-honey border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">AI önerileri hazırlanıyor...</span>
        </div>
      )}

      {response && (
        <div>
          {response.message && (
            <div className="bg-honey/5 border-l-4 border-honey rounded-r-2xl px-5 py-4 mb-6">
              <p className="text-sm text-white/90 italic">{response.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {response.suggestions?.map((s, i) => (
              <div key={i} className="bg-surface border border-white/[0.06] rounded-2xl p-5 flex gap-5 hover:border-white/15 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-white">{s.title}</h3>
                    <span className="text-xs text-gray-500">{s.year}</span>
                    <span className="text-[10px] uppercase tracking-wider bg-white/10 text-gray-300 px-2 py-0.5 rounded-md font-mono">
                      {s.type === 'movie' ? 'MOVIE' : s.type === 'tv' ? 'TV' : 'ANIME'}
                    </span>
                    {s.rating && (
                      <span className="text-xs text-honey font-semibold">⭐ {s.rating}</span>
                    )}
                  </div>
                  {s.genres && <p className="text-xs text-gray-500 mb-2">{s.genres}</p>}
                  <div className="mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-honey font-bold">BUNU NEDEN ÖNERİYORUM</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{s.reason}</p>
                  <Link
                    href={`/?q=${encodeURIComponent(s.title)}`}
                    className="inline-flex items-center gap-1 text-xs text-honey hover:underline mt-3"
                  >
                    Detayı gör <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!response && !loading && !error && (
        <div className="text-center py-20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 mx-auto mb-4">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          </svg>
          <p className="text-gray-500 text-sm">Ruh halinizi yazın, size özel öneriler alalım</p>
        </div>
      )}
    </div>
  );
}
