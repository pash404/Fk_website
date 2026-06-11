import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  for (const p of products) {
    console.log(p.id, '|', 'images:', (p.images || '[]').substring(0,200));
  }
}
main().finally(() => prisma.$disconnect());
