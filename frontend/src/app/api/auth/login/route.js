import { prisma } from '@/lib/prisma';
import { comparePassword, signToken, sanitizeUser } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';

export async function POST(request) {
  const body = await parseBody(request);
  if (!body?.username || !body?.password) {
    return error('Username and password are required');
  }
  const user = await prisma.user.findUnique({ where: { username: body.username } });
  if (!user || !(await comparePassword(body.password, user.password))) {
    return error('Invalid username or password', 401);
  }
  if (user.status !== 'active') {
    return error('Account is disabled', 403);
  }
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
