import Link from 'next/link';
import { MdStore } from 'react-icons/md';

interface SoldByBadgeProps {
  partnerName: string;
  partnerSlug: string;
  small?: boolean;
}

const SoldByBadge: React.FC<SoldByBadgeProps> = ({
  partnerName,
  partnerSlug,
  small,
}) => {
  if (small) {
    return (
      <Link
        href={`/partner/${partnerSlug}`}
        onClick={(e) => e.stopPropagation()}
        className='flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 transition-colors mt-1'
      >
        <MdStore size={12} />
        <span className='truncate'>{partnerName}</span>
      </Link>
    );
  }

  return (
    <div className='flex items-center gap-2 text-sm text-slate-500'>
      <MdStore size={16} className='text-slate-400' />
      <span>Sold by</span>
      <Link
        href={`/partner/${partnerSlug}`}
        className='font-medium text-teal-600 hover:text-teal-700 hover:underline transition-colors'
      >
        {partnerName}
      </Link>
    </div>
  );
};

export default SoldByBadge;
