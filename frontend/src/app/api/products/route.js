import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';
import { success, error, parseBody, getSearchParams } from '@/lib/api-utils';

export async function GET(request) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);
  const params = getSearchParams(request);
  const page = parseInt(params.get('page')) || 1;
  const limit = parseInt(params.get('limit')) || 10;
  const skip = (page - 1) * limit;
  const [rawProducts, total] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where: { sellerId: user.id } }),
  ]);
  const products = rawProducts.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }));
  return NextResponse.json({ success: true, data: products, pagination: { totalPages: Math.ceil(total / limit), page, limit } });
}

export async function POST(request) {
  const user = await requireRole('SELLER')(request);
  if (!user) return error('Unauthorized', 401);
  const body = await parseBody(request);
  if (!body?.name || !body?.sellingPrice) {
    return error('Name and selling price are required');
  }
  const product = await prisma.product.create({
    data: {
      id: body.id || `P-${Date.now()}`,
      name: body.name,
      sellingPrice: parseFloat(body.sellingPrice),
      mrp: parseFloat(body.mrp || body.sellingPrice),
      stock: parseInt(body.stock) || 0,
      category: body.category || '',
      description: body.description || '',
      images: JSON.stringify(body.images || []),
      delivery: body.delivery || 'Free Delivery',
      sellerId: user.id,
    },
  });
  return success(product, 201);
}
