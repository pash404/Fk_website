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
    await page.setViewport({ width: 1280, height: 800 });
    
    // Listen for console messages from the page
    page.on('console', msg => {
      if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text().substring(0, 200));
    });
    
    const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
    
    console.log('Navigating to:', url);
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('HTTP status:', response?.status());
    console.log('Final URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'flipkart_debug.png', fullPage: true });
    console.log('Screenshot saved to flipkart_debug.png');
    
    // Get page content text (first 2000 chars)
    const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 1000) || 'no body');
    console.log('Body text:', bodyText);
    
    // Check for common elements
    const hasRetry = await page.evaluate(() => !!document.getElementById('retry_btn'));
    console.log('Has retry button:', hasRetry);
    
    // Check all images on page
    const allImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => ({
        src: (img.src || '').substring(0, 150),
        alt: (img.alt || '').substring(0, 50),
        width: img.width,
        height: img.height,
        loaded: img.complete,
      }));
    });
    console.log('All images on page:', allImages.length);
    allImages.forEach((img, i) => console.log(`  [${i}] src=${img.src} alt=${img.alt} w=${img.width} h=${img.height} loaded=${img.loaded}`));
    
  } finally {
    await browser.close();
    console.log('\nBrowser closed');
  }
}

main().catch(e => console.log('Error:', e.message, e.stack?.substring(0, 500)));
