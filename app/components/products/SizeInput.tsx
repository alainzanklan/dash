'use client';

import { useState } from 'react';
import { MdClose, MdAdd } from 'react-icons/md';

// Common fashion size presets
const SIZE_PRESETS = {
  'Clothing (Alpha)': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  'Clothing (Numeric)': ['6', '8', '10', '12', '14', '16', '18'],
  'Shoes (EU)': ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
  'Shoes (UK)': ['3', '4', '5', '6', '7', '8', '9', '10'],
};

interface SizeInputProps {
  value: string[];
  onChange: (sizes: string[]) => void;
}

const SizeInput: React.FC<SizeInputProps> = ({ value, onChange }) => {
  const [custom, setCustom] = useState('');

  const toggle = (size: string) => {
    if (value.includes(size)) {
      onChange(value.filter((s) => s !== size));
    } else {
      onChange([...value, size]);
    }
  };

  const addCustom = () => {
    const trimmed = custom.trim().toUpperCase();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setCustom('');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <p className='text-sm font-semibold text-slate-700 mb-1'>
          Sizes Available
        </p>
        <p className='text-xs text-slate-400 mb-3'>
          Select from presets or add custom sizes.
        </p>
      </div>

      {/* Preset groups */}
      {Object.entries(SIZE_PRESETS).map(([group, sizes]) => (
        <div key={group}>
          <p className='text-xs text-slate-400 uppercase tracking-wide mb-2'>
            {group}
          </p>
          <div className='flex flex-wrap gap-2'>
            {sizes.map((size) => (
              <button
                key={size}
                type='button'
                onClick={() => toggle(size)}
                className={`min-w-[40px] h-9 px-3 border text-sm font-medium transition-all rounded-lg ${
                  value.includes(size)
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Custom size input */}
      <div>
        <p className='text-xs text-slate-400 uppercase tracking-wide mb-2'>
          Custom Size
        </p>
        <div className='flex gap-2'>
          <input
            type='text'
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addCustom())
            }
            placeholder='e.g. One Size, 3XL, 32W...'
            className='flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-400 transition'
          />
          <button
            type='button'
            onClick={addCustom}
            className='px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-medium flex items-center gap-1'
          >
            <MdAdd size={16} /> Add
          </button>
        </div>
      </div>

      {/* Selected sizes summary */}
      {value.length > 0 && (
        <div>
          <p className='text-xs text-slate-400 uppercase tracking-wide mb-2'>
            Selected ({value.length})
          </p>
          <div className='flex flex-wrap gap-2'>
            {value.map((size) => (
              <span
                key={size}
                className='flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 text-white text-sm font-medium rounded-lg'
              >
                {size}
                <button
                  type='button'
                  onClick={() => toggle(size)}
                  className='hover:bg-teal-600 rounded-full p-0.5 transition-colors'
                >
                  <MdClose size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeInput;
