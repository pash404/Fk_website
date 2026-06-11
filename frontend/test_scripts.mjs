async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await resp.text();
  
  // Extract all script tags content
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let i = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content.length > 0) {
      console.log(`Script ${++i}: length=${content.length}, starts with: ${content.substring(0, 100)}`);
      // Check if it looks like JSON or contains product data
      if (content.includes('product') || content.includes('image') || content.includes('itm')) {
        console.log(`  *** Contains product/image data ***`);
        console.log(`  Full content: ${content.substring(0, 500)}`);
      }
    }
  }
  console.log(`\nTotal non-empty scripts: ${i}`);
}
main().catch(e => console.log('Error:', e.message));
