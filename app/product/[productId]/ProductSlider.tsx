'use client';

import { useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import RelatedProductCard from '@/app/components/products/RelatedProductCard';

interface SliderProps {
  products: any[];
  category: string;
}

function ProductSlider({ products, category }: SliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-slate-800'>
          More in {category}
        </h2>
        <div className='flex gap-1'>
          <button
            type='button'
            onClick={() => scroll('left')}
            className='p-1.5 rounded-full border border-slate-200 hover:border-slate-400 transition-colors'
          >
            <MdChevronLeft size={20} className='text-slate-600' />
          </button>
          <button
            type='button'
            onClick={() => scroll('right')}
            className='p-1.5 rounded-full border border-slate-200 hover:border-slate-400 transition-colors'
          >
            <MdChevronRight size={20} className='text-slate-600' />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className='flex gap-3 overflow-x-auto pb-2'
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className='flex-shrink-0 w-40 sm:w-48'>
            <RelatedProductCard data={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export { ProductSlider };
