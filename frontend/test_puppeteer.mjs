import puppeteer from 'puppeteer';

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
    
    console.log('Navigating to:', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('Page loaded, extracting images...');
    
    // Extract all product images from the rendered page
    const images = await page.evaluate(() => {
      // Try multiple strategies to find product images
      const results = [];
      
      // Strategy 1: Look for img elements with flixcart image URLs (excluding small thumbnails)
      document.querySelectorAll('img[src*="flixcart.com/image/"]').forEach(img => {
        const src = img.src || img.getAttribute('src');
        if (src && !src.includes('static-assets')) {
          // Get the base URL (remove query params)
          const base = src.split('?')[0];
          if (!results.includes(base)) results.push(base);
        }
      });
      
      // Strategy 2: Look for data-src or other attributes
      document.querySelectorAll('[data-src*="flixcart.com/image/"]').forEach(el => {
        const src = el.getAttribute('data-src');
        if (src) {
          const base = src.split('?')[0];
          if (!results.includes(base)) results.push(base);
        }
      });
      
      return results;
    });
    
    console.log(`Found ${images.length} images:`);
    images.forEach((url, i) => console.log(`  [${i}] ${url}`));
    
    // Also try to get JSON-LD from the rendered page
    const jsonLd = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const results = [];
      scripts.forEach(script => {
        try {
          results.push(JSON.parse(script.textContent));
        } catch(e) {}
      });
      return results;
    });
    console.log(`\nJSON-LD scripts found: ${jsonLd.length}`);
    for (const item of jsonLd) {
      const items = item['@graph'] || [item];
      for (const i of items) {
        if (i['@type'] === 'Product' && i.image) {
          console.log('Product images from JSON-LD:', Array.isArray(i.image) ? i.image.length : 1);
        }
      }
    }
    
  } finally {
    await browser.close();
    console.log('\nBrowser closed');
  }
}

main().catch(e => console.log('Error:', e.message, e.stack?.substring(0, 500)));
