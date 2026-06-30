'use client';

import { truncateText } from '@/utils/TruncateText';
import { formatPrice } from '@/utils/formatPrice';
import { CartProductType } from '@/prisma/generated/client';
import Image from 'next/image';

interface OrderItemProps {
  item: CartProductType;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  return (
    <div className='grid grid-cols-5 text-sm gap-4 py-4 border-b border-slate-100 last:border-none items-center'>
      {/* Product */}
      <div className='col-span-2 flex items-center gap-3'>
        <div className='relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100'>
          <Image
            src={item.selectedImg.image}
            alt={item.name}
            fill
            className='object-contain'
          />
        </div>
        <div className='flex flex-col gap-0.5 min-w-0'>
          <span className='text-slate-800 font-medium text-xs md:text-sm truncate'>
            {truncateText(item.name)}
          </span>
          <span className='text-xs text-slate-400'>
            {item.selectedImg.color}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className='text-center text-slate-600 text-xs md:text-sm'>
        {formatPrice(item.price)}
      </div>

      {/* Qty */}
      <div className='text-center'>
        <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-medium'>
          {item.quantity}
        </span>
      </div>

      {/* Total */}
      <div className='text-right font-semibold text-slate-800 text-xs md:text-sm'>
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
};

export default OrderItem;
