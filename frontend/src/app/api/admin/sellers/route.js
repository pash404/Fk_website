import { prisma } from '@/lib/prisma';
import { requireRole, hashPassword } from '@/lib/auth-server';
import { success, error, parseBody, getSearchParams } from '@/lib/api-utils';

export async function GET(request) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const params = getSearchParams(request);
  const search = params.get('search') || '';
  const where = { role: 'SELLER' };
  if (search) {
    where.OR = [
      { username: { contains: search } },
      { storeName: { contains: search } },
    ];
  }
  const sellers = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: { id: true, username: true, storeName: true, role: true, status: true, expiresAt: true, upiId: true, createdAt: true },
  });
  return success(sellers);
}

export async function POST(request) {
  const user = await requireRole('ADMIN')(request);
  if (!user) return error('Unauthorized', 401);
  const body = await parseBody(request);
  if (!body?.username || !body?.password) return error('Username and password required');
  const existing = await prisma.user.findUnique({ where: { username: body.username } });
  if (existing) return error('Username already taken');
  const seller = await prisma.user.create({
    data: {
      username: body.username,
      password: await hashPassword(body.password),
      storeName: body.storeName || body.username,
      role: 'SELLER',
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  });
  const { password, ...safe } = seller;
  return success(safe, 201);
}
