import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  
  // Override the webdriver property before navigation
  await page.evaluateOnNewDocument(() => {
    // Override navigator.webdriver
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    // Override chrome.runtime
    window.chrome = { runtime: {} };
    // Override permissions
    const originalQuery = window.navigator.permissions?.query;
    if (originalQuery) {
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    }
    // Override plugins
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  });
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  
  console.log('Title:', await page.title());
  const hasError = await page.evaluate(() => document.body.innerText.includes('Something went wrong'));
  console.log('Has error:', hasError);
  
  if (!hasError) {
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img[src]'))
        .filter(i => i.src.includes('flixcart') && !i.src.includes('static'))
        .map(i => i.src.substring(0, 150));
    });
    console.log('Product images:', images);
  }
  
  await browser.close();
}

main().catch(e => console.log('Error:', e.message));
