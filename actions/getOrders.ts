import prisma from '@/libs/prismadb';
import { Order, User } from '@/prisma/generated/client';

export type ExtendedOrder = Order & { user: User };

export default async function getOrders(): Promise<ExtendedOrder[]> {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createDate: 'desc' },
    });

    // Filter out any orders where user relation is null (shouldn't happen but satisfies TS)
    return orders.filter((o): o is ExtendedOrder => o.user !== null);
  } catch (error: any) {
    console.error('getOrders error:', error?.message ?? error);
    return [];
  }
}
