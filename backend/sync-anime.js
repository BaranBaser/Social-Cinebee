require('dotenv').config();
const fetch = require('node-fetch');
const { ContentCache } = require('./db');

const JIKAN = 'https://api.jikan.moe/v4';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function jikanFetch(endpoint, params, cat, maxP) {
  let total = 0;
  let retries = 0;
  for (let p = 1; p <= maxP; p++) {
    try {
      const r = await fetch(`${JIKAN}/${endpoint}?page=${p}&limit=25&${params}`);
      if (r.status === 429) { await sleep(6000); p--; continue; }
      if (r.status === 504 || r.status === 503) {
        retries++;
        if (retries > 3) { console.log(`  skipped after 3 retries`); break; }
        await sleep(10000); p--; continue;
      }
      if (!r.ok) { console.log(`  HTTP ${r.status}`); break; }
      retries = 0;
      const d = await r.json();
      const items = d.data || [];
      if (items.length === 0) break;
      const ops = [];
      for (const a of items) {
        const key = `anime-${a.mal_id}-${cat}`;
        const title = a.title_english || a.title || '';
        const year = a.year ? String(a.year) : (a.aired?.from ? a.aired.from.slice(0,4) : '');
        ops.push({
          updateOne: {
            filter: { content_key: key },
            update: { $setOnInsert: {
              type: 'anime', title, original_title: a.title || title, overview: a.synopsis || '',
              poster: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || null,
              backdrop: null, rating: a.score || 0, year, duration: a.episodes || null,
              genres: (a.genres || []).map(g => g.name).join(', '), status: a.status || '',
              number_of_seasons: null, number_of_episodes: a.episodes || null,
              mal_id: a.mal_id, tmdb_id: null, source: 'jikan', category: cat, synced_at: new Date()
            }},
            upsert: true
          }
        });
      }
      await ContentCache.bulkWrite(ops, { ordered: false });
      total += items.length;
      console.log(`  p${p}: +${items.length} (total: ${total})`);
      await sleep(1500);
    } catch (e) { console.log(`  Error: ${e.message}`); await sleep(5000); }
  }
  return total;
}

async function main() {
  console.log('=== Anime: fill missing categories ===\n');

  console.log('1. trending (order_by=start_date, sort=desc)...');
  const t = await jikanFetch('top/anime', 'order_by=start_date&sort=desc', 'trending', 5);
  console.log(`   trending: ${t}\n`);

  console.log('2. most_watched (order_by=members, sort=desc)...');
  const w = await jikanFetch('top/anime', 'order_by=members&sort=desc', 'most_watched', 10);
  console.log(`   most_watched: ${w}\n`);

  console.log('=== DONE ===');
  process.exit(0);
}

main();
