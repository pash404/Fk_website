import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error } from '@/lib/api-utils';

export async function GET(request) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);

  const [totalProducts, totalRevenue, recentActivities] = await Promise.all([
    prisma.product.count({ where: { sellerId: user.id } }),
    prisma.order.aggregate({
      where: { sellerId: user.id },
      _sum: { amount: true },
    }),
    prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const daysRemaining = user.expiresAt
    ? Math.max(0, Math.ceil((new Date(user.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : 30;

  const subscription = {
    daysRemaining,
    active: user.status === 'active' && daysRemaining > 0,
  };

  return success({
    totalProducts,
    totalRevenue: totalRevenue._sum.amount || 0,
    subscription,
    recentActivities: recentActivities.map(a => ({
      id: a.id, action: a.action, details: a.details, createdAt: a.createdAt,
    })),
  });
}
