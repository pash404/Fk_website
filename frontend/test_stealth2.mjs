import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });
  
  try {
    const page = await browser.newPage();
    
    // Set common cookies to avoid bot detection
    await page.setCookie(
      { name: 'flipkart_cookie', value: 'test', domain: '.flipkart.com' },
    );
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 375, height: 812 }); // iPhone viewport
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });
    
    const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
    
    console.log('Navigating...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('Title:', await page.title());
    const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 300) || '');
    console.log('Page text:', bodyText);
    
    // Wait a bit more for dynamic content
    await new Promise(r => setTimeout(r, 3000));
    
    // Try to find images again
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => img.complete && img.naturalWidth > 0)
        .map(img => ({
          src: (img.src || '').substring(0, 200),
          w: img.naturalWidth,
          h: img.naturalHeight,
        }));
    });
    console.log('Loaded images:', images.length);
    images.forEach((img, i) => console.log(`  [${i}] ${img.src} (${img.w}x${img.h})`));
    
  } finally {
    await browser.close();
  }
}

main().catch(e => console.log('Error:', e.message));
