'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'gold';
  onClick?: () => void;
  hover?: boolean;
}

export function Card({
  children,
  className,
  variant = 'default',
  onClick,
  hover = false,
}: CardProps) {
  const variants = {
    default: 'bg-navy-800 border border-white/5',
    glass:
      'bg-white/5 backdrop-blur-xl border border-white/10',
    gradient:
      'bg-gradient-to-br from-navy-700 to-navy-900 border border-white/5',
    gold: 'bg-gradient-to-br from-navy-800 to-navy-900 border border-gold/20 shadow-lg shadow-gold/5',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 shadow-xl',
        variants[variant],
        hover && 'cursor-pointer hover:border-gold/40 hover:shadow-glow transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('', className)}>{children}</div>;
}
