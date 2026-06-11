import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';

export async function GET(request) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const settings = await prisma.setting.findMany();
  const map = {};
  settings.forEach(s => { map[s.key] = s.value; });
  return success(map);
}

export async function PUT(request) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const body = await parseBody(request);
  if (!body) return error('No data provided');
  for (const [key, value] of Object.entries(body)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  return success({ message: 'Settings updated' });
}
