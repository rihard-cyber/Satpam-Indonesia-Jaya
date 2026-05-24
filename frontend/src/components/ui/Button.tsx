'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-gradient-to-r from-navy-600 to-navy-700 text-white hover:from-navy-500 hover:to-navy-600 shadow-lg shadow-navy-600/30',
      secondary:
        'bg-navy-800 text-white hover:bg-navy-700 border border-white/10',
      gold: 'bg-gradient-to-r from-gold to-gold-dark text-black hover:from-gold-light hover:to-gold font-semibold shadow-lg shadow-gold/20',
      ghost:
        'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
      danger:
        'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600',
      outline:
        'bg-transparent border border-gold text-gold hover:bg-gold/10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-navy-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transform active:scale-[0.98]',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
