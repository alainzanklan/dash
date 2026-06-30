import Image from 'next/image';

const HomeBanner = () => {
  return (
    <div className='relative bg-gradient-to-r from-stone-800 to-stone-950 mb-4 shrink-0'>
      <div className='flex flex-row items-center justify-between px-4 py-8 md:px-20 md:py-26'>
        {/* Text */}
        <div className='text-left flex-1'>
          <span className='hidden text-xs sm:text-sm font-medium tracking-widest uppercase text-amber-400 mb-2'>
            Proudly Made in Ghana
          </span>
          <h1 className='text-xl sm:text-4xl md:text-6xl font-bold text-white mb-2 md:mb-4 leading-tight'>
            Timeless Elegance,
            <br className='hidden sm:block' /> Crafted with Grace
          </h1>
          <p className='text-xs sm:text-base md:text-xl text-stone-300 mb-3 md:mb-5 max-w-md'>
            Contemporary Ghanaian womenswear designed to stand out.
          </p>
          <p className='text-base sm:text-2xl md:text-4xl font-bold text-amber-400'>
            Shop the New Collection
          </p>
        </div>

        {/* Image */}
        <div className='relative w-36 h-36 sm:w-40 sm:h-40 md:w-96 md:h-96 flex-shrink-0'>
          <Image
            src='/user2.png'
            fill
            alt='Made in Ghana fashion'
            className='object-contain'
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
