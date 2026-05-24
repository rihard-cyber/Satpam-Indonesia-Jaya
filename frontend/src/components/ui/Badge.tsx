'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  dot = false,
}: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white/70',
    gold: 'bg-gold/20 text-gold border border-gold/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
