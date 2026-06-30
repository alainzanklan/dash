'use client';

import { CartProductType } from '@/app/product/[productId]/ProductDetails';

interface SetQtyProps {
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

const btnstyles =
  'border-[1.2px] border-slate-300 px-2 rounded text-center hover:bg-slate-100 transition';

const SetQuantity: React.FC<SetQtyProps> = ({
  cartCounter,
  cartProduct,
  handleQtyIncrease,
  handleQtyDecrease,
}) => {
  return (
    <div className='flex gap-4 items-center'>
      {cartCounter ? null : (
        <div className=' hidden md:flex font-semibold'>QUANTITY</div>
      )}
      <div className=' flex gap-4 items-center text-base'>
        <button onClick={handleQtyDecrease} className={btnstyles}>
          -
        </button>
      </div>
      <div>{cartProduct.quantity}</div>
      <div className=' flex gap-4 items-center text-base'>
        <button onClick={handleQtyIncrease} className={btnstyles}>
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
