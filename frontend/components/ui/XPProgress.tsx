'use client';

import { motion } from 'framer-motion';
import { Progress } from './Progress';

interface XPProgressProps {
  currentXP: number;
  level: number;
  nextLevelXP: number;
}

export function XPProgress({ currentXP, level, nextLevelXP }: XPProgressProps) {
  const progress = (currentXP / nextLevelXP) * 100;
  const xpNeeded = nextLevelXP - currentXP;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Security Level {level}</h3>
          <p className="text-sm text-slate-400">Keep improving your security practices!</p>
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium"
        >
          {currentXP} XP
        </motion.div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} color="indigo" />
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Level {level}</span>
          <span className="text-slate-400">{xpNeeded} XP to Level {level + 1}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Current Level', value: level },
          { label: 'Total XP', value: `${currentXP} XP` },
          { label: 'Next Level', value: `${nextLevelXP} XP` },
          { label: 'XP Needed', value: `${xpNeeded} XP` },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800/50 rounded-lg p-3 text-center"
          >
            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
            <p className="text-sm font-medium text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 