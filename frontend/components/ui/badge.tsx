'use client';

import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-background text-text border border-background',
  success: 'bg-green-500/10 text-green-500 border border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  error: 'bg-red-500/10 text-red-500 border border-red-500/20',
  info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
  secondary: 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
  outline: 'bg-transparent text-current border border-current',
};

const severityStyles = {
  low: 'bg-green-500/10 text-green-500 border border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  high: 'bg-red-500/10 text-red-500 border border-red-500/20',
  critical: 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  severity,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        severity ? severityStyles[severity] : variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
} 