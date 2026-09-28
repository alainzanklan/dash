export const revalidate = 0;

import Container from './components/Container';
import HomeBanner from './components/HomeBanner';
import CategoryShowcase from './components/CategoryShowcase';
import NewsletterSection from './components/NewsletterSection';
import ProductCard from './components/products/ProductCard';
import getProducts, { IProductParams } from '@/actions/getProducts';
import NullData from './components/NullData';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: IProductParams;
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

// ─── Search / category results view (clean product listing) ──────────────────

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
        {/* Hero only on the true homepage — hidden for category/search/"All" views */}
        {!isSearching && (
          <Suspense fallback={null}>
            <HomeBanner />
          </Suspense>
        )}

        <div className='mt-6' id='collections'>
          {isSearching ? (
            // Category, "All", or search view — clean product listing only
            <Suspense fallback={<SectionSkeleton limit={6} />}>
              <SearchResults searchParams={searchParams} />
            </Suspense>
          ) : (
            // Default homepage — visual storefront
            <CategoryShowcase />
          )}
        </div>

        {/* Newsletter — default homepage view only, not category/search listings */}
        {!isSearching && <NewsletterSection />}
      </Container>
    </div>
  );
}
