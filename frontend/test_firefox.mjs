import { firefox } from 'playwright';

async function main() {
  console.log('Launching Playwright Firefox...');
  const browser = await firefox.launch({
    headless: true,
    args: [],
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    viewport: { width: 1280, height: 800 },
  });
  
  const page = await context.newPage();
  
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  
  console.log('Navigating...');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('Title:', await page.title());
  const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 500) || '');
  console.log('Body:', bodyText);
  
  const hasError = bodyText.includes('Something went wrong');
  console.log('Has error:', hasError);
  
  if (!hasError) {
    await new Promise(r => setTimeout(r, 3000));
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(i => i.src && (i.src.includes('rukminim') || (i.src.includes('flixcart') && !i.src.includes('static'))))
        .map(i => ({ src: i.src.substring(0, 160), w: i.naturalWidth }));
    });
    console.log('Product images:', JSON.stringify(images, null, 2));
    
    // Also get JSON-LD
    const jl = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      return Array.from(scripts).map(s => s.textContent?.substring(0, 500));
    });
    console.log('JSON-LD:', jl);
  }
  
  await browser.close();
}

main().catch(e => console.log('Error:', e.message));
