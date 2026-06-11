async function main() {
  const pid = 'itm4b9eae6bd5d5d';
  
  // Try various Flipkart API patterns
  const apis = [
    // GraphQL endpoint
    {
      url: 'https://1.rome.api.flipkart.com/api/4/product/getProductDetail',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 FKUA/website~41.0.0',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        requestContext: { source: 'SEARCH' },
        productId: pid,
        store: 'tyy,4rr',
        productDetailV3: true,
      }),
    },
    // Try without productDetailV3
    {
      url: 'https://1.rome.api.flipkart.com/api/3/product/detail',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        productId: pid,
        store: 'tyy,4rr',
      }),
    },
    // Try a simpler format
    {
      url: 'https://www.flipkart.com/api/4/product/getProductDetail',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        requestContext: { source: 'SEARCH' },
        productId: pid,
      }),
    },
  ];

  for (const api of apis) {
    console.log(`\n=== Trying ${api.url} ===`);
    try {
      const resp = await fetch(api.url, {
        method: api.method,
        headers: api.headers,
        body: api.body,
      });
      const text = await resp.text();
      console.log('Status:', resp.status, 'Length:', text.length);
      if (resp.status === 200 && text.startsWith('{')) {
        try {
          const json = JSON.parse(text);
          if (json.response?.productDetail?.product) {
            const p = json.response.productDetail.product;
            console.log('Product:', p.title?.substring(0, 50));
            if (p.imageUrls) {
              console.log('imageUrls:', JSON.stringify(p.imageUrls).substring(0, 300));
            } else {
              console.log('No imageUrls. Keys:', Object.keys(p).join(', '));
            }
          } else if (json.response?.productDetail) {
            console.log('productDetail keys:', Object.keys(json.response.productDetail).join(', '));
          } else if (json.response) {
            console.log('response keys:', Object.keys(json.response).join(', '));
          } else {
            console.log('Top keys:', Object.keys(json).join(', '));
            console.log('First 200:', JSON.stringify(json).substring(0, 200));
          }
        } catch(e) { console.log('Parse error:', e.message, 'First 200:', text.substring(0, 200)); }
      } else {
        console.log('First 200:', text.substring(0, 200));
      }
    } catch(e) { console.log('Fetch error:', e.message); }
  }
}
main().catch(e => console.log('Error:', e.message));
