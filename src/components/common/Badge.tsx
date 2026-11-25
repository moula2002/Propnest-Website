import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'royal' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    primary: 'bg-royal-50 text-royal-700 border-royal-200/60 font-semibold',
    royal: 'bg-royal-600 text-white border-transparent font-bold shadow-sm',
    navy: 'bg-navy-900 text-white border-transparent font-bold shadow-sm',
    secondary: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-semibold',
    success: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80 font-bold',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80 font-semibold',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80 font-semibold',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80 font-semibold',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80 font-medium',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border tracking-tight',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
