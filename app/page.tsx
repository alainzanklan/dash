export const revalidate = 0;

import Container from './components/Container';
import HomeBanner from './components/HomeBanner';
import ProductCard from './components/products/ProductCard';
import getProducts, { IProductParams } from '@/actions/getProducts';
import NullData from './components/NullData';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: IProductParams;
}

// ─── Section config ───────────────────────────────────────────────────────────

const sections = [
  {
    title: 'Latest Products',
    subtitle: 'Fresh arrivals just for you',
    category: null,
    limit: 6,
  },
  {
    title: 'Top Selling',
    subtitle: 'Most loved by our customers',
    category: null,
    limit: 6,
  },
  {
    title: 'TVs',
    subtitle: 'Big screens, better experience',
    category: 'TV',
    limit: 6,
  },
  {
    title: 'Fridges & Freezers',
    subtitle: 'Keep it cool at home',
    category: 'Fridge',
    limit: 6,
  },
  {
    title: 'Laptop Bags',
    subtitle: 'Carry in style',
    category: 'Laptop Bag',
    limit: 6,
  },
];

// ─── Section banner ───────────────────────────────────────────────────────────

function SectionBanner({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className='bg-gray-100 rounded-xl px-6 py-4 mb-4'>
      <h2 className='text-black font-bold text-lg md:text-2xl'>{title}</h2>
      <p className='text-gray-500 text-xs md:text-sm'>{subtitle}</p>
    </div>
  );
}

// ─── Product section ──────────────────────────────────────────────────────────

async function ProductSection({
  title,
  subtitle,
  category,
  limit,
}: (typeof sections)[number]) {
  const products = await getProducts(category ? { category } : {});

  if (products.length === 0) return null;

  const displayed = products.slice(0, limit);

  return (
    <section className='mb-10'>
      <SectionBanner title={title} subtitle={subtitle} />
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 md:gap-4'>
        {displayed.map((product: any) => (
          <ProductCard data={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SectionSkeleton({ limit }: { limit: number }) {
  return (
    <div className='mb-10'>
      <div className='h-16 rounded-xl bg-gray-100 animate-pulse mb-4' />
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4'>
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className='aspect-square rounded-lg bg-gray-100 animate-pulse'
          />
        ))}
      </div>
    </div>
  );
}

// ─── Search results view ──────────────────────────────────────────────────────

async function SearchResults({
  searchParams,
}: {
  searchParams: IProductParams;
}) {
  const products = await getProducts(searchParams);

  if (products.length === 0) {
    return <NullData title="No products found. Click 'All' to clear filters" />;
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 md:gap-4'>
      {products.map((product: any) => (
        <ProductCard data={product} key={product.id} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home({ searchParams }: HomeProps) {
  const isSearching = searchParams?.category || searchParams?.searchItem;

  return (
    <div>
      <Container>
        <Suspense fallback={null}>
          <HomeBanner />
        </Suspense>

        <div className='mt-6'>
          {isSearching ? (
            // User clicked a category or searched — show filtered results only
            <Suspense fallback={<SectionSkeleton limit={6} />}>
              <SearchResults searchParams={searchParams} />
            </Suspense>
          ) : (
            // Default homepage — show all sections
            sections.map((section) => (
              <Suspense
                key={section.title}
                fallback={<SectionSkeleton limit={section.limit} />}
              >
                <ProductSection {...section} />
              </Suspense>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}
