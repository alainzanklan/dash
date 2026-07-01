'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import Heading from '../components/Heading';
import Button from '../components/Button';
import ItemContent from './ItemContent';
import { formatPrice } from '@/utils/formatPrice';
import { SafeUser } from '@/types';
import { useRouter } from 'next/navigation';

interface CartClientProps {
  currentUser: SafeUser | null;
}

const CartClient: React.FC<CartClientProps> = ({ currentUser }) => {
  const { cartProducts, handleClearCart, cartTotalAmount } = useCart();
  const router = useRouter();

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className='flex flex-col items-center py-16'>
        <div className='text-2xl font-semibold text-slate-700'>
          Your bag is empty
        </div>
        <Link href='/' className='text-slate-500 flex items-center gap-1 mt-3'>
          <MdArrowBack />
          <span>Start shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <Heading title='Shopping Bag' center />

      <div className='hidden sm:grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8 text-slate-500 uppercase tracking-wide'>
        <div className='col-span-2'>Product</div>
        <div className='sm:text-center'>Price</div>
        <div className='text-center'>Quantity</div>
        <div className='text-right'>Total</div>
      </div>

      <div className='mt-4 sm:mt-0'>
        {cartProducts.map((item) => (
          <ItemContent key={item.id} item={item} />
        ))}
      </div>

      <div className='border-t border-slate-200 pt-6 mt-4 flex flex-col sm:flex-row sm:justify-between gap-6'>
        <div className='w-full sm:w-[120px]'>
          <Button label='Clear Bag' onClick={handleClearCart} small outline />
        </div>
        <div className='flex flex-col gap-3 w-full sm:w-72'>
          <div className='flex justify-between text-base font-semibold'>
            <span>Subtotal</span>
            <span>{formatPrice(cartTotalAmount)}</span>
          </div>
          <p className='text-slate-400 text-xs'>
            Taxes and shipping calculated at checkout
          </p>
          <Button
            label={
              currentUser
                ? `Checkout (${formatPrice(cartTotalAmount)})`
                : 'Login To Order'
            }
            outline={!currentUser}
            onClick={() => router.push(currentUser ? '/checkout' : '/login')}
          />
          <Link
            href='/'
            className='text-slate-500 flex items-center gap-1 text-sm'
          >
            <MdArrowBack size={16} />
            <span>Continue shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
