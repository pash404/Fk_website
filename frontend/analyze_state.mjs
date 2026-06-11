import { readFileSync } from 'fs';

const html = readFileSync(process.argv[2] || 'C:\\Users\\Administrator\\.local\\share\\opencode\\tool-output\\tool_ea03d2a73001AqVJc3EkzW2Vz1', 'utf8');
const startMarker = 'window.__INITIAL_STATE__ = ';
const start = html.indexOf(startMarker);
if (start === -1) { console.log('not found'); process.exit(1); }

const jsonStart = start + startMarker.length;
let depth = 0, inStr = false, escaped = false, end = jsonStart;
for (let i = jsonStart; i < html.length; i++) {
  const ch = html[i];
  if (escaped) { escaped = false; continue; }
  if (ch === '\\' && inStr) { escaped = true; continue; }
  if (ch === '"' && !escaped) { inStr = !inStr; continue; }
  if (!inStr) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth === 0) { end = i + 1; break; }
  }
}

const jsonStr = html.substring(jsonStart, end);
console.log('JSON length:', jsonStr.length);

try {
  const data = JSON.parse(jsonStr);
  
  // Search for image-related keys
  function search(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => search(item, path + '[' + i + ']'));
      return;
    }
    const keys = Object.keys(obj);
    for (const key of keys) {
      const val = obj[key];
      const newPath = path + '.' + key;
      const keyLower = key.toLowerCase();
      
      if ((keyLower.includes('image') || keyLower.includes('img') || keyLower.includes('url')) && typeof val === 'string') {
        if (val.includes('flixcart') || val.includes('http')) {
          console.log(newPath, '=', val.substring(0, 200));
        }
      }
      
      if (typeof val === 'object') {
        search(val, newPath);
      }
    }
  }
  
  search(data, 'root');
  
  // Also look for common image containers
  if (data.multiWidgetState) {
    const mws = data.multiWidgetState;
    // Look at the keys
    for (const key of Object.keys(mws)) {
      if (key.toLowerCase().includes('image') || key.toLowerCase().includes('media') || key.toLowerCase().includes('gallery')) {
        console.log('\nInteresting key:', key);
        console.log(JSON.stringify(mws[key]).substring(0, 500));
      }
    }
  }
  
} catch(e) {
  console.log('Parse error:', e.message.substring(0, 100));
}
