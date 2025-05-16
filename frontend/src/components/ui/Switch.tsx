'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function Switch({
  className,
  label,
  error,
  ...props
}: SwitchProps) {
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <div className="relative">
          <input
            type="checkbox"
            role="switch"
            className={cn(
              'peer h-5 w-9 cursor-pointer appearance-none rounded-full border border-background bg-background transition-colors checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          <motion.div
            initial={false}
            animate={{
              x: props.checked ? 16 : 0,
              backgroundColor: props.checked ? '#FFFFFF' : '#94A3B8',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-text-muted"
          />
        </div>
      </div>
      {label && (
        <div className="ml-3">
          <label
            htmlFor={props.id}
            className={cn(
              'text-sm font-medium text-text',
              props.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
} 