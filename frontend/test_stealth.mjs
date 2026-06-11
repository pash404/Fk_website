import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function main() {
  console.log('Launching browser with stealth...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
    
    console.log('Navigating to:', url);
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('HTTP status:', response?.status());
    console.log('Final URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Check for error
    const hasRetry = await page.evaluate(() => !!document.getElementById('retry_btn'));
    console.log('Has retry button:', hasRetry);
    
    if (!hasRetry) {
      // Extract images
      const images = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('img[src*="flixcart.com/image/"]').forEach(img => {
          const src = img.src || img.getAttribute('src');
          if (src && !src.includes('static-assets')) {
            const base = src.split('?')[0];
            const size = img.width > 50 ? 'large' : 'thumb';
            if (!results.find(r => r.url === base)) {
              results.push({ url: base, size, width: img.width });
            }
          }
        });
        return results;
      });
      console.log(`Found ${images.length} images:`);
      images.forEach((img, i) => console.log(`  [${i}] ${img.url} (${img.size})`));
    } else {
      const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 500) || '');
      console.log('Error page text:', bodyText);
    }
    
    await page.screenshot({ path: 'flipkart_stealth.png' });
    console.log('Screenshot saved');
    
  } finally {
    await browser.close();
    console.log('Browser closed');
  }
}

main().catch(e => console.log('Error:', e.message, e.stack?.substring(0, 500)));
