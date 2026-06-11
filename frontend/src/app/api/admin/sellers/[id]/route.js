import { prisma } from '@/lib/prisma';
import { requireRole, hashPassword, sanitizeUser } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';

export async function GET(request, { params }) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const { id } = await params;
  const seller = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!seller) return error('Seller not found', 404);
  return success(sanitizeUser(seller));
}

export async function PUT(request, { params }) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const { id } = await params;
  const body = await parseBody(request);
  const data = {};
  if (body.storeName) data.storeName = body.storeName;
  if (body.upiId !== undefined) data.upiId = body.upiId;
  if (body.expiresAt) data.expiresAt = new Date(body.expiresAt);
  if (body.password) data.password = await hashPassword(body.password);
  if (body.status) data.status = body.status;
  const seller = await prisma.user.update({ where: { id: parseInt(id) }, data });
  return success(sanitizeUser(seller));
}

export async function DELETE(request, { params }) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const { id } = await params;
  await prisma.product.deleteMany({ where: { sellerId: parseInt(id) } });
  await prisma.upiDetail.deleteMany({ where: { sellerId: parseInt(id) } });
  await prisma.activity.deleteMany({ where: { userId: parseInt(id) } });
  await prisma.order.deleteMany({ where: { sellerId: parseInt(id) } });
  await prisma.user.delete({ where: { id: parseInt(id) } });
  return success({ message: 'Seller deleted' });
}
