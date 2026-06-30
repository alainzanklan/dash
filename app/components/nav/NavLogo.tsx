'use client';

import Image from 'next/image';
import { useState } from 'react';

const NavLogo = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <a href='/'>
      <div className='w-[110px] h-[65px] relative flex-shrink-0'>
        {/* Placeholder shown until image loads */}
        {!loaded && (
          <div className='w-full h-full bg-slate-100 rounded animate-pulse' />
        )}
        <Image
          src='/user1.png'
          alt='emart logo'
          fill
          priority
          onLoad={() => setLoaded(true)}
          className={`object-contain object-left transition-opacity duration-200 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </a>
  );
};

export default NavLogo;
