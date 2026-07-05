const express = require('express');
const fetch = require('node-fetch');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function geminiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'buraya_gemini_api_anahtariniz') return null;
  return key;
}

router.post('/recommend', requireAuth, async (req, res) => {
  const { prompt, watchedKeys } = req.body || {};
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Bir açıklama gerekli.' });
  }

  const key = geminiKey();
  if (!key) {
    return res.status(500).json({ error: 'GEMINI_API_KEY tanımlı değil. .env dosyanızı kontrol edin.' });
  }

  const watchedList = (watchedKeys || []).join(', ');

  const systemPrompt = `Sen CinemaAI'nin Keşif Asistanısın. Kullanıcı film, dizi veya anime önerileri istiyor.
Türkçe yanıt ver. Kullanıcıya özel, detaylı ve kişisel öneriler sun.
SADECE JSON döndür, başka hiçbir metin yazma. Markdown kullanma, kod blogu kullanma.
JSON formatı:
{"message":"Kullanıcıya kısa giriş","suggestions":[{"title":"İçerik adı","year":"Yıl","type":"movie veya tv veya anime","rating":"Puan","reason":"Neden önerdiğin","genres":"Tür listesi"}]}
3-5 öneri sun. "reason" alanı kişisel ve ikna edici olsun.
Kullanıcı daha önce izlediklerini göz önünde bulundur, aynı içerikleri önerme.`;

  const userMessage = `İstek: ${prompt}${watchedList ? `\nDaha önce izlediklerim: ${watchedList}` : ''}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error('Gemini API hatası:', errData);
      return res.status(500).json({ error: 'AI servisine ulaşılamadı.' });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsed;
    try {
      let cleaned = content;
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        cleaned = codeBlockMatch[1].trim();
      }
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { message: content, suggestions: [] };
    } catch (e) {
      parsed = { message: content, suggestions: [] };
    }

    res.json(parsed);
  } catch (e) {
    console.error('AI önerisi hatası:', e);
    res.status(500).json({ error: 'Öneri oluşturulurken bir hata oluştu.' });
  }
});

module.exports = router;
