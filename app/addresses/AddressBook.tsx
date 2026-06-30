'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  MdHome,
  MdWork,
  MdLocationOn,
  MdAdd,
  MdEdit,
  MdDelete,
  MdCheck,
  MdArrowBack,
} from 'react-icons/md';
import toast from 'react-hot-toast';
import Heading from '../components/Heading';

type SavedAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
};

const ghanaRegions: Record<string, string[]> = {
  'Greater Accra': [
    'Accra',
    'Tema',
    'Madina',
    'Adenta',
    'Ashaiman',
    'Teshie',
    'Nungua',
    'Spintex',
    'East Legon',
    'East Legon Hills',
    'Legon',
    'Achimota',
    'Dome',
    'Haatso',
    'Agbogba',
    'Kwabenya',
    'Abokobi',
    'Dodowa',
    'Prampram',
    'Kpone',
    'Lashibi',
    'Sakumono',
    'Abelemkpe',
    'Airport Residential Area',
    'Abeka',
    'Ablekuma',
    'Adabraka',
    'Akweteyman',
    'Amasaman',
    'Achiaman',
    'Awoshie',
    'Bubiashie',
    'Dansoman',
    'Darkuman',
    'Dzorwulu',
    'Gbawe',
    'James Town',
    'Kanda',
    'Kaneshie',
    'Kokomlemle',
    'Korle Bu',
    'Kwashieman',
    'Labadi',
    'Lapaz',
    'Lartebiokorshie',
    'Makola',
    'Mallam',
    'Mamprobi',
    'Nima',
    'North Ridge',
    'Odokor',
    'Ofankor',
    'Osu',
    'Oyarifa',
    'Pantang',
    'Ridge',
    'Roman Ridge',
    'Santa Maria',
    'Shiashie',
    'Sowutuom',
    'Taifa',
    'Weija',
  ],
  Ashanti: [
    'Kumasi',
    'Obuasi',
    'Ejisu',
    'Konongo',
    'Mampong',
    'Bekwai',
    'Agogo',
    'Offinso',
    'Suame',
    'Adum',
    'Bantama',
    'Asokwa',
    'Kwadaso',
    'Oforikrom',
  ],
  Western: [
    'Takoradi',
    'Sekondi',
    'Tarkwa',
    'Axim',
    'Prestea',
    'Bogoso',
    'Shama',
  ],
  'Western North': ['Sefwi Wiawso', 'Bibiani', 'Enchi', 'Juabeso'],
  Central: [
    'Cape Coast',
    'Kasoa',
    'Winneba',
    'Mankessim',
    'Assin Fosu',
    'Swedru',
    'Saltpond',
    'Elmina',
  ],
  Eastern: [
    'Koforidua',
    'Nkawkaw',
    'Suhum',
    'Nsawam',
    'Akosombo',
    'Akim Oda',
    'Aburi',
    'Somanya',
  ],
  Volta: ['Ho', 'Hohoe', 'Keta', 'Aflao', 'Sogakope', 'Akatsi'],
  Oti: ['Dambai', 'Kadjebi', 'Jasikan', 'Nkwanta'],
  Bono: ['Sunyani', 'Berekum', 'Dormaa Ahenkro', 'Wenchi'],
  'Bono East': ['Techiman', 'Nkoranza', 'Kintampo', 'Atebubu'],
  Ahafo: ['Goaso', 'Kukuom', 'Bechem'],
  Northern: ['Tamale', 'Yendi', 'Savelugu', 'Gushegu', 'Sagnarigu'],
  Savannah: ['Damongo', 'Bole', 'Sawla', 'Salaga'],
  'North East': ['Nalerigu', 'Gambaga', 'Walewale'],
  'Upper East': ['Bolgatanga', 'Navrongo', 'Bawku', 'Zebilla', 'Paga'],
  'Upper West': ['Wa', 'Lawra', 'Jirapa', 'Nandom'],
};

const labelIcons: Record<string, any> = {
  Home: MdHome,
  Office: MdWork,
  Other: MdLocationOn,
};
const inputClass =
  'w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-sky-400 transition bg-white';
const labelClass = 'text-sm font-medium text-slate-600';
const emptyForm = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: 'Greater Accra',
  country: 'Ghana',
  isDefault: false,
};

