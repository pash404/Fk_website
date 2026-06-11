import { getAuthUser } from '@/lib/auth-server';
import { success, error } from '@/lib/api-utils';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return error('Not authenticated', 401);
  return success(user);
}
