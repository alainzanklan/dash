'use client';

import { IconType } from 'react-icons';

interface AdminNavItemProps {
  label: string;
  icon: IconType;
  selected: boolean;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({
  label,
  icon: Icon,
  selected,
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        selected
          ? 'bg-teal-500 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  );
};

export default AdminNavItem;
