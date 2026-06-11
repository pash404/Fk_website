import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-utils';

export async function GET(request, { params }) {
  const { username } = await params;
  const seller = await prisma.user.findUnique({ where: { username, role: 'SELLER' } });
  if (!seller) return error('Store not found', 404);
  return success({ storeName: seller.storeName, username: seller.username });
}
