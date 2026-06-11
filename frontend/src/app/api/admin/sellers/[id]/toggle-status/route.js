import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error } from '@/lib/api-utils';

export async function PATCH(request, { params }) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const { id } = await params;
  const seller = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!seller) return error('Seller not found', 404);
  const updated = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { status: seller.status === 'active' ? 'disabled' : 'active' },
  });
  return success({ id: updated.id, status: updated.status });
}