const AddressBook = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromCheckout = searchParams?.get('from') === 'checkout';

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  // Auto-open form if coming from checkout with no addresses yet
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/profile/addresses');
      const data = await res.json();
      const addrs = data.addresses || [];
      setAddresses(addrs);
      // Auto-open form if coming from checkout and no addresses exist
      if (fromCheckout && addrs.length === 0) {
        setShowForm(true);
      }
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const citiesForRegion = ghanaRegions[form.state] ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch('/api/profile/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editingId ? 'Address updated' : 'Address saved');
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);

        // If came from checkout, redirect back immediately after saving
        if (fromCheckout) {
          router.push('/checkout');
          return;
        }

        fetchAddresses();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await fetch(`/api/profile/addresses?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Address deleted');
        fetchAddresses();
      } else toast.error('Failed to delete');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch('/api/profile/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDefault: true }),
      });
      if (res.ok) {
        toast.success('Default address updated');
        fetchAddresses();
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          {fromCheckout && (
            <button
              type='button'
              onClick={() => router.push('/checkout')}
              className='flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2'
            >
              <MdArrowBack size={16} /> Back to checkout
            </button>
          )}
          <Heading
            title='Address Book'
            subtitle={
              fromCheckout
                ? 'Add an address to complete your order'
                : 'Manage your delivery addresses'
            }
          />
        </div>
        {!showForm && (
          <button
            type='button'
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm(emptyForm);
            }}
            className='flex items-center gap-2 bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors'
          >
            <MdAdd size={18} /> Add Address
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6'>
          <h2 className='font-semibold text-slate-800 mb-4'>
            {editingId ? 'Edit Address' : 'New Address'}
          </h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {/* Label */}
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>Label</label>
              <div className='flex gap-2'>
                {['Home', 'Office', 'Other'].map((l) => {
                  const Icon = labelIcons[l] || MdLocationOn;
                  return (
                    <button
                      key={l}
                      type='button'
                      onClick={() => setForm((f) => ({ ...f, label: l }))}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.label === l
                          ? 'border-sky-400 bg-sky-50 text-sky-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={16} />
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1 sm:col-span-2'>
                <label className={labelClass}>Full Name *</label>
                <input
                  type='text'
                  required
                  className={inputClass}
                  placeholder='Recipient name'
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className='flex flex-col gap-1 sm:col-span-2'>
                <label className={labelClass}>Phone Number *</label>
                <input
                  type='tel'
                  required
                  className={inputClass}
                  placeholder='e.g. 024 000 0000'
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className={labelClass}>Region *</label>
                <select
                  required
                  className={inputClass}
                  value={form.state}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, state: e.target.value, city: '' }))
                  }
                >
                  {Object.keys(ghanaRegions).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-1'>
                <label className={labelClass}>City / Town *</label>
                <select
                  required
                  className={inputClass}
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                >
                  <option value='' disabled>
                    Select city
                  </option>
                  {citiesForRegion.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-1 sm:col-span-2'>
                <label className={labelClass}>Street / Landmark *</label>
                <input
                  type='text'
                  required
                  className={inputClass}
                  placeholder='e.g. Near Total filling station'
                  value={form.line1}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, line1: e.target.value }))
                  }
                />
              </div>
              <div className='flex flex-col gap-1 sm:col-span-2'>
                <label className={labelClass}>
                  Additional Info{' '}
                  <span className='text-slate-400 font-normal'>(optional)</span>
                </label>
                <input
                  type='text'
                  className={inputClass}
                  placeholder='Apartment, floor…'
                  value={form.line2}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, line2: e.target.value }))
                  }
                />
              </div>
              <div className='flex items-center gap-2 sm:col-span-2'>
                <input
                  type='checkbox'
                  id='isDefault'
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isDefault: e.target.checked }))
                  }
                  className='w-4 h-4 accent-sky-700'
                />
                <label htmlFor='isDefault' className='text-sm text-slate-600'>
                  Set as default address
                </label>
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              {!fromCheckout && (
                <button
                  type='button'
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className='px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors'
                >
                  Cancel
                </button>
              )}
              <button
                type='submit'
                disabled={saving}
                className='px-6 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 disabled:bg-slate-200 text-white text-sm font-medium transition-colors'
              >
                {saving
                  ? 'Saving...'
                  : fromCheckout
                    ? 'Save & Go to Checkout'
                    : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address list */}
      {loading ? (
        <div className='flex flex-col gap-3'>
          {[1, 2].map((i) => (
            <div
              key={i}
              className='h-32 rounded-2xl bg-slate-100 animate-pulse'
            />
          ))}
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className='text-center py-16 text-slate-400'>
          <MdLocationOn size={40} className='mx-auto mb-2 opacity-30' />
          <p className='text-sm'>No saved addresses yet</p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {addresses.map((addr) => {
            const Icon = labelIcons[addr.label] || MdLocationOn;
            return (
              <div
                key={addr.id}
                className={`bg-white border-2 rounded-2xl p-5 shadow-sm transition-all ${
                  addr.isDefault ? 'border-sky-400' : 'border-slate-200'
                }`}
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        addr.isDefault ? 'bg-sky-100' : 'bg-slate-100'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          addr.isDefault ? 'text-sky-600' : 'text-slate-500'
                        }
                      />
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold text-slate-800 text-sm'>
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className='text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full font-medium'>
                            Default
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-slate-600 mt-0.5'>
                        {addr.name} · {addr.phone}
                      </p>
                      <p className='text-xs text-slate-400 mt-0.5'>
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city},{' '}
                        {addr.state}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-1 flex-shrink-0'>
                    {!addr.isDefault && (
                      <button
                        type='button'
                        onClick={() => handleSetDefault(addr.id)}
                        title='Set as default'
                        className='p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-sky-700 transition-colors'
                      >
                        <MdCheck size={18} />
                      </button>
                    )}
                    <button
                      type='button'
                      onClick={() => handleEdit(addr)}
                      className='p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors'
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(addr.id)}
                      className='p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors'
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
                {/* If from checkout, allow selecting this address to go back */}
                {fromCheckout && (
                  <button
                    type='button'
                    onClick={() => router.push('/checkout')}
                    className='mt-3 w-full text-center text-xs text-sky-600 hover:text-sky-700 font-medium'
                  >
                    Use this address & go to checkout
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddressBook;
