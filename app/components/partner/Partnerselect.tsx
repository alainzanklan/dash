'use client';

import { useEffect, useState } from 'react';
import { MdStore, MdSearch } from 'react-icons/md';

type Partner = { id: string; name: string; slug: string };

interface PartnerSelectProps {
  value: string | null;
  onChange: (partnerId: string | null) => void;
}

const PartnerSelect: React.FC<PartnerSelectProps> = ({ value, onChange }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => r.json())
      .then((d) => setPartners(d.partners || []));
  }, []);

  const selected = partners.find((p) => p.id === value);
  const filtered = partners.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='relative'>
      <label className='text-sm font-medium text-slate-600 block mb-1.5'>
        Partner / Supplier
      </label>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        className='w-full flex items-center gap-2 border border-slate-200 rounded-xl p-3 text-sm bg-white text-left hover:border-teal-400 transition'
      >
        <MdStore size={16} className='text-slate-400 flex-shrink-0' />
        <span className={selected ? 'text-slate-800' : 'text-slate-400'}>
          {selected ? selected.name : 'Select a partner…'}
        </span>
      </button>

      {open && (
        <div className='absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden'>
          {/* Search */}
          <div className='p-2 border-b border-slate-100'>
            <div className='flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2'>
              <MdSearch size={16} className='text-slate-400' />
              <input
                autoFocus
                type='text'
                placeholder='Search partners…'
                className='flex-1 bg-transparent text-sm outline-none'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Options */}
          <div className='max-h-48 overflow-y-auto'>
            <button
              type='button'
              onClick={() => {
                onChange(null);
                setOpen(false);
                setSearch('');
              }}
              className='w-full text-left px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-50'
            >
              — No partner
            </button>
            {filtered.map((p) => (
              <button
                key={p.id}
                type='button'
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors ${
                  p.id === value
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className='px-4 py-3 text-xs text-slate-400'>
                No partners found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Close on outside click */}
      {open && (
        <div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />
      )}
    </div>
  );
};

export default PartnerSelect;
