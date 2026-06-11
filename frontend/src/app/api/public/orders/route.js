import { prisma } from '@/lib/prisma';
import { success, error, parseBody, getSearchParams } from '@/lib/api-utils';

export async function GET(request) {
  const params = getSearchParams(request);
  const phone = params.get('phone');
  if (!phone) return error('Phone number is required');
  const orders = await prisma.order.findMany({
    where: { customerPhone: phone },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return success(orders);
}

export async function POST(request) {
  const body = await parseBody(request);
  if (!body?.items || !body?.amount) {
    return error('Items and amount are required');
  }
  const order = await prisma.order.create({
    data: {
      orderId: body.order_id || `ORD-${Date.now()}`,
      customerName: body.customer_name || '',
      customerPhone: body.customer_phone || '',
      customerEmail: body.customer_email || '',
      address: body.address || '',
      items: JSON.stringify(body.items),
      paymentMethod: body.payment_method || 'COD',
      amount: parseFloat(body.amount) || 0,
      handlingCharge: parseFloat(body.handling_charge) || 0,
      upiId: body.upi_id || '',
      bank: body.bank || '',
      upiApp: body.upi_app || '',
      sellerId: body.seller_id || 1,
    },
  });
  return success(order, 201);
}
