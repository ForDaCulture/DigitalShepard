'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';
import { BadgeCard } from '@/components/ui/BadgeCard';
import { XPProgress } from '@/components/ui/XPProgress';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  xpReward: number;
}

interface UserProgress {
  currentXP: number;
  level: number;
  nextLevelXP: number;
}

// Simulated API call - replace with your actual API endpoint
const fetchAchievements = async (): Promise<Achievement[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      name: 'First Line of Defense',
      description: 'Complete your first security scan',
      icon: '🛡️',
      unlockedAt: new Date().toISOString(),
      xpReward: 100,
    },
    {
      id: '2',
      name: 'Phish Fighter',
      description: 'Successfully identify and report 5 phishing attempts',
      icon: '🎣',
      unlockedAt: null,
      xpReward: 250,
    },
    {
      id: '3',
      name: 'Vigilant Guardian',
      description: 'Maintain a perfect security score for 7 days',
      icon: '👁️',
      unlockedAt: null,
      xpReward: 500,
    },
  ];
};

const fetchUserProgress = async (): Promise<UserProgress> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    currentXP: 450,
    level: 3,
    nextLevelXP: 1000,
  };
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [achievementsData, progressData] = await Promise.all([
        fetchAchievements(),
        fetchUserProgress(),
      ]);
      
      setAchievements(achievementsData);
      setUserProgress(progressData);
      
      // Check for newly unlocked achievements
      const newlyUnlocked = achievementsData.filter(
        a => a.unlockedAt && new Date(a.unlockedAt).getTime() > Date.now() - 5000
      );
      
      if (newlyUnlocked.length > 0) {
        celebrateUnlock(newlyUnlocked[0]);
      }
    } catch (error) {
      toast.error('Failed to load achievements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const celebrateUnlock = (achievement: Achievement) => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Show toast
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-slate-900 border border-indigo-500 rounded-lg p-4 shadow-lg`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{achievement.icon}</span>
          <div>
            <p className="text-white font-medium">Achievement Unlocked!</p>
            <p className="text-slate-400 text-sm">{achievement.name}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-950 text-white px-6 py-12"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Achievements</h1>
          <p className="text-slate-400">
            Track your progress and earn rewards for maintaining strong security practices.
          </p>
        </div>

        {userProgress && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-800">
            <XPProgress
              currentXP={userProgress.currentXP}
              level={userProgress.level}
              nextLevelXP={userProgress.nextLevelXP}
            />
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[200px] bg-slate-900/50 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievements.map((achievement) => (
                <BadgeCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
} 