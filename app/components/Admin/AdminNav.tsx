'use client';

import Link from 'next/link';
import AdminNavItem from './AdminNavItem';
import {
  MdDashboard,
  MdDns,
  MdFormatListBulleted,
  MdLibraryAdd,
  MdStore,
} from 'react-icons/md';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Summary', icon: MdDashboard },
  { href: '/admin/add-products', label: 'Add Products', icon: MdLibraryAdd },
  { href: '/admin/manage-products', label: 'Manage Products', icon: MdDns },
  {
    href: '/admin/manage-orders',
    label: 'Manage Orders',
    icon: MdFormatListBulleted,
  },
  { href: '/admin/manage-partners', label: 'Partners', icon: MdStore },
];

const AdminNav = () => {
  const pathname = usePathname();

  return (
    <div className='w-full bg-white border-b border-slate-100 shadow-sm sticky top-16 z-20'>
      <div className='max-w-7xl mx-auto px-4'>
        <div
          className='flex items-center gap-1 overflow-x-auto py-2'
          style={{ scrollbarWidth: 'none' }}
        >
          {links.map(({ href, label, icon }) => (
            <Link key={href} href={href}>
              <AdminNavItem
                label={label}
                icon={icon}
                selected={pathname === href}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
