import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error, parseBody } from '@/lib/api-utils';

export async function PUT(request, { params }) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);
  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.sellerId !== user.id) return error('Product not found', 404);
  const body = await parseBody(request);
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      sellingPrice: body.sellingPrice ? parseFloat(body.sellingPrice) : existing.sellingPrice,
      mrp: body.mrp ? parseFloat(body.mrp) : existing.mrp,
      stock: body.stock !== undefined ? parseInt(body.stock) : existing.stock,
      category: body.category ?? existing.category,
      description: body.description ?? existing.description,
      images: body.images ? JSON.stringify(body.images) : existing.images,
      delivery: body.delivery ?? existing.delivery,
      status: body.status ?? existing.status,
    },
  });
  return success({ ...product, images: JSON.parse(product.images || '[]') });
}

export async function DELETE(request, { params }) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);
  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.sellerId !== user.id) return error('Product not found', 404);
  await prisma.product.delete({ where: { id } });
  return success({ message: 'Product deleted' });
}
