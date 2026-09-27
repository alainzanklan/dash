'use client';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelect,
}) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-xs text-zinc-400 uppercase tracking-wide'>
        Size —{' '}
        <span className='text-zinc-700 normal-case font-medium'>
          {selectedSize ?? 'Select a size'}
        </span>
      </p>
      <div className='flex flex-wrap gap-2'>
        {sizes.map((size) => (
          <button
            key={size}
            type='button'
            onClick={() => onSelect(size)}
            className={`min-w-[44px] h-10 px-3 border text-sm font-medium transition-all ${
              selectedSize === size
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 text-zinc-700 hover:border-zinc-500'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
