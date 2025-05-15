'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const sideStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
};

const alignStyles = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 rounded-md bg-background px-3 py-2 text-sm text-text shadow-lg',
              sideStyles[side],
              alignStyles[align],
              className
            )}
          >
            {content}
            <div
              className={cn(
                'absolute h-2 w-2 rotate-45 bg-background',
                side === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
                side === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
                side === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
                side === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 