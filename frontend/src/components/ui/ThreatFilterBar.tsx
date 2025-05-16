'use client';

import { useState } from 'react';
import { Button } from './Button';
import { motion } from 'framer-motion';

interface ThreatFilterBarProps {
  onFilterChange: (filters: ThreatFilters) => void;
}

export interface ThreatFilters {
  severity: string[];
  category: string[];
  dateRange: 'all' | '24h' | '7d' | '30d';
}

const SEVERITY_OPTIONS = ['high', 'medium', 'low'];
const CATEGORY_OPTIONS = ['phishing', 'fatigue', 'suspicious_access', 'malware', 'data_leak'];
const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
];

export function ThreatFilterBar({ onFilterChange }: ThreatFilterBarProps) {
  const [filters, setFilters] = useState<ThreatFilters>({
    severity: [],
    category: [],
    dateRange: 'all',
  });

  const handleFilterChange = (
    type: keyof ThreatFilters,
    value: string
  ) => {
    const newFilters = { ...filters };
    
    if (type === 'dateRange') {
      newFilters.dateRange = value as ThreatFilters['dateRange'];
    } else {
      const array = newFilters[type] as string[];
      const index = array.indexOf(value);
      
      if (index === -1) {
        array.push(value);
      } else {
        array.splice(index, 1);
      }
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 p-4 bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800"
    >
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Severity</label>
          <div className="flex flex-wrap gap-2">
            {SEVERITY_OPTIONS.map((severity) => (
              <Button
                key={severity}
                size="sm"
                variant={filters.severity.includes(severity) ? 'default' : 'outline'}
                onClick={() => handleFilterChange('severity', severity)}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={filters.category.includes(category) ? 'default' : 'outline'}
                onClick={() => handleFilterChange('category', category)}
              >
                {category.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Time Range</label>
          <div className="flex flex-wrap gap-2">
            {DATE_RANGE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={filters.dateRange === option.value ? 'default' : 'outline'}
                onClick={() => handleFilterChange('dateRange', option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 