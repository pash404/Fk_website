import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error, getSearchParams } from '@/lib/api-utils';

export async function GET(request) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const params = getSearchParams(request);
  const status = params.get('status');
  const where = {};
  if (status) where.status = status;
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { seller: { select: { username: true, storeName: true } } },
  });
  return success(orders);
}
