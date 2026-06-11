async function main() {
  // Try searching Flipkart for the product to get multiple images from search results
  const searchUrl = 'https://www.flipkart.com/api/4/search/search?q=aroma+nb121+pods&store=tyy&page=1';
  
  const resp = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
    }
  });
  console.log('Search API status:', resp.status);
  const text = await resp.text();
  console.log('Response length:', text.length);
  
  if (text.startsWith('{')) {
    try {
      const data = JSON.parse(text);
      // Explore structure
      function findImages(obj, path) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
          obj.forEach((item, i) => findImages(item, path + '[' + i + ']'));
          return;
        }
        const keys = Object.keys(obj);
        for (const key of keys) {
          const val = obj[key];
          if (typeof val === 'string' && val.includes('flixcart.com/image/') && !val.includes('static')) {
            console.log(`Image at ${path}.${key}:`, val);
          }
          if (typeof val === 'object') findImages(val, path + '.' + key);
        }
      }
      findImages(data, 'root');
    } catch(e) { console.log('Parse error:', e.message); }
  } else {
    console.log('Not JSON, first 300:', text.substring(0, 300));
  }
}
main().catch(e => console.log('Error:', e.message));
