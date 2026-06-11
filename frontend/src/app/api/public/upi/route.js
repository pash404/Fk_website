import { prisma } from '@/lib/prisma';
import { success } from '@/lib/api-utils';

export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { key: 'upi_id' } });
  return success({ upiId: setting?.value || '' });
}
