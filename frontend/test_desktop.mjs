async function main() {
  // Try different URL formats to get the desktop version
  const urls = [
    'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?pid=ACCGWHFFGZYXGZHY',
    'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?marketplace=FLIPKART',
    'https://dl.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d',
  ];
  
  for (const url of urls) {
    console.log(`\n=== Trying: ${url.substring(0, 120)} ===`);
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
    });
    const html = await resp.text();
    console.log('Status:', resp.status, '| Length:', html.length);
    
    if (html.includes('Something went wrong')) {
      console.log('BLOCKED');
      continue;
    }
    
    if (html.includes('rukminim') || html.includes('flixcart.com/image/')) {
      const imgs = html.match(/https?:\/\/[^"'\s>]*?ukminim[^"'\s>]*?flixcart[^"'\s>]*?\/image\/[^"'\s>]*?(?:jpe?g|webp|png)/gi);
      const unique = [...new Set((imgs || []).map(u => u.split('?')[0]))].filter(u => !u.includes('static'));
      console.log('Product images:', unique.length);
      unique.slice(0,8).forEach((u, i) => console.log(`  [${i}] ${u}`));
    } else {
      console.log('No product images in HTML');
      // Check what's in the page
      if (html.includes('<!DOCTYPE html>')) {
        console.log('HTML page detected');
      }
    }
  }
}
main().catch(e => console.log('Error:', e.message));
