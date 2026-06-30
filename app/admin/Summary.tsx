'use client';

import { Order, Product, User } from '@/prisma/generated/client';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/formatPrice';
import { FormatNumber } from '@/utils/FormatNumber';
import {
  MdAttachMoney,
  MdInventory,
  MdShoppingBag,
  MdCheckCircle,
  MdPending,
  MdPeople,
} from 'react-icons/md';

interface SummaryProps {
  orders: Order[];
  products: Product[];
  users: User[];
}

const Summary: React.FC<SummaryProps> = ({ orders, products, users }) => {
  const totalSale = orders.reduce(
    (acc, o) => (o.status === 'complete' ? acc + o.amount : acc),
    0,
  );
  const paidOrders = orders.filter((o) => o.status === 'complete').length;
  const unpaidOrders = orders.filter((o) => o.status === 'pending').length;

  const cards = [
    {
      label: 'Total Revenue',
      value: formatPrice(totalSale),
      icon: MdAttachMoney,
      bg: 'bg-slate-50',
      iconColor: 'text-slate-500',
    },
    {
      label: 'Total Orders',
      value: FormatNumber(orders.length),
      icon: MdShoppingBag,
      bg: 'bg-slate-50',
      iconColor: 'text-slate-500',
    },
    {
      label: 'Paid Orders',
      value: FormatNumber(paidOrders),
      icon: MdCheckCircle,
      bg: 'bg-slate-50',
      iconColor: 'text-slate-500',
    },
    {
      label: 'Unpaid Orders',
      value: FormatNumber(unpaidOrders),
      icon: MdPending,
      bg: 'bg-slate-50',
      iconColor: 'text-slate-500',
    },
    {
      label: 'Total Products',
      value: FormatNumber(products.length),
      icon: MdInventory,
      bg: 'bg-slate-50',
      iconColor: 'text-slate-500',
    },
    {
      label: 'Total Users',
      value: FormatNumber(users.length),
      icon: MdPeople,
      bg: 'bg-slate-50',
      iconColor: 'text-slate-500',
    },
  ];

  return (
    <div>
      <h2 className='text-lg font-semibold text-slate-800 mb-4'>Overview</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {cards.map(({ label, value, icon: Icon, bg, iconColor }) => (
          <div
            key={label}
            className='bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4'
          >
            <div>
              <p className='text-lg font-bold text-slate-800'>{value}</p>
              <p className='text-xs text-slate-400 mb-0.5'>{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
