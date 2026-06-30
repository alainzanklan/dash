import Image from 'next/image';
import Container from '../Container';
import CartCount from './CartCount';
import UserMenu from './UserMenu';
import { Redressed } from 'next/font/google';
import Categories from './Categories';
import SearchBar from './SearchBar';

const redressed = Redressed({ subsets: ['latin'], weight: ['400'] });

// NavBar is now a simple server component — no user fetching needed.
// UserMenu reads the session client-side via useSession.
const NavBar = () => {
  return (
    <div className='sticky top-0 w-full bg-white z-30 shadow-sm'>
      <div className='py-1 border-b-[1px]'>
        <Container>
          <div className='flex items-center justify-between gap-3 md:gap-0'>
            <a href='/'>
              <Image
                src='/user1.jpg'
                alt='dash fashion logo'
                width={110}
                height={60}
                priority
                style={{ width: '110px', height: '60px', objectFit: 'contain' }}
              />
            </a>
            <div className='hidden md:block'>
              <SearchBar />
            </div>
            <div className='flex items-center gap-4 md:gap-6'>
              <CartCount />
              <UserMenu />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default NavBar;
