'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const banners = [
  {
    gradient: 'from-sky-500 to-sky-700',
    tag: 'Hello Summer!',
    description: 'Enjoy discounts on selected items',
    offer: 'GET 50% OFF',
    offerColor: 'text-yellow-400',
    image: '/user2.png',
  },
  {
    gradient: 'from-slate-700 to-slate-900',
    tag: 'Home Appliances',
    description: 'TVs, Fridges, Washing Machines & more',
    offer: 'UP TO 40% OFF',
    offerColor: 'text-teal-400',
    image: '/user2.png',
  },
  {
    gradient: 'from-rose-400 to-pink-600',
    tag: 'Fashion & Accessories',
    description: 'Bags, Watches, Jewellery & more',
    offer: 'FROM $9.99',
    offerColor: 'text-yellow-300',
    image: '/user2.png',
  },
];

const HomeBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = banners[current];

  return (
    <div
      className={`relative bg-gradient-to-r ${banner.gradient} mb-4 transition-all duration-700`}
    >
      {/* Always row — text left, image right */}
      <div className='flex flex-row items-center justify-between px-4 py-6 md:px-8 md:py-12'>
        {/* Text */}
        <div className='text-left flex-1'>
          <h1 className='text-lg sm:text-3xl md:text-6xl font-bold text-white mb-1 md:mb-3'>
            {banner.tag}
          </h1>
          <p className='text-xs sm:text-sm md:text-xl text-white mb-1 md:mb-2'>
            {banner.description}
          </p>
          <p
            className={`text-base sm:text-2xl md:text-5xl font-bold ${banner.offerColor}`}
          >
            {banner.offer}
          </p>
        </div>

        {/* Image — fixed size on mobile, larger on desktop */}
        <div className='relative w-28 h-28 sm:w-40 sm:h-40 md:w-72 md:h-48 flex-shrink-0'>
          <Image
            src={banner.image}
            fill
            alt={banner.tag}
            className='object-contain'
          />
        </div>
      </div>

      {/* Dots */}
      <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-2'>
        {banners.map((_, i) => (
          <button
            key={i}
            type='button'
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${
              i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
