'use client';

import { categories } from '@/utils/Categories';
import Container from '../Container';
import Category from './Category';
import { useSearchParams, usePathname } from 'next/navigation';

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();

  const isMainPage = pathname === '/';
  if (!isMainPage) return null;

  return (
    <div className='px-2bg-white border-b border-zinc-100'>
      <Container>
        <div className=' py-5 flex items-start md:justify-between gap-5 sm:gap-7 overflow-x-auto scrollbar-hide'>
          {categories.map((item) => (
            <Category
              key={item.label}
              label={item.label}
              image={item.image}
              selected={
                category === item.label ||
                (category === null && item.label === 'All')
              }
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
