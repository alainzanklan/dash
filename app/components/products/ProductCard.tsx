'use client';

import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import { useRouter } from 'next/navigation';
import { truncateText } from '@/utils/TruncateText';

interface ProductCardProps {
  data: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className='group col-span-1 cursor-pointer'
    >
      {/* Image — tall portrait, fills card edge to edge */}
      <div className='aspect-[2/3] overflow-hidden relative w-full bg-zinc-100 rounded-xl'>
        <Image
          fill
          src={data.images[0].image}
          alt={data.name}
          sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
          className='object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]'
        />
        {!data.inStock && (
          <div className='absolute inset-0 bg-white/60 flex items-end justify-center pb-4'>
            <span className='text-[11px] font-medium text-zinc-600 uppercase tracking-widest'>
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className='pt-2.5 pb-1 px-0.5 flex flex-col gap-0.5'>
        <p className='text-sm text-zinc-800 leading-snug line-clamp-2'>
          {truncateText(data.name)}
        </p>
        <p className='text-sm font-medium text-zinc-900 mt-0.5'>
          {formatPrice(data.price)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
