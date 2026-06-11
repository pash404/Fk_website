import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';

export async function PATCH(request, { params }) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const { id } = await params;
  const body = await parseBody(request);
  if (!body?.status) return error('Status is required');
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(body.status)) return error('Invalid status');
  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status: body.status, adminNote: body.adminNote || undefined },
  });
  return success(order);
}
