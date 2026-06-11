import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, sanitizeUser } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';

export async function POST(request) {
  const body = await parseBody(request);
  if (!body?.username || !body?.password) {
    return error('Username and password are required');
  }
  if (body.password.length < 6) {
    return error('Password must be at least 6 characters');
  }
  const existing = await prisma.user.findUnique({ where: { username: body.username } });
  if (existing) {
    return error('Username already taken');
  }
  const user = await prisma.user.create({
    data: {
      username: body.username,
      password: await hashPassword(body.password),
      storeName: body.storeName || body.username,
      role: 'SELLER',
    },
  });
  const token = signToken(user);
  const response = success({ token, user: sanitizeUser(user) });
  response.cookies.set('token', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/',
  });
  response.cookies.set('user', JSON.stringify(sanitizeUser(user)), {
    httpOnly: false, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/',
  });
  return response;
}
