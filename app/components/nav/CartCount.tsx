'use client';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { TbShoppingBag } from 'react-icons/tb';

const CartCount = () => {
  const { cartTotalQty } = useCart();
  const router = useRouter();
  return (
    <div
      className='relative cursor-pointer'
      onClick={() => router.push('/cart')}
    >
      <div className='text-3xl'>
        <TbShoppingBag />
      </div>
      {cartTotalQty > 0 && (
        <span
          className={`absolute top-[10px] right-[-10px] bg-sky-700 text-white h-6 w-6 rounded-full flex items-center justify-center text-sm`}
        >
          {`${cartTotalQty}`}
        </span>
      )}
    </div>
  );
};

export default CartCount;
