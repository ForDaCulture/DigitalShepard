'use client';

import { motion } from 'framer-motion';
import { Badge } from './Badge';
import { Button } from './Button';
import { Progress } from './Progress';

export interface Threat {
  id: string;
  title: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  riskScore: number;
  category: string;
  description: string;
}

interface ThreatCardProps {
  threat: Threat;
  onViewDetails: (threat: Threat) => void;
}

export function ThreatCard({ threat, onViewDetails }: ThreatCardProps) {
  const severityColors = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-400 text-black',
    low: 'bg-emerald-500 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800 hover:border-indigo-500/50 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{threat.title}</h3>
          <p className="text-sm text-slate-400">{threat.category}</p>
        </div>
        <Badge className={severityColors[threat.severity]}>
          {threat.severity.toUpperCase()}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">Risk Score</span>
          <span className="text-sm font-medium text-white">{threat.riskScore}%</span>
        </div>
        <Progress 
          value={threat.riskScore} 
          color={threat.severity === 'high' ? 'red' : threat.severity === 'medium' ? 'yellow' : 'emerald'}
        />
      </div>

      <p className="text-sm text-slate-300 mb-4 line-clamp-2">
        {threat.description}
      </p>

      <div className="flex justify-between items-center">
        <time className="text-xs text-slate-500">
          {new Date(threat.timestamp).toLocaleString()}
        </time>
        <Button
          variant="ghost"
          onClick={() => onViewDetails(threat)}
          className="text-indigo-400 hover:text-indigo-300"
        >
          View Details →
        </Button>
      </div>
    </motion.div>
  );
} 