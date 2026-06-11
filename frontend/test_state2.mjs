async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?pid=ACCGWHFFGZYXGZHY';
  
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  const html = await resp.text();
  
  // Find the beginning of __INITIAL_STATE__
  const startMarker = 'window.__INITIAL_STATE__=';
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    console.log('No __INITIAL_STATE__');
    return;
  }
  
  const jsonStart = startIdx + startMarker.length;
  // Find the matching closing brace by counting
  let depth = 0;
  let endIdx = jsonStart;
  let inString = false;
  let escape = false;
  
  for (let i = jsonStart; i < Math.min(jsonStart + 400000, html.length); i++) {
    const ch = html[i];
    
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"' && !escape) { inString = !inString; continue; }
    
    if (!inString) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  
  const jsonStr = html.substring(jsonStart, endIdx);
  console.log('Extracted JSON length:', jsonStr.length);
  
  try {
    const state = JSON.parse(jsonStr);
    console.log('Top keys:', Object.keys(state).join(', ').substring(0, 200));
    
    // Search for product images
    const imgUrls = [];
    function search(obj, path) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => search(item, path + '[' + i + ']'));
        return;
      }
      const keys = Object.keys(obj);
      for (const key of keys) {
        const val = obj[key];
        if (typeof val === 'string' && val.includes('image/flipkart')) {
          imgUrls.push({ path: path + '.' + key, url: val.substring(0, 150) });
        }
        if (typeof val === 'string' && val.includes('/image/') && (val.includes('ukminim') || val.includes('flixcart')) && !val.includes('static')) {
          imgUrls.push({ path: path + '.' + key, url: val.substring(0, 200) });
        }
        if (typeof val === 'object') {
          search(val, path + '.' + key);
        }
        // Check key name for image hints
        if (typeof val === 'string' && (key.includes('image') || key.includes('Image')) && val.startsWith('http')) {
          imgUrls.push({ path: path + '.' + key, url: val.substring(0, 200) });
        }
      }
    }
    search(state, 'root');
    console.log(`\nFound ${imgUrls.length} image URLs:`);
    imgUrls.forEach(({path, url}, i) => console.log(`  [${i}] ${path}: ${url}`));
    
  } catch(e) {
    console.log('Parse error at position', e.message.substring(0, 50));
    // Try to find the issue
    const errMatch = e.message.match(/position (\d+)/);
    if (errMatch) {
      const pos = parseInt(errMatch[1]);
      console.log('Context around error:', jsonStr.substring(Math.max(0, pos - 50), Math.min(jsonStr.length, pos + 50)));
    }
  }
}
main().catch(e => console.log('Error:', e.message));
