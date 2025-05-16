'use client';

import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        'bg-background',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
    />
  );
}

interface DividerWithTextProps {
  text: string;
  className?: string;
}

export function DividerWithText({
  text,
  className,
}: DividerWithTextProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Divider className="flex-1" />
      <span className="text-sm text-text-muted">{text}</span>
      <Divider className="flex-1" />
    </div>
  );
} 