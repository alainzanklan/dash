'use client';

import { useState } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdStore,
  MdCheck,
  MdClose,
} from 'react-icons/md';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Partner = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  isActive: boolean;
  _count?: { products: number };
};

const inputClass =
  'w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-400 transition bg-white';
const labelClass = 'text-sm font-medium text-slate-600';
const emptyForm = {
  name: '',
  logo: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  isActive: true,
};

interface Props {
  partners: Partner[];
}

const ManagePartnersClient: React.FC<Props> = ({ partners: initial }) => {
  const router = useRouter();
  const [partners, setPartners] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const refresh = () => router.refresh();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch('/api/partners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingId ? 'Partner updated' : 'Partner created');
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        refresh();
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Partner) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      logo: p.logo || '',
      description: p.description || '',
      phone: p.phone || '',
      whatsapp: p.whatsapp || '',
      email: p.email || '',
      isActive: p.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner? Products will be unlinked.')) return;
    const res = await fetch(`/api/partners?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Partner deleted');
      refresh();
    } else toast.error('Failed to delete');
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    const res = await fetch('/api/partners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    if (res.ok) {
      toast.success('Status updated');
      refresh();
    }
  };

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-slate-800'>
            Manage Partners
          </h2>
          <p className='text-sm text-slate-400'>{partners.length} partners</p>
        </div>
        <button
          type='button'
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className='flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors'
        >
          <MdAdd size={18} /> Add Partner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6'>
          <h3 className='font-semibold text-slate-800 mb-4'>
            {editingId ? 'Edit Partner' : 'New Partner'}
          </h3>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 sm:grid-cols-2 gap-4'
          >
            <div className='flex flex-col gap-1 sm:col-span-2'>
              <label className={labelClass}>Partner Name *</label>
              <input
                type='text'
                required
                className={inputClass}
                placeholder='e.g. TechZone Ghana'
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1 sm:col-span-2'>
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                className={inputClass}
                placeholder='Brief description…'
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1 sm:col-span-2'>
              <label className={labelClass}>Logo URL</label>
              <input
                type='text'
                className={inputClass}
                placeholder='https://…'
                value={form.logo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, logo: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>Phone</label>
              <input
                type='tel'
                className={inputClass}
                placeholder='024 000 0000'
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>WhatsApp</label>
              <input
                type='tel'
                className={inputClass}
                placeholder='233240000000'
                value={form.whatsapp}
                onChange={(e) =>
                  setForm((f) => ({ ...f, whatsapp: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-1 sm:col-span-2'>
              <label className={labelClass}>Email</label>
              <input
                type='email'
                className={inputClass}
                placeholder='partner@email.com'
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className='flex items-center gap-2 sm:col-span-2'>
              <input
                type='checkbox'
                id='isActive'
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
                className='w-4 h-4 accent-teal-500'
              />
              <label htmlFor='isActive' className='text-sm text-slate-600'>
                Active (visible on site)
              </label>
            </div>
            <div className='flex gap-3 justify-end sm:col-span-2'>
              <button
                type='button'
                onClick={() => setShowForm(false)}
                className='px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={saving}
                className='px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:bg-slate-200 text-white text-sm font-medium'
              >
                {saving
                  ? 'Saving…'
                  : editingId
                    ? 'Save Changes'
                    : 'Create Partner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partner list */}
      <div className='bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden'>
        {partners.length === 0 ? (
          <div className='text-center py-16 text-slate-400'>
            <MdStore size={40} className='mx-auto mb-2 opacity-30' />
            <p className='text-sm'>No partners yet</p>
          </div>
        ) : (
          <table className='w-full text-sm'>
            <thead className='bg-slate-50 text-slate-500 text-xs uppercase tracking-wide'>
              <tr>
                <th className='text-left px-5 py-3'>Partner</th>
                <th className='text-left px-5 py-3 hidden sm:table-cell'>
                  Contact
                </th>
                <th className='text-center px-5 py-3 hidden md:table-cell'>
                  Products
                </th>
                <th className='text-center px-5 py-3'>Status</th>
                <th className='text-right px-5 py-3'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {partners.map((p) => (
                <tr key={p.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-5 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                        {p.logo ? (
                          <img
                            src={p.logo}
                            alt={p.name}
                            className='w-full h-full object-contain'
                          />
                        ) : (
                          <MdStore size={18} className='text-slate-400' />
                        )}
                      </div>
                      <div>
                        <p className='font-medium text-slate-800'>{p.name}</p>
                        <p className='text-xs text-slate-400'>/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-5 py-4 hidden sm:table-cell text-slate-500'>
                    {p.email || p.phone || '—'}
                  </td>
                  <td className='px-5 py-4 text-center hidden md:table-cell'>
                    <span className='bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium'>
                      {p._count?.products ?? 0}
                    </span>
                  </td>
                  <td className='px-5 py-4 text-center'>
                    <button
                      type='button'
                      onClick={() => handleToggle(p.id, p.isActive)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.isActive
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.isActive ? (
                        <>
                          <MdCheck size={12} /> Active
                        </>
                      ) : (
                        <>
                          <MdClose size={12} /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className='px-5 py-4 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <button
                        type='button'
                        onClick={() => handleEdit(p)}
                        className='p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDelete(p.id)}
                        className='p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500'
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManagePartnersClient;
