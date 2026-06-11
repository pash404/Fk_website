import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-utils';

export async function GET(request, { params }) {
  const { username } = await params;
  const seller = await prisma.user.findUnique({ where: { username, role: 'SELLER' } });
  if (!seller) return error('Store not found', 404);
  const upiDetails = await prisma.upiDetail.findMany({ where: { sellerId: seller.id } });
  return success(upiDetails);
}
