import { requireRole } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';
import { fetchRenderedPage, isScraperConfigured } from '@/lib/scraper-client';

const MAX_IMAGES = 5;

function extractProductId(url) {
  const match = url.match(/\/p\/([a-z0-9]+)/i);
  return match ? match[1] : null;
}

function extractSearchTerms(url) {
  try {
    const path = new URL(url).pathname;
    const slug = path.replace(/^\/+/, '').split('/')[0];
    return slug.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).substring(0, 100);
  } catch {
    return '';
  }
}

async function fetchPage(url) {
  return fetchRenderedPage(url);
}

function extractJsonLdData(html) {
  const result = { name: '', sellingPrice: 0, mrp: 0, images: [] };
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      const items = parsed['@graph'] || [parsed];
      for (const item of items) {
        if (item && item.name && item.image) {
          result.name = item.name || result.name;
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            result.sellingPrice = parseFloat(offers.price) || result.sellingPrice;
            if (offers.priceSpecification) {
              result.mrp = parseFloat(offers.priceSpecification.price) || result.mrp;
            }
          }
          const imgs = Array.isArray(item.image) ? item.image : [item.image];
          for (const img of imgs) {
            if (img && !result.images.includes(img)) result.images.push(img);
          }
        }
      }
    } catch {}
  }
  return result;
}

function extractOgData(html) {
  const result = { name: '', images: [] };
  const ogTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
  if (ogTitle) result.name = ogTitle[1].trim();
  const ogImageRegex = /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/gi;
  let match;
  while ((match = ogImageRegex.exec(html)) !== null) {
    if (match[1] && !result.images.includes(match[1])) result.images.push(match[1]);
  }
  return result;
}

const KNOWN_BRANDS = [
  'motorola', 'samsung', 'apple', 'oneplus', 'realme', 'xiaomi', 'redmi',
  'boat', 'boult', 'noise', 'ptron', 'zebronics', 'portronics', 'ambrane',
  'mivi', 'gizmore', 'truke', 'airdopes', 'firebolt', 'sony', 'bose', 'jbl',
  'philips', 'lg', 'panasonic', 'lenovo', 'hp', 'dell', 'acer', 'asus',
  'oppo', 'vivo', 'nokia', 'google', 'pixel', 'mi', 'honor', 'huawei',
  'nothing', 'cmf', 'dell', 'rolex', 'titan', 'fastrack', 'fossil',
  'casio', 'noise', 'fire', 'echo', 'alexa', 'amazon', 'zeb',
];

