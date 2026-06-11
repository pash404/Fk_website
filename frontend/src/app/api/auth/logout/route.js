import { success } from '@/lib/api-utils';

export async function POST() {
  const response = success({ message: 'Logged out' });
  response.cookies.set('token', '', { httpOnly: true, maxAge: 0, path: '/' });
  response.cookies.set('user', '', { httpOnly: false, maxAge: 0, path: '/' });
  return response;
}
