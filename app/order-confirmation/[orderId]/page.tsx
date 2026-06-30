import prisma from '@/libs/prismadb';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MdCheckCircle, MdShoppingBag } from 'react-icons/md';
import { TbTruckDelivery } from 'react-icons/tb';
import OrderConfirmationClient from './OrderConfirmationClient';

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(
    amount,
  );

interface OrderConfirmationPageProps {
  params: { orderId: string };
}

const OrderConfirmationPage = async ({
  params,
}: OrderConfirmationPageProps) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { user: true },
  });

  if (!order || order.userId !== currentUser.id) redirect('/');

  const address = order.address as any;
  const orderDate = new Date(order.createDate).toLocaleDateString('en-GH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='max-w-2xl mx-auto px-4 py-12'>
      {/* Clears cart after page mounts — not before redirect */}
      <OrderConfirmationClient />

      {/* Success header */}
      <div className='flex flex-col items-center text-center mb-10'>
        <div className='w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4'>
          <MdCheckCircle size={40} className='text-emerald-500' />
        </div>
        <h1 className='text-2xl font-semibold text-slate-800 mb-1'>
          Order Confirmed!
        </h1>
        <p className='text-sm text-slate-400'>
          We've sent a confirmation email to{' '}
          <span className='font-medium text-slate-600'>
            {currentUser.email}
          </span>
        </p>
      </div>

      {/* Order card */}
      <div className='border border-slate-200 rounded-2xl overflow-hidden shadow-sm'>
        {/* Meta */}
        <div className='bg-slate-50 border-b border-slate-200 px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4'>
          <div>
            <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
              Order ID
            </p>
            <p className='text-sm font-semibold text-slate-800'>
              #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div>
            <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
              Date
            </p>
            <p className='text-sm text-slate-700'>{orderDate}</p>
          </div>
          <div>
            <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
              Status
            </p>
            <span className='inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600'>
              {order.deliveryStatus ?? 'Pending'}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className='px-6 py-5 flex flex-col gap-4'>
          <h2 className='text-sm font-semibold text-slate-700'>Items</h2>
          {(order.products as any[]).map((item, i) => (
            <div key={i} className='flex items-center gap-4'>
              {item.selectedImg?.image && (
                <img
                  src={item.selectedImg.image}
                  alt={item.name}
                  className='w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0'
                />
              )}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-slate-800 truncate'>
                  {item.name}
                </p>
                {item.selectedImg?.color && (
                  <p className='text-xs text-slate-400'>
                    Color: {item.selectedImg.color}
                  </p>
                )}
                <p className='text-xs text-slate-400'>Qty: {item.quantity}</p>
              </div>
              <p className='text-sm font-semibold text-slate-800 flex-shrink-0'>
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className='border-t border-slate-100 px-6 py-4 flex justify-between items-center'>
          <span className='text-sm font-semibold text-slate-700'>Total</span>
          <span className='text-base font-bold text-emerald-600'>
            {formatPrice(order.amount)}
          </span>
        </div>

        {/* Delivery address */}
        {address && (
          <div className='border-t border-slate-100 px-6 py-4'>
            <div className='flex items-center gap-2 mb-2'>
              <TbTruckDelivery size={18} className='text-slate-400' />
              <h2 className='text-sm font-semibold text-slate-700'>
                Delivery Address
              </h2>
            </div>
            <p className='text-sm text-slate-500 leading-relaxed'>
              {address.name && (
                <span className='font-medium text-slate-700'>
                  {address.name}
                  <br />
                </span>
              )}
              {address.phone && (
                <span>
                  {address.phone}
                  <br />
                </span>
              )}
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ''}
              <br />
              {address.city}
              {address.state ? `, ${address.state}` : ''}
              <br />
              {address.country}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-3 mt-6'>
        <Link
          href='/orders'
          className='flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors'
        >
          <MdShoppingBag size={18} />
          View all orders
        </Link>
        <Link
          href='/'
          className='flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl py-3 text-sm font-medium text-white transition-colors'
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
