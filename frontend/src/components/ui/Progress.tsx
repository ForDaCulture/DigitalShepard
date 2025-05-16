"use client";

import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number;
  color?: 'red' | 'yellow' | 'emerald' | 'indigo';
  className?: string;
}

export function Progress({ value, color = 'indigo', className }: ProgressProps) {
  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className={cn("w-full bg-slate-800 rounded-full h-2", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-in-out",
          colorClasses[color]
        )}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
} 