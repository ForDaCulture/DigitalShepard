'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <motion.li
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-text-muted hover:text-text"
          >
            <Home className="h-4 w-4" />
          </Link>
        </motion.li>
        {items.map((item, index) => (
          <motion.li
            key={item.href || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            <ChevronRight className="h-4 w-4 text-text-muted" />
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center text-sm font-medium text-text-muted hover:text-text"
              >
                {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span className="flex items-center text-sm font-medium text-text">
                {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
} 