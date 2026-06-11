async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d?pid=ACCGWHFFGZYXGZHY';
  
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  const html = await resp.text();
  
  // Search for INITIAL_STATE with various patterns
  const patterns = [
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/,
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*\n/,
    /__INITIAL_STATE__\s*=\s*({[\s\S]*?});/,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      console.log('Pattern matched, length:', match[1].length);
      console.log('First 100:', match[1].substring(0, 100));
      console.log('Last 100:', match[1].substring(match[1].length - 100));
    }
  }
  
  // Just search for INITIAL_STATE in the HTML
  const idx = html.indexOf('__INITIAL_STATE__');
  if (idx >= 0) {
    console.log('Found at index:', idx);
    console.log('Context:', html.substring(Math.max(0, idx - 20), idx + 200));
  } else {
    console.log('__INITIAL_STATE__ not found in HTML');
  }
  
  // Search for any __VAR__ pattern with state
  const allVars = html.match(/window\.__[A-Z_]+__/g);
  console.log('All window.__ vars:', [...new Set(allVars || [])].join(', '));
}
main().catch(e => console.log('Error:', e.message));
