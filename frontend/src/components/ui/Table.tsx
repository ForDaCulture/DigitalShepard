'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
}

export function Table<T>({
  columns,
  data,
  className,
  onSort,
  sortKey,
  sortDirection,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  totalItems,
}: TableProps<T>) {
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 0;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-background">
      <div className="overflow-x-auto">
        <table className={cn('w-full', className)}>
          <thead>
            <tr className="border-b border-background bg-background/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-text-muted',
                    column.sortable && 'cursor-pointer hover:text-text'
                  )}
                  onClick={() => {
                    if (column.sortable && onSort) {
                      const newDirection =
                        sortKey === column.key && sortDirection === 'asc'
                          ? 'desc'
                          : 'asc';
                      onSort(column.key, newDirection);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <span className="inline-flex">
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-background bg-background/30 hover:bg-background/50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-text">
                    {column.render
                      ? column.render(item)
                      : (item as any)[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-background bg-background/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-md px-3 py-1 text-sm text-text-muted hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-md px-3 py-1 text-sm text-text-muted hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-text-muted">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, totalItems || 0)} of{' '}
            {totalItems} entries
          </div>
        </div>
      )}
    </div>
  );
} 