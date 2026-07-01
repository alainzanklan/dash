'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useCallback } from 'react';

interface CategoryProps {
  label: string;
  image: string;
  selected?: boolean;
}

const Category: React.FC<CategoryProps> = ({ label, image, selected }) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    if (label === 'All') {
      router.push('/');
      return;
    }

    let currentQuery = {};
    if (params) {
      currentQuery = queryString.parse(params.toString());
    }

    const updatedQuery: any = { ...currentQuery, category: label };

    const url = queryString.stringifyUrl(
      { url: '/', query: updatedQuery },
      { skipNull: true },
    );

    router.push(url);
  }, [label, params, router]);

  return (
    <button
      onClick={handleClick}
      className='flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group'
    >
      {/* Square image tile — SHEIN-style with soft rounded corners */}
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden transition-all duration-200 shadow-inner ${
          selected
            ? 'ring-2 ring-zinc-900 ring-offset-2'
            : 'ring-1 ring-zinc-200 group-hover:ring-zinc-400'
        }`}
      >
        <Image
          src={image}
          alt={label}
          fill
          sizes='80px'
          className='object-cover'
        />
      </div>

      {/* Label */}
      <span
        className={`text-xs whitespace-nowrap transition-colors ${
          selected
            ? 'text-zinc-900 font-medium'
            : 'text-zinc-500 group-hover:text-zinc-800'
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default Category;
