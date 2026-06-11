async function main() {
  const url = 'https://www.flipkart.com/aroma-nb121-pods-upto-40-hours-playtime-type-c-fast-charging-dual-pairing-earbuds-bluetooth/p/itm4b9eae6bd5d5d';
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });
  const html = await response.text();
  console.log('HTML length:', html.length);
  
  // JSON-LD
  const jl = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  if (jl) {
    console.log('JSON-LD found, length:', jl[1].length);
    try {
      const parsed = JSON.parse(jl[1]);
      console.log('JSON-LD keys:', Object.keys(parsed));
      if (parsed.image) {
        console.log('image type:', typeof parsed.image);
        if (Array.isArray(parsed.image)) {
          console.log('image count:', parsed.image.length);
          parsed.image.slice(0,5).forEach((u, i) => console.log('  img[' + i + ']:', u.substring(0,100)));
        } else {
          console.log('  image:', parsed.image.substring(0,100));
        }
      }
    } catch(e) { console.log('JSON parse error:', e.message); }
  } else {
    console.log('No JSON-LD found');
  }
  
  // og:image
  const og = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
  if (og) console.log('og:image:', og[1].substring(0,100));
  else console.log('No og:image');
  
  // All image URLs with flixcart
  const imgRegex = /https?:\/\/[^"'\s>]*?flixcart[^"'\s>]*?\/image\/[^"'\s>]*?(?:jpeg|jpg|webp)/gi;
  const imgs = html.match(imgRegex);
  console.log('Image URL matches:', imgs ? imgs.length : 0);
  if (imgs) {
    const unique = [...new Set(imgs)];
    console.log('Unique images:', unique.length);
    unique.slice(0,10).forEach((u, i) => console.log('  [' + i + ']', u.substring(0,130)));
  }
  
  // Search for any image URL
  const anyImg = html.match(/https?:\/\/[^"'\s>]*?\.(?:jpeg|jpg|webp|png)/gi);
  console.log('Total image URLs:', anyImg ? anyImg.length : 0);
  if (anyImg) {
    const unique = [...new Set(anyImg)];
    console.log('Unique total images:', unique.length);
    unique.filter(u => u.includes('flixcart') || u.includes('flipkart')).slice(0,10).forEach((u, i) => console.log('  [' + i + ']', u.substring(0,130)));
  }
}
main().catch(e => console.log('Error:', e.message));
