import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';

export async function GET(request) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);
  const upiDetails = await prisma.upiDetail.findMany({ where: { sellerId: user.id } });
  return success({ upiDetails });
}

export async function PUT(request) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);
  const body = await parseBody(request);
  if (!body?.upiId) return error('UPI ID is required');
  const detail = await prisma.upiDetail.create({
    data: { upiId: body.upiId, trId: body.trId || '', sellerId: user.id },
  });
  return success(detail, 201);
}
