const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  console.log('Total products: ' + products.length);
  for (const p of products) {
    const imgs = JSON.parse(p.images || '[]');
    console.log(p.id + ' | ' + p.name.substring(0, 50) + ' | ' + imgs.length + ' images | ' + p.createdAt);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