function normalizeImageUrl(url) {
  return url.replace(/\/image\/\d+\/\d+\//, '/image/');
}

function extractBrand(slug) {
  const parts = slug.split(/[- ]+/);
  return parts[0]?.toLowerCase() || '';
}

function isCompetitorBrand(url, brand) {
  const urlLower = url.toLowerCase();
  for (const b of KNOWN_BRANDS) {
    if (b !== brand && new RegExp(`\\b${b}\\b`).test(urlLower)) return true;
  }
  return false;
}

function isProductImage(url) {
  return /https?:\/\/(?:rukminim?[12]?)\.flixcart\.com\/image\//i.test(url) &&
    !url.includes('logo') && !url.includes('splash') &&
    !url.includes('app-icon') && !url.includes('batman') &&
    !url.includes('attributeglossary') && !url.includes('fk-lite') &&
    !url.includes('pixel') && !url.includes('favicon') && !url.includes('promos') &&
    !url.includes('/www/') && !url.includes('{@') && !url.includes('q={@');
}

function extractRenderedImages(html, productSlug) {
  const images = [];
  const regex = /https?:\/\/[^"'\s>)]*?\.(?:jpeg|jpg|webp|png)(?:\?[^\s"')>]*)?/gi;
  const matches = html.match(regex);
  if (!matches) return images;

  const unique = [...new Set(matches.map(u => normalizeImageUrl(u.split('?')[0])))];
  const productImages = unique.filter(isProductImage);

  if (productImages.length === 0) return images;

  if (productSlug) {
    const brand = extractBrand(productSlug);
    const keys = productSlug.split(/[- ]+/).filter(k => k.length > 3);

    const scored = productImages.map(url => {
      let score = keys.reduce((s, k) => s + (url.toLowerCase().includes(k) ? 1 : 0), 0);
      if (brand && url.toLowerCase().includes(brand)) score += 3;
      if (isCompetitorBrand(url, brand)) score -= 10;
      return { url, score };
    });

    scored.sort((a, b) => b.score - a.score);

    for (const { url, score } of scored) {
      if (score < 1 || (brand && score < 2)) continue;
      if (!images.includes(url)) images.push(url);
      if (images.length >= MAX_IMAGES) break;
    }
  }

  if (images.length === 0) {
    for (const url of productImages) {
      if (!images.includes(url)) images.push(url);
      if (images.length >= MAX_IMAGES) break;
    }
  }

  return images;
}

function extractSearchImages(html, productKeywords) {
  const images = [];
  const regex = /https?:\/\/[^"'\s>]*?flixcart[^"'\s>]*?\.(?:jpeg|jpg|webp)/gi;
  const matches = html.match(regex);
  if (matches) {
    const unique = [...new Set(matches.map(u => normalizeImageUrl(u.split('?')[0])))];
    const productImages = unique.filter(isProductImage);

    if (productKeywords && productImages.length > 0) {
      const brand = extractBrand(productKeywords);
      const keys = productKeywords.split(/[- ]+/).filter(k => k.length > 3);

      const scored = productImages.map(url => {
        let score = keys.reduce((s, k) => s + (url.toLowerCase().includes(k) ? 1 : 0), 0);
        if (brand && url.toLowerCase().includes(brand)) score += 3;
        if (isCompetitorBrand(url, brand)) score -= 10;
        return { url, score };
      });

      scored.sort((a, b) => b.score - a.score);

      for (const { url, score } of scored) {
        if (score < 1 || (brand && score < 2)) continue;
        if (url && !images.includes(url)) images.push(url);
        if (images.length >= MAX_IMAGES) break;
      }
    }

    if (images.length === 0) {
      for (const url of productImages) {
        if (!images.includes(url)) images.push(url);
        if (images.length >= MAX_IMAGES) break;
      }
    }
  }
  return images;
}

export async function POST(request) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);
  const body = await parseBody(request);
  if (!body?.url) return error('URL is required');

  try {
    const productUrl = body.url;
    const productId = extractProductId(productUrl);
    const slug = productUrl.match(/\/([^/]+)\/p\//)?.[1] || '';
    const hasApi = isScraperConfigured();

    const fetchUrl = productId && !productUrl.includes('pid=')
      ? productUrl + (productUrl.includes('?') ? '&' : '?') + 'pid=' + productId
      : productUrl;

    const html = await fetchPage(fetchUrl);
    let name = '', sellingPrice = 0, mrp = 0;
    let images = [];

    // Strategy 1: JSON-LD from rendered page (populated by JS)
    const jsonLd = extractJsonLdData(html);
    if (jsonLd.name) {
      name = jsonLd.name;
      sellingPrice = jsonLd.sellingPrice;
      mrp = jsonLd.mrp;
      images = jsonLd.images.slice(0, MAX_IMAGES);
    }

    // Strategy 2: Open Graph from rendered page
    if (!name || images.length === 0) {
      const og = extractOgData(html);
      if (!name && og.name) name = og.name;
      if (images.length === 0) {
        images = og.images.slice(0, MAX_IMAGES);
      } else {
        for (const img of og.images) {
          if (!images.includes(img)) images.push(img);
          if (images.length >= MAX_IMAGES) break;
        }
      }
    }

    // Strategy 3: Extract from rendered <img> tags (JS-loaded gallery)
    if (images.length < MAX_IMAGES && hasApi) {
      const renderedImages = extractRenderedImages(html, slug ? decodeURIComponent(slug) : '');
      for (const img of renderedImages) {
        if (!images.includes(img)) images.push(img);
        if (images.length >= MAX_IMAGES) break;
      }
    }

    // Fallback name extraction
    if (!name) {
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      if (h1Match && h1Match[1].trim().length > 5) name = h1Match[1].trim();
    }
    if (!name) {
      const titleTag = html.match(/<title>([^<]+)<\/title>/i);
      if (titleTag) name = titleTag[1].trim();
    }

    // Fallback price extraction
    if (!sellingPrice) {
      const priceSpan = html.match(/₹\s*([0-9,]+\.?\d*)/);
      if (priceSpan) sellingPrice = parseFloat(priceSpan[1].replace(/,/g, ''));
    }
    if (!mrp && sellingPrice) {
      const mrpSpan = html.match(/(?:₹\s*([0-9,]+\.?\d*))[^<]*(?:MRP|strike)/i);
      if (mrpSpan) mrp = parseFloat(mrpSpan[1].replace(/,/g, ''));
    }

    // Strategy 4: Search fallback for extra images
    if (images.length < MAX_IMAGES) {
      const searchTerms = slug ? decodeURIComponent(slug).replace(/[_-]/g, ' ') : extractSearchTerms(productUrl);
      if (searchTerms) {
        const terms = searchTerms.split(' ').slice(0, 5).join(' ');
        const searchHtml = await fetchPage(`https://www.flipkart.com/search?q=${encodeURIComponent(terms)}`);
        const searchImages = extractSearchImages(searchHtml, slug ? decodeURIComponent(slug) : '');
        for (const img of searchImages) {
          if (!images.includes(img)) images.push(img);
          if (images.length >= MAX_IMAGES) break;
        }
      }
    }

    if (!name && images.length === 0) {
      const msg = hasApi
        ? 'Could not parse product data. Check your SCRAPING_API_KEY in .env.local'
        : 'Could not parse product data. Set SCRAPING_API_KEY in .env.local for better results (get a free key at https://www.scraperapi.com)';
      return error(msg);
    }

    return success({ name, sellingPrice, mrp, images });
  } catch (err) {
    return error(`Failed to fetch product data: ${err.message}`);
  }
}
