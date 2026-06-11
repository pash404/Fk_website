async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?pid=ACCGWHFFGZYXGZHY';
  
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  const html = await resp.text();
  
  // Extract __INITIAL_STATE__
  const initMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*\n/);
  if (initMatch) {
    console.log('__INITIAL_STATE__ length:', initMatch[1].length);
    try {
      const state = JSON.parse(initMatch[1]);
      console.log('Top-level keys:', Object.keys(state).join(', '));
      
      // Look for product data
      for (const key of Object.keys(state)) {
        const val = state[key];
        if (val && typeof val === 'object') {
          const subKeys = Object.keys(val);
          if (subKeys.some(k => k.toLowerCase().includes('product') || k.toLowerCase().includes('image'))) {
            console.log(`\nKey "${key}" has interesting sub-keys:`, subKeys.join(', '));
            console.log('Value preview:', JSON.stringify(val).substring(0, 400));
          }
        }
      }
      
      // Search deeply for image URLs
      const imgUrls = [];
      function findImages(obj, path) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
          obj.forEach((item, i) => findImages(item, path + '[' + i + ']'));
          return;
        }
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          if (typeof val === 'string' && val.includes('flixcart.com/image/') && !val.includes('static-assets')) {
            imgUrls.push({ path: path + '.' + key, url: val });
          }
          if (typeof val === 'object') {
            findImages(val, path + '.' + key);
          }
        }
      }
      findImages(state, 'root');
      console.log(`\nFound ${imgUrls.length} product image URLs in state:`);
      imgUrls.forEach(({path, url}, i) => console.log(`  [${i}] ${path}: ${url}`));
      
    } catch(e) { console.log('Parse error:', e.message); }
  } else {
    console.log('No __INITIAL_STATE__ found');
    // Try broader pattern
    const allMatches = html.match(/window\.__[A-Z_]+__\s*=/g);
    console.log('Other window.__ vars:', allMatches?.join(', ') || 'none');
  }
}
main().catch(e => console.log('Error:', e.message));
