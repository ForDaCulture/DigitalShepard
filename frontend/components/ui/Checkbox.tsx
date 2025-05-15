'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function Checkbox({
  className,
  label,
  error,
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <div className="relative">
          <input
            type="checkbox"
            className={cn(
              'peer h-4 w-4 cursor-pointer appearance-none rounded border border-background bg-background checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          <motion.div
            initial={false}
            animate={props.checked ? { scale: [0.5, 1] } : { scale: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-white"
          >
            <Check className="h-3 w-3" />
          </motion.div>
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