import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.product.findUnique({ where: { id: 'P-1780794122147' } });
  console.log('Full images string:', p.images);
  console.log('Parsed count:', JSON.parse(p.images).length);
}
main().finally(() => prisma.$disconnect());
