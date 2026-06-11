import { prisma } from '@/lib/prisma';
import { success, getSearchParams } from '@/lib/api-utils';

export async function GET(request) {
  const params = getSearchParams(request);
  const store = params.get('store');
  const where = { status: 'active' };
  if (store) {
    const seller = await prisma.user.findUnique({ where: { username: store } });
    if (seller) where.sellerId = seller.id;
  }
  const raw = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { seller: { select: { storeName: true, username: true } } },
  });
  const products = raw.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }));
  return success(products);
}
