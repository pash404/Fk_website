async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?pid=ACCGWHFFGZYXGZHY';
  
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  const html = await resp.text();
  
  // Find the exact INITIAL_STATE script
  const startMarker = 'window.__INITIAL_STATE__ = ';
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) { console.log('Not found'); return; }
  
  const jsonStart = startIdx + startMarker.length;
  
  // Find the matching closing brace
  let depth = 0;
  let inStr = false;
  let escaped = false;
  let endPos = jsonStart;
  
  for (let i = jsonStart; i < html.length; i++) {
    const ch = html[i];
    
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inStr) { escaped = true; continue; }
    if (ch === '"' && !escaped) { inStr = !inStr; continue; }
    
    if (!inStr) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
      if (depth === 0) { endPos = i + 1; break; }
    }
  }
  
  const jsonStr = html.substring(jsonStart, endPos);
  console.log('Extracted JSON length:', jsonStr.length);
  console.log('First 100:', jsonStr.substring(0, 100));
  
  try {
    const state = JSON.parse(jsonStr);
    
    // Find product data
    let productImages = [];
    
    function findImages(obj) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach(item => findImages(item));
        return;
      }
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val === 'string' && 
            val.includes('flixcart.com/image/') && 
            !val.includes('static-assets')) {
          const base = val.split('?')[0];
          if (!productImages.includes(base)) productImages.push(base);
        }
        if (typeof val === 'object') findImages(val);
      }
    }
    
    findImages(state);
    
    console.log(`\nFound ${productImages.length} product images:`);
    productImages.slice(0, 10).forEach((url, i) => console.log(`  [${i}] ${url}`));
    
  } catch(e) {
    console.log('Parse error:', e.message.substring(0, 150));
    console.log('Position:', e.message.match(/position (\d+)/)?.[1]);
    const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || '0');
    console.log('Context:', jsonStr.substring(Math.max(0, pos - 30), Math.min(jsonStr.length, pos + 30)));
    
    // Try to see around the error
    console.log('Char at pos:', jsonStr.charCodeAt(pos), jsonStr[pos]);
    console.log('Previous:', jsonStr.substring(Math.max(0, pos - 5), pos));
    console.log('Next:', jsonStr.substring(pos, pos + 5));
  }
}
main().catch(e => console.log('Error:', e.message));
