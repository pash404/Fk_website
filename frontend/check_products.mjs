import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
for (const p of products) {
  console.log(p.id);
  console.log('  name:', p.name?.substring(0, 60));
  console.log('  images:', p.images);
  console.log('  stock:', p.stock);
  console.log('');
}
await prisma.$disconnect();
