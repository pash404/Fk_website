async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  const html = await response.text();
  
  let name = '', sellingPrice = 0, mrp = 0, images = [];
  
  // Strategy 1: JSON-LD
  const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      const items = parsed['@graph'] || [parsed];
      for (const item of items) {
        if (item['@type'] === 'Product' || item['@type'] === 'product') {
          name = item.name || name;
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            sellingPrice = parseFloat(offers.price) || sellingPrice;
            if (offers.priceSpecification) {
              mrp = parseFloat(offers.priceSpecification.price) || mrp;
            }
          }
          if (item.image) {
            const imgs = Array.isArray(item.image) ? item.image : [item.image];
            for (const img of imgs) {
              if (img && !images.includes(img)) images.push(img);
            }
          }
        }
      }
    } catch {}
  }
  
  // Strategy 2: og:image
  const ogImageRegex = /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/gi;
  let ogMatch;
  while ((ogMatch = ogImageRegex.exec(html)) !== null) {
    const u = ogMatch[1];
    if (u && !images.includes(u)) images.push(u);
  }
  
  // Strategy 3: Generic HTML patterns for name/price
  if (!name) {
    const titleMatch = html.match(/<span[^>]*class="[^"]*(?:B_NuCI|VU-ZEz)[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (titleMatch) name = titleMatch[1].trim();
  }
  if (!name) {
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1Match && h1Match[1].trim().length > 5) name = h1Match[1].trim();
  }
  if (!sellingPrice) {
    const priceSpan = html.match(/₹\s*([0-9,]+\.?\d*)/);
    if (priceSpan) sellingPrice = parseFloat(priceSpan[1].replace(/,/g, ''));
  }
  
  // Strategy 4: gallery regex (FIXED)
  if (images.length < 2) {
    const galleryRegex = /"https?:\/\/[^"]*flixcart[^"]*\/image\/[^"]*\/[A-Za-z0-9-]+\.(jpeg|jpg|webp)"/gi;
    let gMatch;
    while ((gMatch = galleryRegex.exec(html)) !== null) {
      const u = gMatch[0].replace(/^"/, '').replace(/"$/, '');
      if (u && !images.includes(u)) images.push(u);
      if (images.length >= 5) break;
    }
  }
  
  console.log('Name:', name || '(not found)');
  console.log('Selling Price:', sellingPrice || '(not found)');
  console.log('MRP:', mrp || '(not found)');
  console.log('Images (' + images.length + '):');
  images.forEach((u, i) => console.log('  [' + i + ']', u.substring(0, 130)));
}
main().catch(e => console.log('Error:', e.message));
