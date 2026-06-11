import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error } from '@/lib/api-utils';

export async function GET(request) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const raw = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { seller: { select: { username: true, storeName: true } } },
  });
  const products = raw.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }));
  return success(products);
}
