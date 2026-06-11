const DEFAULT_API_URL = 'https://api.scraperapi.com';
const CACHE_TTL = 300_000;

const pageCache = new Map();

function getConfig() {
  return {
    apiKey: process.env.SCRAPING_API_KEY || '',
    apiUrl: process.env.SCRAPING_API_URL || DEFAULT_API_URL,
    renderJs: process.env.SCRAPING_RENDER_JS !== 'false',
  };
}

export function isScraperConfigured() {
  const { apiKey } = getConfig();
  return !!apiKey;
}

function getFromCache(url) {
  const cached = pageCache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.html;
  pageCache.delete(url);
  return null;
}

function setCache(url, html) {
  pageCache.set(url, { html, ts: Date.now() });
  if (pageCache.size > 100) {
    const first = pageCache.keys().next().value;
    pageCache.delete(first);
  }
}

async function fetchDirect(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(15000),
  });
  return response.text();
}

async function fetchViaScraper(url) {
  const { apiKey, apiUrl, renderJs } = getConfig();
  const params = new URLSearchParams({
    api_key: apiKey,
    url: url,
    render: renderJs ? 'true' : 'false',
    keep_headers: 'true',
    country_code: 'in',
  });

  const response = await fetch(`${apiUrl}?${params}`, {
    signal: AbortSignal.timeout(45000),
  });

  if (!response.ok) throw new Error(`Scraper API error: ${response.status}`);
  return response.text();
}

export async function fetchRenderedPage(url) {
  const cached = getFromCache(url);
  if (cached) return cached;

  const { apiKey } = getConfig();

  if (!apiKey) {
    const html = await fetchDirect(url);
    setCache(url, html);
    return html;
  }

  try {
    const html = await fetchViaScraper(url);
    setCache(url, html);
    return html;
  } catch (err) {
    const html = await fetchDirect(url);
    setCache(url, html);
    return html;
  }
}
