import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { CartProductType } from '@/app/product/[productId]/ProductDetails';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const calculateOrderAmount = (items: CartProductType[]) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0);

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, savedAddressId, paymentMethod } = body;

    // Validate items
    if (!items?.length) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // Validate and fetch the saved address
    if (!savedAddressId) {
      return NextResponse.json(
        { error: 'No delivery address selected' },
        { status: 400 },
      );
    }

    const savedAddress = await prisma.savedAddress.findFirst({
      where: { id: savedAddressId, userId: currentUser.id },
    });

    if (!savedAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Map SavedAddress → Order Address type
    const orderAddress = {
      city: savedAddress.city,
      country: savedAddress.country,
      phone: savedAddress.phone,
      line1: savedAddress.line1,
      line2: savedAddress.line2 ?? '',
      Postal_code: '',
      state: savedAddress.state,
    };

    const total = calculateOrderAmount(items);
    const status = paymentMethod === 'paystack' ? 'complete' : 'pending';

    const newOrder = await prisma.order.create({
      data: {
        user: { connect: { id: currentUser.id } },
        amount: total,
        currency: 'GHS',
        status,
        deliveryStatus: 'pending',
        products: items,
        address: orderAddress,
      },
    });

    // Send confirmation email — fire and forget
    if (currentUser.email) {
      const orderDate = new Date(newOrder.createDate).toLocaleDateString(
        'en-GH',
        {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
      );

      resend.emails
        .send({
          from: 'Emart GH <orders@emartgh.com>',
          to: currentUser.email,
          subject: `Order Confirmed – #${newOrder.id.slice(-8).toUpperCase()}`,
          react: OrderConfirmationEmail({
            customerName: savedAddress.name || currentUser.name || 'Customer',
            orderId: newOrder.id,
            orderDate,
            items: items.map((item: CartProductType) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              selectedImg: item.selectedImg,
            })),
            total,
            address: {
              line1: savedAddress.line1,
              line2: savedAddress.line2 ?? '',
              city: savedAddress.city,
              state: savedAddress.state,
              country: savedAddress.country,
            },
            paymentMethod: paymentMethod ?? 'cash',
          }),
        })
        .catch((err: any) => console.error('Email failed:', err));
    }

    return NextResponse.json({ newOrder }, { status: 200 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
