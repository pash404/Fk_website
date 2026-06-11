import { requireRole } from '@/lib/auth-server';
import { success, error } from '@/lib/api-utils';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);

  const formData = await request.formData();
  const files = formData.getAll('images');
  if (!files || files.length === 0) return error('No images provided');

  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const urls = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await writeFile(join(uploadDir, filename), buffer);
    urls.push(`/uploads/${filename}`);
  }

  return success(urls);
}
