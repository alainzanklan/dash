'use client';

import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

const CheckoutClient = () => {
  const { cartProducts } = useCart();
  const router = useRouter();

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className='flex flex-col items-center py-16 gap-3'>
        <p className='text-xl font-semibold text-slate-700'>
          Your cart is empty
        </p>
        <Link
          href='/'
          className='text-slate-500 flex items-center gap-1 text-sm'
        >
          <MdArrowBack size={16} />
          <span>Back to shopping</span>
        </Link>
      </div>
    );
  }

  return <CheckoutForm />;
};

export default CheckoutClient;
