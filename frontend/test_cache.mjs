async function main() {
  // Try Google cache
  const cacheUrl = 'https://webcache.googleusercontent.com/search?q=cache:https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  
  console.log('Trying Google cache...');
  try {
    const resp = await fetch(cacheUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
    });
    const html = await resp.text();
    console.log('Cache HTML length:', html.length);
    
    // Look for images
    const imgRegex = /https?:\/\/[^"'\s>]*?ukminim[^"'\s>]*?flixcart[^"'\s>]*?\/image\/[^"'\s>]*?(?:jpe?g|webp|png)/gi;
    const imgs = html.match(imgRegex);
    console.log('Product images found:', imgs ? imgs.length : 0);
    if (imgs) {
      const unique = [...new Set(imgs.map(u => u.split('?')[0]))];
      console.log('Unique:', unique.length);
      // Filter to only product images (not static-assets)
      const productImgs = unique.filter(u => !u.includes('static-assets'));
      console.log('Product images (non-static):', productImgs.length);
      productImgs.slice(0, 10).forEach((u, i) => console.log(`  [${i}] ${u}`));
    }
    
    // Check for JSON-LD in cache
    const jl = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    if (jl) {
      console.log('JSON-LD found');
      try {
        const parsed = JSON.parse(jl[1]);
        const items = parsed['@graph'] || [parsed];
        for (const item of items) {
          if (item['@type'] === 'Product' && item.image) {
            console.log('Product images in JSON-LD:', Array.isArray(item.image) ? item.image.length : 'single');
            if (Array.isArray(item.image)) {
              item.image.forEach((u, i) => console.log(`  [${i}] ${u}`));
            }
          }
        }
      } catch(e) { console.log('Parse error:', e.message); }
    } else {
      console.log('No JSON-LD');
    }
  } catch(e) {
    console.log('Error:', e.message);
  }
}
main().catch(e => console.log('Error:', e.message));
