const fetch = require('node-fetch');
const { ContentCache } = require('./db');

const TMDB = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_BG = 'https://image.tmdb.org/t/p/w1280';
const JIKAN = 'https://api.jikan.moe/v4';

function tmH() {
  const k = process.env.TMDB_API_KEY;
  if (!k) return {};
  return k.startsWith('eyJ') ? { Authorization: `Bearer ${k}` } : {};
}
function tmQ() {
  const k = process.env.TMDB_API_KEY;
  if (!k || k.startsWith('eyJ')) return '';
  return `api_key=${k}&`;
}

let synced = 0;
function save(k,t,ti,ot,ov,po,ba,ra,ye,du,ge,st,sn,ep,mi,tm,so,ca) {
  return ContentCache.updateOne(
    { content_key: k },
    { $setOnInsert: {
        type: t, title: ti, original_title: ot || ti, overview: ov || '',
        poster: po || null, backdrop: ba || null, rating: ra || 0, year: ye || '',
        duration: du || null, genres: ge || '', status: st || '',
        number_of_seasons: sn || null, number_of_episodes: ep || null,
        mal_id: mi || null, tmdb_id: tm || null, source: so, category: ca, synced_at: new Date()
      }
    },
    { upsert: true }
  ).then((res) => { if (res.upsertedCount > 0) synced++; }).catch(() => {});
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ═══════════════════════════════════════════
// TMDB - Doğru endpoint'lerle
// ═══════════════════════════════════════════

// /movie/popular, /movie/top_rated, /movie/now_playing, /movie/upcoming, /trending/movie/week
async function tmdbList(path, type, cat, maxPages) {
  let total = 0;
  for (let p = 1; p <= maxPages; p++) {
    try {
      const r = await fetch(`${TMDB}/${path}?${tmQ()}page=${p}`, { headers: tmH(), timeout: 12000 });
      if (r.status === 429) { await sleep(4000); p--; continue; }
      if (!r.ok) break;
      const d = await r.json();
      const items = d.results || [];
      if (items.length === 0) break;
      const promises = [];
      for (const i of items) {
        const key = `${type}-${i.id}-${cat}`;
        const title = i.title || i.name || '';
        const orig = i.original_title || i.original_name || title;
        const year = (i.release_date || i.first_air_date || '').slice(0, 4);
        promises.push(save(key, type, title, orig, i.overview || '',
          i.poster_path ? TMDB_IMG + i.poster_path : null,
          i.backdrop_path ? TMDB_BG + i.backdrop_path : null,
          i.vote_average || 0, year, i.runtime || null,
          '', i.status || '', i.number_of_seasons || null,
          i.number_of_episodes || null, null, i.id, 'tmdb', cat));
        total++;
      }
      await Promise.all(promises);
      if (p % 5 === 0) console.log(`    ${path} p${p}: ${total}`);
      await sleep(250);
    } catch (e) { await sleep(1000); }
  }
  return total;
}

// /discover/movie?sort_by=...&vote_count.gte=...
async function tmdbDiscover(params, type, cat, maxPages) {
  let total = 0;
  for (let p = 1; p <= maxPages; p++) {
    try {
      const r = await fetch(`${TMDB}/discover/${type}?${tmQ()}${params}page=${p}`, { headers: tmH(), timeout: 12000 });
      if (r.status === 429) { await sleep(4000); p--; continue; }
      if (!r.ok) break;
      const d = await r.json();
      const items = d.results || [];
      if (items.length === 0) break;
      const promises = [];
      for (const i of items) {
        const key = `${type}-${i.id}-${cat}`;
        const title = i.title || i.name || '';
        const orig = i.original_title || i.original_name || title;
        const year = (i.release_date || i.first_air_date || '').slice(0, 4);
        promises.push(save(key, type, title, orig, i.overview || '',
          i.poster_path ? TMDB_IMG + i.poster_path : null,
          i.backdrop_path ? TMDB_BG + i.backdrop_path : null,
          i.vote_average || 0, year, i.runtime || null,
          '', i.status || '', i.number_of_seasons || null,
          i.number_of_episodes || null, null, i.id, 'tmdb', cat));
        total++;
      }
      await Promise.all(promises);
      if (p % 5 === 0) console.log(`    discover/${type} p${p}: ${total}`);
      await sleep(250);
    } catch (e) { await sleep(1000); }
  }
  return total;
}

async function syncAll() {
  const t0 = Date.now();
  synced = 0;
  console.log('\n🚀 CINEMA-AI SENKRONİZASYON BAŞLADI\n');

  // Eski cache'i temizlemiyoruz, çünkü upsert kullanıyoruz.

  // ═══════════════════════════════════
  // FİLMLER
  // ═══════════════════════════════════
  console.log('🎬 FİLMLER...');

  console.log('  Popüler filmler...');
  const mPop = await tmdbList('movie/popular', 'movie', 'popular', 50);

  console.log('  Trend filmler (haftalık trend)...');
  const mTrend = await tmdbList('trending/movie/week', 'movie', 'trending', 20);

  console.log('  Yeni çıkan filmler...');
  const mNew = await tmdbList('movie/upcoming', 'movie', 'new', 15);

  console.log('  En çok izlenen filmler...');
  const mWatched = await tmdbDiscover('sort_by=popularity.desc&vote_count.gte=5000&', 'movie', 'most_watched', 30);

  console.log('  En yüksek puanlı filmler...');
  const mRated = await tmdbDiscover('sort_by=vote_average.desc&vote_count.gte=1000&vote_average.gte=7&', 'movie', 'top_rated', 30);

  console.log(`  ✅ Film: pop=${mPop} trend=${mTrend} yeni=${mNew} izlenen=${mWatched} puanlı=${mRated}`);

  // ═══════════════════════════════════
  // DİZİLER
  // ═══════════════════════════════════
  console.log('📺 DİZİLER...');

  console.log('  Popüler diziler...');
  const tPop = await tmdbList('tv/popular', 'tv', 'popular', 50);

  console.log('  Trend diziler (haftalık trend)...');
  const tTrend = await tmdbList('trending/tv/week', 'tv', 'trending', 20);

  console.log('  Yeni çıkan diziler...');
  const tNew = await tmdbList('tv/on_the_air', 'tv', 'new', 15);

  console.log('  En çok izlenen diziler...');
  const tWatched = await tmdbDiscover('sort_by=popularity.desc&vote_count.gte=2000&', 'tv', 'most_watched', 30);

  console.log('  En yüksek puanlı diziler...');
  const tRated = await tmdbDiscover('sort_by=vote_average.desc&vote_count.gte=500&vote_average.gte=7&', 'tv', 'top_rated', 30);

  console.log(`  ✅ Dizi: pop=${tPop} trend=${tTrend} yeni=${tNew} izlenen=${tWatched} puanlı=${tRated}`);

  // ═══════════════════════════════════
  // ANİME
  // ═══════════════════════════════════
  console.log('🎌 ANİME...');

  async function jikanFetch(endpoint, params, cat, maxP) {
    let total = 0;
    let retries = 0;
    for (let p = 1; p <= maxP; p++) {
      try {
        const r = await fetch(`${JIKAN}/${endpoint}?page=${p}&limit=25&${params}`);
        if (r.status === 429) { await sleep(5000); continue; }
        if (r.status === 504 || r.status === 503) {
          retries++;
          if (retries > 5) { console.log(`    ${endpoint} p${p}: cok hata, atliyor`); break; }
          await sleep(8000); continue;
        }
        if (!r.ok) break;
        retries = 0;
        const d = await r.json();
        const items = d.data || [];
        if (items.length === 0) break;
        const promises = [];
        for (const a of items) {
          const key = `anime-${a.mal_id}-${cat}`;
          const title = a.title_english || a.title || '';
          const year = a.year ? String(a.year) : (a.aired?.from ? a.aired.from.slice(0,4) : '');
          promises.push(save(key, 'anime', title, a.title||title, a.synopsis||'',
            a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || null, null,
            a.score||0, year, a.episodes||null,
            (a.genres||[]).map(g=>g.name).join(', '), a.status||'',
            null, a.episodes||null, a.mal_id, null, 'jikan', cat));
          total++;
        }
        await Promise.all(promises);
        await sleep(1200);
      } catch (e) { await sleep(3000); }
    }
    return total;
  }

  console.log('  Popüler anime (tüm zamanlar)...');
  const aPop = await jikanFetch('top/anime', 'filter=bypopularity', 'popular', 50);

  console.log('  Trend anime (şimdi yayınlanıyor)...');
  const aTrend = await jikanFetch('seasons/now', 'filter=tv', 'trending', 15);

  console.log('  Yakında gelecek anime...');
  const aNew = await jikanFetch('seasons/upcoming', 'filter=tv', 'new', 10);

  console.log('  En çok izlenen anime (şu an yayınta)...');
  const aWatched = await jikanFetch('top/anime', 'filter=airing&order_by=members&sort=desc', 'most_watched', 20);

  console.log('  En yüksek puanlı anime...');
  const aRated = await jikanFetch('top/anime', '', 'top_rated', 30);

  console.log(`  ✅ Anime: pop=${aPop} puanlı=${aRated} trend=${aTrend} yeni=${aNew} izlenen=${aWatched}`);

  // ═══════════════════════════════════
  // SONUÇ
  // ═══════════════════════════════════
  const c = await ContentCache.countDocuments();
  const m = await ContentCache.countDocuments({ type: 'movie' });
  const tv = await ContentCache.countDocuments({ type: 'tv' });
  const an = await ContentCache.countDocuments({ type: 'anime' });
  const el = ((Date.now()-t0)/1000).toFixed(0);

  console.log(`\n╔════════════════════════════════════════════╗`);
  console.log(`║  📊 TAMAM! (${Math.floor(el/60)}dk ${el%60}s)                    ║`);
  console.log(`║  🎬 Film:    ${String(m).padStart(5)}                       ║`);
  console.log(`║  📺 Dizi:    ${String(tv).padStart(5)}                       ║`);
  console.log(`║  🎌 Anime:   ${String(an).padStart(5)}                       ║`);
  console.log(`║  📦 Toplam:  ${String(c).padStart(5)}                       ║`);
  console.log(`╚════════════════════════════════════════════╝\n`);
}

let interval = null;
function startAutoSync(ms = 6*60*60*1000) {
  setTimeout(syncAll, 2000);
  interval = setInterval(syncAll, ms);
  console.log(`Otomatik sync: her ${ms/3600000} saatte`);
}
function stopAutoSync() { if(interval) clearInterval(interval); }

module.exports = { syncAll, startAutoSync, stopAutoSync };
