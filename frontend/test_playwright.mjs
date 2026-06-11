import { chromium } from 'playwright';

async function main() {
  console.log('Launching Playwright Chromium...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });
  
  const page = await context.newPage();
  
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  
  console.log('Navigating...');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('Title:', await page.title());
  const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 300) || '');
  console.log('Body:', bodyText);
  
  const hasError = bodyText.includes('Something went wrong');
  console.log('Has error:', hasError);
  
  if (!hasError) {
    await new Promise(r => setTimeout(r, 2000));
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(i => i.src && i.src.includes('flixcart') && !i.src.includes('static'))
        .map(i => ({ src: i.src.substring(0, 160), w: i.naturalWidth }));
    });
    console.log('Product images:', images);
  }
  
  await browser.close();
}

main().catch(e => console.log('Error:', e.message));
