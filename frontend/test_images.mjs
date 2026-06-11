async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?pid=ACCGWHFFGZYXGZHY';
  
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  const html = await resp.text();
  
  const match = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*\n/);
  if (!match) { console.log('Not found'); return; }
  
  console.log('JSON length:', match[1].length);
  
  try {
    const state = JSON.parse(match[1]);
    
    // Find product-related data
    const mws = state.multiWidgetState;
    if (mws) {
      console.log('multiWidgetState keys:', Object.keys(mws).join(', ').substring(0, 300));
    }
    
    // Search deeply for image URLs
    let foundImages = [];
    function search(obj, path, depth = 0) {
      if (depth > 10) return;
      if (!obj || typeof obj !== 'object') return;
      
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => search(item, path + '[' + i + ']', depth));
        return;
      }
      
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        const fullPath = path + '.' + key;
        
        if (typeof val === 'string') {
          if ((val.includes('/image/') || val.includes('.jpeg') || val.includes('.jpg') || val.includes('.webp')) && 
              val.includes('flixcart') && !val.includes('static')) {
            foundImages.push({ url: val, path: fullPath });
          }
        }
        
        if (typeof val === 'object') {
          search(val, fullPath, depth + 1);
        }
      }
    }
    
    search(state, 'root');
    
    // Deduplicate by URL
    const unique = {};
    foundImages.forEach(({url, path}) => {
      const base = url.split('?')[0];
      if (!unique[base]) unique[base] = { url: base, path, firstPath: path };
    });
    
    console.log(`\nFound ${Object.keys(unique).length} unique product images:`);
    Object.values(unique).forEach(({url, firstPath}, i) => {
      console.log(`  [${i}] ${firstPath}`);
      console.log(`       ${url}`);
    });
    
  } catch(e) {
    console.log('Parse error:', e.message.substring(0, 100));
  }
}
main().catch(e => console.log('Error:', e.message));
