'use client';

import { useEffect, useState } from 'react';
import { MdClose, MdShoppingCart } from 'react-icons/md';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

const PartnerConflictModal = () => {
  const [open, setOpen] = useState(false);
  const [conflictingPartner, setConflictingPartner] = useState('');
  const { handleClearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setConflictingPartner(detail?.partnerName || 'another partner');
      setOpen(true);
    };
    window.addEventListener('partner-conflict', handler);
    return () => window.removeEventListener('partner-conflict', handler);
  }, []);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div className='w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center'>
            <MdShoppingCart size={20} className='text-orange-500' />
          </div>
          <button
            type='button'
            onClick={() => setOpen(false)}
            className='p-1 rounded-lg hover:bg-slate-100 text-slate-400'
          >
            <MdClose size={20} />
          </button>
        </div>

        <h2 className='text-base font-semibold text-slate-800 mb-2'>
          Different Partner Detected
        </h2>
        <p className='text-sm text-slate-500 leading-relaxed mb-6'>
          Products from different partners cannot be purchased in the same order
          at the moment. Please complete your current order first, or clear your
          cart to add products from{' '}
          <span className='font-medium text-slate-700'>
            {conflictingPartner}
          </span>
          .
        </p>

        <div className='flex gap-3'>
          <button
            type='button'
            onClick={() => setOpen(false)}
            className='flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors'
          >
            Keep current cart
          </button>
          <button
            type='button'
            onClick={() => {
              handleClearCart();
              setOpen(false);
            }}
            className='flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors'
          >
            Clear cart & add
          </button>
        </div>

        <button
          type='button'
          onClick={() => {
            setOpen(false);
            router.push('/cart');
          }}
          className='w-full mt-2 py-2 text-xs text-teal-600 hover:text-teal-700'
        >
          View current cart →
        </button>
      </div>
    </div>
  );
};

export default PartnerConflictModal;
