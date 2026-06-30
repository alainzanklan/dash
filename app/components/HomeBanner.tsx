import Image from 'next/image';

const HomeBanner = () => {
  return (
    <div className='relative w-full overflow-hidden mb-4 min-h-[400px] md:min-h-[500px] flex items-center rounded-xl'>
      {/* Background Image */}
      <Image
        src='/user2.jpeg'
        fill
        priority
        alt='Made in Ghana fashion background'
        className='object-cover z-0'
      />

      {/* Dark Overlay for Text Readability */}
      <div className='absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent z-10' />

      {/* Content Container */}
      <div className='relative z-20 w-full px-4 py-12 md:px-20 md:py-26'>
        <div className='text-left max-w-xl md:max-w-2xl'>
          <span className='inline-block text-xs sm:text-sm font-medium tracking-widest uppercase text-amber-400 mb-2'>
            Proudly Made in Ghana
          </span>
          <h1 className='text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-2 md:mb-4 leading-tight'>
            Timeless Elegance,
            <br className='hidden sm:block' /> Crafted with Grace
          </h1>
          <p className='text-sm sm:text-lg md:text-xl text-stone-200 mb-4 md:mb-6'>
            Contemporary Ghanaian womenswear designed to stand out.
          </p>
          <p className='text-base sm:text-xl md:text-3xl font-bold text-amber-400 uppercase tracking-wider cursor-pointer hover:text-amber-300 transition-colors'>
            Shop the New Collection
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
