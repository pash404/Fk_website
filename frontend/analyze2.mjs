import { readFileSync } from 'fs';

const content = readFileSync('flipkart_page.html', 'utf8');

const startMarker = 'window.__INITIAL_STATE__ = ';
const start = content.indexOf(startMarker);
const jsonStart = start + startMarker.length;

// Find balanced closing brace
let depth = 0, inStr = false, escaped = false, end = jsonStart;
for (let i = jsonStart; i < content.length; i++) {
  const ch = content[i];
  if (escaped) { escaped = false; continue; }
  if (ch === '\\' && inStr) { escaped = true; continue; }
  if (ch === '"' && !escaped) { inStr = !inStr; continue; }
  if (!inStr) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth === 0) { end = i + 1; break; }
  }
}

const jsonStr = content.substring(jsonStart, end);
console.log('JSON length:', jsonStr.length, 'end at', end);

try {
  const data = JSON.parse(jsonStr);
  
  // Find all image URLs in the parsed data
  const found = [];
  function findUrls(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => findUrls(item, path + '[' + i + ']'));
      return;
    }
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const fullPath = path + '.' + key;
      
      if (typeof val === 'string') {
        if ((val.includes('/image/') || val.includes('.jpeg') || val.includes('.jpg') || val.includes('.webp')) &&
            val.includes('flixcart') && !val.includes('static')) {
          found.push({ path: fullPath, url: val.split('?')[0] });
        }
      }
      if (typeof val === 'object') {
        findUrls(val, fullPath);
      }
    }
  }
  
  findUrls(data, 'root');
  
  // Deduplicate
  const unique = {};
  found.forEach(({path, url}) => { unique[url] = unique[url] || { url, paths: [] }; unique[url].paths.push(path); });
  
  console.log('Found', Object.keys(unique).length, 'unique image URLs:');
  Object.values(unique).forEach(({url, paths}) => {
    console.log(`  ${url}`);
    console.log(`    paths: ${paths.slice(0, 2).join(', ')}`);
  });
  
  // Look specifically for product data
  if (data.multiWidgetState) {
    const keys = Object.keys(data.multiWidgetState);
    console.log('\nmultiWidgetState keys:', keys.join(', '));
    
    // Look for anything with 'data' or 'product' or 'widget'
    for (const key of keys) {
      if (key === 'data' || key.includes('product') || key.includes('widget')) {
        const val = data.multiWidgetState[key];
        console.log(`\n${key}:`, typeof val, val ? (Array.isArray(val) ? 'Array[' + val.length + ']' : Object.keys(val).length + ' keys') : 'null');
        if (typeof val === 'object' && val) {
          const s = JSON.stringify(val);
          if (s.length < 1000) console.log('  ', s);
          else console.log('  [stringified:', s.length, 'chars]');
        }
      }
    }
  }
  
} catch(e) {
  console.log('Parse error:', e.message.substring(0, 100));
  const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || '0');
  console.log('Around error:', jsonStr.substring(Math.max(0, pos - 50), Math.min(jsonStr.length, pos + 50)));
}
