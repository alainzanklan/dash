'use client';

import { IconType } from 'react-icons';

interface ButtonProps {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  icon?: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled,
  outline,
  small,
  custom,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={`
        disabled:opacity-70 disabled:cursor-not-allowed rounded-md hover:opacity-80
        transition w-full flex items-center justify-center gap-2
        ${outline ? 'bg-white text-sky-700 border-sky-700' : 'bg-sky-700 text-white border-sky-700'}
        ${small ? 'text-sm font-light py-1 px-2 border-[1px]' : 'text-md font-semibold py-3 px-4 border-2'}
        ${custom ?? ''}
      `}
    >
      {Icon && <Icon size={24} />}
      {label}
    </button>
  );
};

export default Button;
