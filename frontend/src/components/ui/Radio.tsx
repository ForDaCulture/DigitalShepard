'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function Radio({
  className,
  label,
  error,
  ...props
}: RadioProps) {
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <div className="relative">
          <input
            type="radio"
            className={cn(
              'peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-background bg-background checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          <motion.div
            initial={false}
            animate={props.checked ? { scale: [0.5, 1] } : { scale: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-2 w-2 rounded-full bg-primary" />
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

interface RadioGroupProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}

export function RadioGroup({
  children,
  label,
  error,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {children}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
} 