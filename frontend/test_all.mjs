async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  const html = await response.text();
  console.log('HTML length:', html.length);
  
  // Let's check EVERY image URL more broadly
  const broadImg = /https?:\/\/[^"'\s>)]+\.(?:jpe?g|png|webp)/gi;
  const all = html.match(broadImg);
  if (all) {
    const unique = [...new Set(all)];
    console.log('Total image URLs:', unique.length);
    // Filter to product-like URLs (containing /image/ or product-related paths)
    const productImgs = unique.filter(u => 
      u.includes('rukminim') || 
      u.includes('flipkart.com/image/') || 
      (u.includes('flixcart.com') && !u.includes('static-assets'))
    );
    console.log('Product image URLs:', productImgs.length);
    productImgs.slice(0, 10).forEach((u, i) => console.log('  [' + i + ']', u.substring(0,140)));
    
    if (productImgs.length === 0) {
      // Show all unique image URLs for debugging
      console.log('All unique image URLs:');
      unique.forEach((u, i) => console.log('  [' + i + ']', u.substring(0,140)));
    }
  } else {
    console.log('No image URLs at all');
  }
  
  // Check for any product data in JSON format
  const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  if (scripts) {
    console.log('\nTotal script tags:', scripts.length);
    let foundProductData = false;
    for (const script of scripts) {
      if (script.includes('"Product"') || script.includes('imageUrl') || script.includes('images[')) {
        foundProductData = true;
        console.log('Found script with image references, length:', script.length);
        console.log('First 300 chars:', script.substring(0, 300));
        break;
      }
    }
    if (!foundProductData) {
      console.log('No script tag with image/product data found');
    }
  }
}
main().catch(e => console.log('Error:', e.message));
