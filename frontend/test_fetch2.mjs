async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  
  // Try Googlebot user agent
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  const html = await response.text();
  console.log('=== Googlebot UA ===');
  console.log('HTML length:', html.length);
  
  const jl = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\N]*?)<\/script>/i);
  if (jl) {
    console.log('JSON-LD found, length:', jl[1].length);
    try {
      const parsed = JSON.parse(jl[1]);
      const items = parsed['@graph'] || [parsed];
      for (const item of items) {
        if (item['@type'] === 'Product' || item['@type'] === 'product') {
          console.log('product name:', item.name);
          if (item.image) {
            console.log('image type:', typeof item.image);
            if (Array.isArray(item.image)) {
              console.log('image count:', item.image.length);
              item.image.forEach((u, i) => console.log('  [' + i + ']', u.substring(0,120)));
            } else {
              console.log('image:', item.image.substring(0,120));
            }
          }
        }
      }
    } catch(e) { console.log('JSON parse error:', e.message); }
  } else {
    console.log('No JSON-LD found');
  }
  
  const og = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
  if (og) console.log('og:image:', og[1].substring(0,100));
  else console.log('No og:image');
  
  // Also try the Flipkart internal API
  console.log('\n=== Flipkart Internal API ===');
  try {
    const pid = 'itm4b9eae6bd5d5d';
    const apiUrl = 'https://www.flipkart.com/api/4/product/getProductDetail';
    const apiResp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        requestContext: { source: 'SEARCH' },
        productId: pid,
        store: 'tyy,4rr',
        productDetailV3: true,
        hasFetchList: true,
      })
    });
    const data = await apiResp.text();
    console.log('API response length:', data.length);
    try {
      const json = JSON.parse(data);
      console.log('API success:', json.response ? 'yes' : 'no');
      if (json.response && json.response.productDetail) {
        const pd = json.response.productDetail;
        console.log('product name:', pd.product?.title);
        if (pd.product?.imageUrls) {
          const urls = pd.product.imageUrls;
          console.log('imageUrls:', typeof urls, Array.isArray(urls) ? urls.length : Object.keys(urls).length);
          console.log(JSON.stringify(urls).substring(0, 300));
        }
      }
    } catch(e) {
      console.log('API parse error:', e.message);
      console.log('First 500 chars:', data.substring(0, 500));
    }
  } catch(e) {
    console.log('API fetch error:', e.message);
  }
}
main().catch(e => console.log('Error:', e.message));
