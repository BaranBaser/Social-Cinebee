const { ALL_CONTENT } = require('./contentList');

function getTrendingFallback(type = 'movie', filter = 'popular', page = 1, limit = 20) {
  let typeItems = ALL_CONTENT.filter(item => type === 'all' || item.type === type);
  let filtered = typeItems.filter(item => item.categories && item.categories.includes(filter));
  if (filtered.length === 0) {
    filtered = typeItems;
  }
  const offset = (page - 1) * limit;
  return {
    results: filtered.slice(offset, offset + limit),
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
    source: 'fallback'
  };
}

module.exports = { FALLBACK_CONTENT: ALL_CONTENT, getTrendingFallback };
