const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const product = await prisma.product.findFirst();
  const images = JSON.parse(product.images);
  images.push(
    'https://rukminim2.flixcart.com/image/600/600/xif0q/headphone/e/a/r/-original-imahnhbh5gczzfth.jpeg',
    'https://rukminim2.flixcart.com/image/800/800/xif0q/headphone/e/a/r/-original-imahnhbh5gczzfth.jpeg',
    'https://rukminim2.flixcart.com/image/150/150/xif0q/headphone/e/a/r/-original-imahnhbh5gczzfth.jpeg'
  );
  await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify(images) }
  });
  console.log('Updated ' + product.id + ' with ' + images.length + ' images');
}
main().catch(console.error).finally(() => prisma.$disconnect());
