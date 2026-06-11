import { readFileSync } from 'fs';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

// Use Node.js to find INITIAL_STATE
const file = 'flipkart_page.html';
const content = readFileSync(file, 'utf8');
console.log('File size:', content.length);

const startMarker = 'window.__INITIAL_STATE__';
const idx = content.indexOf(startMarker);

if (idx === -1) {
  console.log('Not found!');
  // Try to find the script tag that contains it
  const scriptIdx = content.indexOf('__INITIAL_STATE__');
  if (scriptIdx >= 0) {
    console.log('Found __INITIAL_STATE__ at position', scriptIdx);
    console.log('Context:', content.substring(Math.max(0, scriptIdx - 50), scriptIdx + 200));
  } else {
    console.log('__INITIAL_STATE__ not anywhere!');
  }
} else {
  console.log('Found at', idx);
  const start = idx + startMarker.length;
  console.log('Context:', content.substring(start, start + 300));
}

// Search for any "imageUrl" or "images" patterns
const imageUrlPattern = /["'](?:https?:)?\/\/[^"']*?(?:ukminim|flixcart)[^"']*?\/image\/[^"']*?(?:jpe?g|webp|png)/g;
const matches = content.match(imageUrlPattern) || [];
const nonStatic = matches.filter(u => !u.includes('static-assets'));
console.log('\nNon-static image URLs:', nonStatic.length);
nonStatic.slice(0, 5).forEach((u, i) => console.log(`  [${i}]`, u.substring(0, 150)));
