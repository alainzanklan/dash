'use client';

import Status from '@/app/components/Status';
import { formatPrice } from '@/utils/formatPrice';
import { Order } from '@/prisma/generated/client';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import {
  MdAccessTimeFilled,
  MdArrowBack,
  MdDeliveryDining,
  MdDone,
  MdLocationOn,
} from 'react-icons/md';
import { TbPackage } from 'react-icons/tb';
import OrderItem from './OrderItem';

interface OrderDetailsProps {
  order: Order;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const paymentStatusMap: Record<string, JSX.Element> = {
  pending: (
    <Status
      text='Pending'
      icon={MdAccessTimeFilled}
      bg='bg-amber-100'
      color='text-amber-700'
    />
  ),
  complete: (
    <Status
      text='Completed'
      icon={MdDone}
      bg='bg-teal-100'
      color='text-teal-700'
    />
  ),
};

const deliveryStatusMap: Record<string, JSX.Element> = {
  pending: (
    <Status
      text='Pending'
      icon={MdAccessTimeFilled}
      bg='bg-slate-100'
      color='text-slate-600'
    />
  ),
  dispatched: (
    <Status
      text='Dispatched'
      icon={MdDeliveryDining}
      bg='bg-purple-100'
      color='text-purple-700'
    />
  ),
  delivered: (
    <Status
      text='Delivered'
      icon={MdDone}
      bg='bg-teal-100'
      color='text-teal-700'
    />
  ),
};

// ─── Delivery progress bar ────────────────────────────────────────────────────

const steps = ['pending', 'dispatched', 'delivered'];
const stepLabels = ['Order Placed', 'Dispatched', 'Delivered'];

const DeliveryProgress = ({ status }: { status: string | null }) => {
  const currentStep = steps.indexOf(status ?? 'pending');
  return (
    <div className='flex items-center gap-0 w-full'>
      {steps.map((_, i) => (
        <div key={i} className='flex items-center flex-1 last:flex-none'>
          <div className='flex flex-col items-center gap-1'>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= currentStep
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i < currentStep ? <MdDone size={16} /> : i + 1}
            </div>
            <span className='text-xs text-slate-500 whitespace-nowrap'>
              {stepLabels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${
                i < currentStep ? 'bg-teal-400' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const router = useRouter();
  const address = order.address as any;

  return (
    <div className='max-w-3xl mx-auto py-8 px-4 flex flex-col gap-5'>
      {/* Back + Header */}
      <div className='flex items-center gap-3'>
        <button
          onClick={() => router.back()}
          className='flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-800 flex-shrink-0'
          aria-label='Go back'
        >
          <MdArrowBack size={18} />
        </button>
        <div>
          <h1 className='text-xl md:text-2xl font-semibold text-slate-800'>
            Order Details
          </h1>
          <p className='text-sm text-slate-400 mt-0.5'>
            #{order.id.slice(-8).toUpperCase()} · Placed{' '}
            {moment(order.createDate).fromNow()}
          </p>
        </div>
      </div>

      {/* Delivery progress */}
      <div className='bg-white border border-slate-200 rounded-2xl p-5 shadow-sm'>
        <h2 className='text-sm font-semibold text-slate-700 mb-5'>
          Delivery Progress
        </h2>
        <DeliveryProgress status={order.deliveryStatus} />
      </div>

      {/* Status cards */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
          <p className='text-xs text-slate-400 uppercase tracking-wider mb-2'>
            Payment
          </p>
          {paymentStatusMap[order.status] ?? (
            <span className='text-sm text-slate-500'>—</span>
          )}
        </div>
        <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
          <p className='text-xs text-slate-400 uppercase tracking-wider mb-2'>
            Delivery
          </p>
          {deliveryStatusMap[order.deliveryStatus ?? 'pending'] ?? (
            <span className='text-sm text-slate-500'>—</span>
          )}
        </div>
      </div>

      {/* Products */}
      <div className='bg-white border border-slate-200 rounded-2xl p-5 shadow-sm'>
        <div className='flex items-center gap-2 mb-4'>
          <TbPackage size={18} className='text-slate-400' />
          <h2 className='text-sm font-semibold text-slate-700'>
            Items Ordered
          </h2>
        </div>

        <div className='grid grid-cols-5 text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100'>
          <div className='col-span-2'>Product</div>
          <div className='text-center'>Price</div>
          <div className='text-center'>Qty</div>
          <div className='text-right'>Total</div>
        </div>

        {order.products?.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}

        <div className='flex justify-between items-center pt-4 border-t border-slate-100 mt-2'>
          <span className='text-sm font-semibold text-slate-700'>
            Order Total
          </span>
          <span className='text-base font-bold text-teal-600'>
            {formatPrice(order.amount)}
          </span>
        </div>
      </div>

      {/* Delivery address */}
      {address && (
        <div className='bg-white border border-slate-200 rounded-2xl p-5 shadow-sm'>
          <div className='flex items-center gap-2 mb-3'>
            <MdLocationOn size={18} className='text-slate-400' />
            <h2 className='text-sm font-semibold text-slate-700'>
              Delivery Address
            </h2>
          </div>
          <p className='text-sm text-slate-500 leading-relaxed'>
            {address.phone}
            <br />
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
  );
};

export default OrderDetails;
