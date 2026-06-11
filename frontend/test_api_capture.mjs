import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  
  // Collect network responses
  const apiResponses = [];
  await page.setRequestInterception(true);
  
  page.on('request', request => {
    const url = request.url();
    // Allow all requests but log API-like ones
    if (url.includes('api.flipkart') || url.includes('/api/') || url.includes('graphql')) {
      console.log('API REQUEST:', url.substring(0, 200));
    }
    request.continue();
  });
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('.json') || url.includes('api') || url.includes('graphql')) {
      try {
        const text = await response.text();
        if (text.startsWith('{') || text.startsWith('[')) {
          apiResponses.push({ url: url.substring(0, 150), data: text.substring(0, 500) });
          console.log('API RESPONSE:', url.substring(0, 150), '| length:', text.length, '| starts with:', text.substring(0, 100));
        }
      } catch(e) {}
    }
  });
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log('Navigating...');
  await page.goto('https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  
  console.log('Title:', await page.title());
  
  // Check if there's a "Retry" button and click it
  const hasRetry = await page.evaluate(() => !!document.getElementById('retry_btn'));
  console.log('Has retry button:', hasRetry);
  
  if (hasRetry) {
    console.log('Clicking retry...');
    await page.click('#retry_btn');
    await new Promise(r => setTimeout(r, 5000));
    console.log('After retry title:', await page.title());
    
    const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 300) || '');
    console.log('After retry body:', bodyText);
  }
  
  console.log('\nAll API responses captured:', apiResponses.length);
  apiResponses.forEach(r => {
    console.log('URL:', r.url);
    console.log('Data:', r.data.substring(0, 300));
    console.log('---');
  });
  
  await browser.close();
}

main().catch(e => console.log('Error:', e.message));
