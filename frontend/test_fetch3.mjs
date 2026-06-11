async function main() {
  // Try the Flipkart mobile site / AMP version
  const urls = [
    'https://m.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d',
  ];
  
  for (const url of urls) {
    console.log('=== Fetching:', url, '===');
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    const html = await resp.text();
    console.log('HTML length:', html.length);
    
    // Look for JSON-LD
    const jl = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    if (jl) {
      console.log('JSON-LD found, length:', jl[1].length);
      try {
        const parsed = JSON.parse(jl[1]);
        const items = parsed['@graph'] || [parsed];
        for (const item of items) {
          if (item['@type'] === 'Product' || item['@type'] === 'product') {
            console.log('name:', item.name);
            if (item.image) {
              console.log('image type:', typeof item.image);
              if (Array.isArray(item.image)) {
                console.log('image count:', item.image.length);
                item.image.forEach((u, i) => console.log('  [' + i + ']', u));
              } else {
                console.log('  image:', item.image.substring(0,120));
              }
            } else console.log('no image in JSON-LD');
          }
        }
      } catch(e) { console.log('JSON parse error:', e.message); }
    } else {
      console.log('No JSON-LD');
    }
    
    // Search for rukminim images in the HTML
    const imgRegex = /https?:\/\/[^"'\s>]*?ukminim[^"'\s>]*?flixcart[^"'\s>]*?\/image\/[^"'\s>]*?(?:jpeg|jpg|webp)/gi;
    const imgs = html.match(imgRegex);
    console.log('Product image URLs found:', imgs ? imgs.length : 0);
    if (imgs) {
      const unique = [...new Set(imgs.map(u => u.split('?')[0]))];
      console.log('Unique:', unique.length);
      unique.slice(0,8).forEach((u, i) => console.log('  [' + i + ']', u.substring(0,130)));
    }
    
    // Search for __NEXT_DATA__ or similar embedded JSON
    const nextData = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (nextData) {
      console.log('__NEXT_DATA__ found, length:', nextData[1].length);
      try {
        const nd = JSON.parse(nextData[1]);
        console.log('props keys:', Object.keys(nd.props || {}).join(', '));
      } catch(e) { console.log('parse error:', e.message); }
    }
    
    // Search for window.__INITIAL_STATE__ or similar
    const initState = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/i);
    if (initState) {
      console.log('__INITIAL_STATE__ found, length:', initState[1].length);
    } else {
      console.log('No __INITIAL_STATE__');
    }
  }
}
main().catch(e => console.log('Error:', e.message));
