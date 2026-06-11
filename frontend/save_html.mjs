async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?pid=ACCGWHFFGZYXGZHY';
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  const html = await resp.text();
  const fs = await import('fs');
  fs.writeFileSync('flipkart_page.html', html);
  console.log('Saved HTML to flipkart_page.html');
}
main().catch(e => console.log('Error:', e.message));
