async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  const html = await resp.text();
  
  // Try the product page with pid param (which returns more content)
  const resp2 = await fetch(url + '?pid=ACCGWHFFGZYXGZHY', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  const html2 = await resp2.text();
  
  console.log('=== Without pid param === HTML length:', html.length);
  console.log('=== With pid param === HTML length:', html2.length);
  
  // Check for various patterns in the larger HTML
  const check = (html, label) => {
    console.log(`\n--- ${label} ---`);
    
    // JSON-LD
    const jl = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>/i);
    console.log('JSON-LD script:', jl ? 'present' : 'absent');
    
    // og:image
    const og = html.match(/<meta[^>]*property="og:image"[^>]*>/i);
    console.log('og:image:', og ? 'present' : 'absent');
    
    // og:title
    const ogt = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
    console.log('og:title:', ogt ? ogt[1].substring(0, 60) : 'absent');
    
    // Check for B_NuCI or VU-ZEz classes
    const bn = html.match(/B_NuCI/);
    const vz = html.match(/VU-ZEz/);
    console.log('B_NuCI class:', bn ? 'present' : 'absent');
    console.log('VU-ZEz class:', vz ? 'present' : 'absent');
    
    // Check for h1
    const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    console.log('h1:', h1 ? h1[1].substring(0, 60) : 'absent');
    
    // Check for ₹ price
    const rs = html.match(/₹\s*([0-9,]+\.?\d*)/);
    console.log('₹ price:', rs ? rs[1] : 'absent');
    
    // Check for __INITIAL_STATE__
    const init = html.includes('__INITIAL_STATE__');
    console.log('__INITIAL_STATE__:', init ? 'present' : 'absent');
    
    // Check for product name in the HTML
    if (html.includes('Aroma NB121')) console.log('Product name in HTML: yes');
    
    // Look for any span with product-like text
    const spans = html.match(/<span[^>]*class="[^"]*"[^>]*>[^<]{10,100}<\/span>/g);
    if (spans) {
      const productSpans = spans.filter(s => s.includes('Aroma') || s.includes('NB121') || s.includes('Pods'));
      if (productSpans.length > 0) {
        console.log('Product spans:', productSpans.length);
        productSpans.slice(0, 3).forEach(s => console.log('  -', s.substring(0, 150)));
      }
    }
    
    // Look for any product name in the INITIAL_STATE data
    if (init) {
      const initMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*\n/);
      if (initMatch) {
        try {
          const state = JSON.parse(initMatch[1]);
          // Find the page title in the state
          if (state.multiWidgetState?.pageMeta) {
            console.log('pageMeta:', JSON.stringify(state.multiWidgetState.pageMeta).substring(0, 300));
          }
          // Look for product name
          function findName(obj) {
            if (!obj || typeof obj !== 'object') return;
            if (Array.isArray(obj)) { obj.forEach(findName); return; }
            for (const key of Object.keys(obj)) {
              if (typeof obj[key] === 'string' && (obj[key].includes('Aroma') || obj[key].includes('NB121'))) {
                console.log(`Found product name at .${key}:`, obj[key].substring(0, 80));
              }
              if (typeof obj[key] === 'object') findName(obj[key]);
            }
          }
          findName(state);
        } catch(e) {}
      }
    }
  };
  
  check(html, 'WITHOUT pid');
  check(html2, 'WITH pid');
}
main().catch(e => console.log('Error:', e.message));
