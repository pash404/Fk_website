async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?pid=ACCGWHFFGZYXGZHY';
  
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
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
          console.log('Product name:', item.name?.substring(0, 50));
          if (item.image) {
            console.log('Image type:', typeof item.image);
            if (Array.isArray(item.image)) {
              console.log('Image count:', item.image.length);
              item.image.forEach((u, i) => console.log(`  [${i}]`, u));
            } else {
              console.log('Image:', item.image.substring(0, 150));
            }
          }
        }
      }
    } catch(e) { console.log('Parse error:', e.message); }
  } else {
    console.log('No JSON-LD');
  }
  
  // Look for all flixcart image URLs
  const imgRegex = /https?:\/\/[^"'\s>)]*?ukminim[^"'\s>)]*?flixcart[^"'\s>)]*?\/image\/[^"'\s>)]*?(?:jpe?g|webp|png)/gi;
  const allImgs = html.match(imgRegex);
  if (allImgs) {
    const unique = [...new Set(allImgs.map(u => u.split('?')[0].split('\\')[0]))].filter(u => !u.includes('static'));
    console.log('\nProduct image URLs:', unique.length);
    unique.slice(0, 10).forEach((u, i) => console.log(`  [${i}]`, u));
  } else {
    console.log('\nNo product image URLs');
  }
  
  // Check for __NEXT_DATA__ or preloaded state
  const nextData = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (nextData) {
    console.log('\n__NEXT_DATA__ found, length:', nextData[1].length);
  }
  
  // Check for any JSON-like product data
  const jsonScripts = html.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi);
  console.log('\napplication/json scripts:', jsonScripts ? jsonScripts.length : 0);
  
  // Check for window.__INITIAL_STATE__ or __PRELOADED_STATE__
  const initState = html.match(/window\.__PRELOADED_STATE__\s*=\s*({[\s\S]*?});/);
  if (initState) {
    console.log('\n__PRELOADED_STATE__ found');
  }
  const initState2 = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/);
  if (initState2) {
    console.log('\n__INITIAL_STATE__ found');
  }
  
  // Search for "image" in the HTML (case insensitive) and show context
  const imageRefs = html.match(/[^.]{0,50}image[^.]{0,100}\.(?:jpe?g|webp|png)/gi);
  if (imageRefs) {
    console.log('\nImage references:', imageRefs.length);
    imageRefs.slice(0, 5).forEach((r, i) => console.log(`  [${i}]`, r.substring(0, 150)));
  }
}
main().catch(e => console.log('Error:', e.message));
