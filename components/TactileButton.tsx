
import React from 'react';
import { ButtonVariant } from '../types';
import { playSound } from '../utils/soundEffects';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const TactileButton: React.FC<TactileButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  icon,
  onClick,
  ...props 
}) => {
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound('click');
    if (onClick) onClick(e);
  };

  const getVariantClasses = (v: ButtonVariant) => {
    switch (v) {
      case 'primary':
        return 'bg-indigo-500 hover:bg-indigo-400 text-white border-indigo-700';
      case 'success':
        return 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-700';
      case 'destructive':
        return 'bg-rose-500 hover:bg-rose-400 text-white border-rose-700';
      case 'magic':
        return 'bg-amber-400 hover:bg-amber-300 text-amber-900 border-amber-600';
      case 'neutral':
        return 'bg-slate-200 hover:bg-slate-100 text-slate-700 border-slate-400';
      default:
        return 'bg-indigo-500 text-white border-indigo-700';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group
        relative
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        rounded-xl
        border-b-[4px]
        active:border-b-0 active:translate-y-[4px]
        py-3 px-5
        font-bold
        text-lg
        shadow-lg
        transition-all
        duration-75
        overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-[4px]
        ${getVariantClasses(variant as ButtonVariant)}
        ${className}
      `}
      {...props}
    >
      {/* Ripple/Flash effect on active */}
      <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-75 pointer-events-none" />
      
      {icon && <span className={`transition-transform duration-300 ${variant === 'magic' ? 'group-hover:rotate-12' : ''}`}>{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default TactileButton;