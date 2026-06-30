'use client';

import { Order, User } from '@/prisma/generated/client';
import { formatPrice } from '@/utils/formatPrice';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
  MdChevronRight,
} from 'react-icons/md';
import { TbPackage } from 'react-icons/tb';

interface OrdersClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & { user: User };

// ─── Status pill ──────────────────────────────────────────────────────────────

interface PillProps {
  text: string;
  bg: string;
  color: string;
  icon: React.ElementType;
}

const Pill = ({ text, bg, color, icon: Icon }: PillProps) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${color}`}
  >
    <Icon size={12} />
    {text}
  </span>
);

const paymentPill = (status: string) => {
  if (status === 'complete')
    return (
      <Pill text='Paid' bg='bg-teal-100' color='text-teal-700' icon={MdDone} />
    );
  return (
    <Pill
      text='Pending'
      bg='bg-amber-100'
      color='text-amber-700'
      icon={MdAccessTimeFilled}
    />
  );
};

const deliveryPill = (status: string | null) => {
  if (status === 'delivered')
    return (
      <Pill
        text='Delivered'
        bg='bg-teal-100'
        color='text-teal-700'
        icon={MdDone}
      />
    );
  if (status === 'dispatched')
    return (
      <Pill
        text='Dispatched'
        bg='bg-purple-100'
        color='text-purple-700'
        icon={MdDeliveryDining}
      />
    );
  return (
    <Pill
      text='Pending'
      bg='bg-slate-100'
      color='text-slate-600'
      icon={MdAccessTimeFilled}
    />
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const OrderClient: React.FC<OrdersClientProps> = ({ orders }) => {
  const router = useRouter();

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <TbPackage size={24} className='text-slate-500' />
        <h1 className='text-xl font-semibold text-slate-800'>My Orders</h1>
        <span className='ml-auto text-sm text-slate-400'>
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Order cards */}
      <div className='flex flex-col gap-3'>
        {orders.map((order) => {
          const address = order.address as any;
          return (
            <div
              key={order.id}
              onClick={() => router.push(`/order/${order.id}`)}
              className='bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition-all cursor-pointer'
            >
              <div className='flex items-start justify-between gap-4'>
                {/* Left */}
                <div className='flex flex-col gap-2 flex-1 min-w-0'>
                  {/* Order ID + date */}
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md'>
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className='text-xs text-slate-400'>
                      {moment(order.createDate).fromNow()}
                    </span>
                  </div>

                  {/* Customer (admin view) */}
                  {order.user?.name && (
                    <p className='text-sm text-slate-600'>
                      <span className='text-slate-400'>Customer: </span>
                      {order.user.name}
                    </p>
                  )}

                  {/* Address */}
                  {address?.city && (
                    <p className='text-xs text-slate-400 truncate'>
                      📍 {address.line1 ? `${address.line1}, ` : ''}
                      {address.city}
                    </p>
                  )}

                  {/* Status pills */}
                  <div className='flex items-center gap-2 flex-wrap mt-1'>
                    {paymentPill(order.status)}
                    {deliveryPill(order.deliveryStatus)}
                  </div>
                </div>

                {/* Right — amount + chevron */}
                <div className='flex flex-col items-end gap-2 flex-shrink-0'>
                  <span className='text-base font-bold text-slate-800'>
                    {formatPrice(order.amount)}
                  </span>
                  <MdChevronRight size={20} className='text-slate-300' />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className='flex flex-col items-center py-20 text-slate-400 gap-3'>
          <TbPackage size={48} className='text-slate-200' />
          <p className='text-sm'>No orders yet</p>
        </div>
      )}
    </div>
  );
};

export default OrderClient;
