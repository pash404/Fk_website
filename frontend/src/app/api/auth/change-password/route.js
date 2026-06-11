import { prisma } from '@/lib/prisma';
import { getAuthUser, hashPassword, comparePassword } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';

export async function POST(request) {
  const user = await getAuthUser();
  if (!user) return error('Not authenticated', 401);
  const body = await parseBody(request);
  if (!body?.oldPassword || !body?.newPassword) {
    return error('Old password and new password are required');
  }
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!(await comparePassword(body.oldPassword, dbUser.password))) {
    return error('Old password is incorrect', 400);
  }
  if (body.newPassword.length < 6) {
    return error('New password must be at least 6 characters');
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(body.newPassword) },
  });
  return success({ message: 'Password changed successfully' });
}
