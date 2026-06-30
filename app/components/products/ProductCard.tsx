'use client';

import Image from 'next/image';
import { truncateText } from '@/utils/TruncateText';
import { formatPrice } from '@/utils/formatPrice';
import { Rating } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductCardProps {
  data: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const productRating =
    data.reviews.length > 0
      ? data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
        data.reviews.length
      : 0;

  return (
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className='group col-span-1 cursor-pointer'
    >
      <div className='flex flex-col w-full gap-2.5'>
        {/* Image — taller portrait ratio, no border/padding, fills the card */}
        <div className='aspect-[3/4] overflow-hidden relative w-full rounded-lg bg-slate-50'>
          <Image
            fill
            src={data.images[0].image}
            alt={data.name}
            sizes='(max-width: 768px) 50vw, 25vw'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {/* Out of stock overlay */}
          {!data.inStock && (
            <div className='absolute inset-0 bg-white/70 flex items-center justify-center'>
              <span className='text-xs font-medium text-slate-500 uppercase tracking-wider'>
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info — left aligned like fashion editorial cards */}
        <div className='flex flex-col gap-0.5 px-0.5'>
          <p className='text-sm text-slate-700 leading-snug line-clamp-1'>
            {truncateText(data.name)}
          </p>

          {data.brand && (
            <p className='text-xs text-slate-400 uppercase tracking-wide'>
              {data.brand}
            </p>
          )}

          <div className='flex items-center justify-between mt-1'>
            <span className='text-sm font-semibold text-slate-800'>
              {formatPrice(data.price)}
            </span>
            {mounted && productRating > 0 && (
              <Rating value={productRating} readOnly size='small' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
