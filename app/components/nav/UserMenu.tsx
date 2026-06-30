'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { MdPerson } from 'react-icons/md';
import MenuItem from './MenuItem';
import { signOut, useSession } from 'next-auth/react';
import BackDrop from './BackDrop';

const UserMenu = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const isLoggedIn = !!session?.user;
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  return (
    <>
      <div className='relative z-30'>
        <div
          onClick={toggleOpen}
          className='p-2 border border-slate-200 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700'
        >
          {/* Avatar */}
          <div className='w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0'>
            {userImage ? (
              <img
                src={userImage}
                alt={userName ?? 'avatar'}
                className='w-full h-full object-cover'
                referrerPolicy='no-referrer' // required for Google images
              />
            ) : (
              <MdPerson size={18} className='text-slate-500' />
            )}
          </div>
          <AiFillCaretDown size={12} />
        </div>

        {isOpen && (
          <div className='absolute rounded-xl shadow-lg w-[190px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col z-40 border border-slate-100'>
            {isLoggedIn ? (
              <>
                {/* User info header */}
                <div className='px-4 py-3 border-b border-slate-100 flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0'>
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={userName ?? 'avatar'}
                        className='w-full h-full object-cover'
                        referrerPolicy='no-referrer'
                      />
                    ) : (
                      <MdPerson size={18} className='text-slate-500' />
                    )}
                  </div>
                  <div className='min-w-0'>
                    {userName && (
                      <p className='font-medium text-slate-800 truncate text-xs'>
                        {userName}
                      </p>
                    )}
                    {userEmail && (
                      <p className='text-xs text-slate-400 truncate'>
                        {userEmail}
                      </p>
                    )}
                  </div>
                </div>

                <Link href='/profile'>
                  <MenuItem onClick={toggleOpen}>My Profile</MenuItem>
                </Link>
                <Link href='/addresses'>
                  <MenuItem onClick={toggleOpen}>My Addresses</MenuItem>
                </Link>
                <Link href='/orders'>
                  <MenuItem onClick={toggleOpen}>My Orders</MenuItem>
                </Link>

                {isAdmin && (
                  <Link href='/admin'>
                    <MenuItem onClick={toggleOpen}>Admin Dashboard</MenuItem>
                  </Link>
                )}

                <hr className='border-slate-100' />

                <MenuItem
                  onClick={() => {
                    toggleOpen();
                    signOut({ callbackUrl: '/login' });
                  }}
                >
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <Link href='/login'>
                  <MenuItem onClick={toggleOpen}>Login</MenuItem>
                </Link>
                <Link href='/register'>
                  <MenuItem onClick={toggleOpen}>Register</MenuItem>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      {isOpen && <BackDrop onClick={toggleOpen} />}
    </>
  );
};

export default UserMenu;
