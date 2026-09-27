import Image from 'next/image';
import Link from 'next/link';

interface CategoryBannerProps {
  name: string;
  categoryValue: string;
  tagline: string;
  image: string;
  reverse?: boolean;
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({
  name,
  categoryValue,
  tagline,
  image,
  reverse = false,
}) => {
  return (
    <div
      className={`flex flex-col ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-stretch w-full min-h-[380px] md:min-h-[460px] rounded-2xl overflow-hidden bg-stone-50`}
    >
      {/* Image */}
      <div className='relative w-full md:w-1/2 min-h-[260px] md:min-h-full'>
        <Image
          src={image}
          alt={name}
          fill
          sizes='(max-width: 768px) 100vw, 50vw'
          className='object-cover'
        />
      </div>

      {/* Text */}
      <div className='w-full md:w-1/2 flex items-center justify-center px-6 py-10 md:px-14'>
        <div className='max-w-md'>
          <span className='inline-block text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-amber-700 mb-3'>
            Shop the Edit
          </span>
          <h3 className='text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight'>
            {name}
          </h3>
          <p className='text-sm sm:text-base text-stone-600 mb-6 leading-relaxed'>
            {tagline}
          </p>
          <Link
            href={`/?category=${encodeURIComponent(categoryValue)}`}
            className='inline-block text-sm font-semibold tracking-wide uppercase text-white bg-stone-900 px-7 py-3 rounded-full hover:bg-amber-700 transition-colors duration-300'
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;
