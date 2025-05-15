'use client';

import { motion } from 'framer-motion';
import { LockClosedIcon } from '@heroicons/react/24/solid';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  xpReward: number;
}

interface BadgeCardProps {
  achievement: Achievement;
}

export function BadgeCard({ achievement }: BadgeCardProps) {
  const isLocked = !achievement.unlockedAt;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative overflow-hidden bg-slate-900 rounded-xl p-6 border
        ${isLocked ? 'border-slate-800' : 'border-indigo-500/50'}
      `}
    >
      {/* Badge Icon */}
      <div className="flex justify-between items-start mb-4">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-2xl
          ${isLocked ? 'bg-slate-800' : 'bg-indigo-500/20'}
        `}>
          {achievement.icon}
        </div>
        {isLocked && (
          <LockClosedIcon className="w-5 h-5 text-slate-500" />
        )}
      </div>

      {/* Badge Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-white">{achievement.name}</h3>
        <p className="text-sm text-slate-400">{achievement.description}</p>
      </div>

      {/* XP Reward & Unlock Date */}
      <div className="mt-4 flex justify-between items-center text-xs">
        <span className="text-indigo-400">+{achievement.xpReward} XP</span>
        {achievement.unlockedAt && (
          <time className="text-slate-500">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </time>
        )}
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
      )}
    </motion.div>
  );
} 