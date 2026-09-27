import CategoryBanner from './CategoryBanner';
import { CATEGORY_BANNERS } from './categories.config';

const CategoryShowcase = () => {
  return (
    <section className='mb-14'>
      <div className='mb-8 text-center max-w-2xl mx-auto'>
        <span className='inline-block text-xs font-medium tracking-[0.2em] uppercase text-amber-700 mb-2'>
          Curated Collections
        </span>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900'>
          Shop by Category
        </h2>
      </div>

      <div className='flex flex-col gap-6 md:gap-8'>
        {CATEGORY_BANNERS.map((cat, index) => (
          <CategoryBanner
            key={cat.categoryValue}
            name={cat.name}
            categoryValue={cat.categoryValue}
            tagline={cat.tagline}
            image={cat.image}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
