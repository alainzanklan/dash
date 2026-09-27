import Image from 'next/image';

const HomeBanner = () => {
  return (
    <div className='relative w-full overflow-hidden mb-6 min-h-[480px] md:min-h-[620px] flex items-center rounded-2xl'>
      {/* Background Image */}
      <Image
        src='/user2.jpeg'
        fill
        priority
        alt='Made in Ghana fashion background'
        className='object-cover z-0'
      />

      {/* Layered overlays for depth + text readability */}
      <div className='absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/60 to-transparent z-10' />
      <div className='absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent z-10' />

      {/* Content */}
      <div className='relative z-20 w-full px-6 py-14 md:px-20 md:py-0'>
        <div className='text-left max-w-xl md:max-w-2xl'>
          <span className='inline-block text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-amber-400 mb-4 border-l-2 border-amber-400 pl-3'>
            Proudly Made in Ghana
          </span>
          <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-[1.1] tracking-tight'>
            Timeless Elegance,
            <br className='hidden sm:block' /> Crafted with Grace
          </h1>
          <p className='text-sm sm:text-lg md:text-xl text-stone-300 mb-8 max-w-lg font-light'>
            Contemporary Ghanaian womenswear, designed to stand out and built to
            last.
          </p>
          <a
            href='#collections'
            className='inline-block text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase text-stone-900 bg-amber-400 px-8 py-3.5 rounded-full hover:bg-amber-300 transition-colors duration-300'
          >
            Shop the New Collection
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
