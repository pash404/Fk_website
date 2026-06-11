import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-utils';

export async function GET(request, { params }) {
  const { pincode } = await params;
  const entry = await prisma.pincode.findUnique({ where: { pincode } });
  if (!entry) return error('Pincode not found', 404);
  return success({ city: entry.city, state: entry.state });
}
