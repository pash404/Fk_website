import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error } from '@/lib/api-utils';

export async function GET(request) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);

  const [totalSellers, totalProducts, totalOrders, revenueAgg] = await Promise.all([
    prisma.user.count({ where: { role: 'SELLER' } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { amount: true } }),
  ]);

  return success({
    totalSellers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueAgg._sum.amount || 0,
  });
}
