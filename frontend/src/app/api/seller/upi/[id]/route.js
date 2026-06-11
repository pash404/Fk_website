import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error } from '@/lib/api-utils';

export async function DELETE(request, { params }) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);
  const { id } = await params;
  const detail = await prisma.upiDetail.findUnique({ where: { id: parseInt(id) } });
  if (!detail || detail.sellerId !== user.id) return error('Not found', 404);
  await prisma.upiDetail.delete({ where: { id: parseInt(id) } });
  return success({ message: 'Deleted' });
}
