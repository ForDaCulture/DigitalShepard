import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredActions: number;
  category: string;
}

interface Achievement {
  id: string;
  timestamp: Date;
  badgeId: string;
  category: string;
}

interface UserXP {
  userId: string;
  level: number;
  totalXP: number;
  lastActive: Date;
  badges: Badge[];
  achievements: Achievement[];
  currentProgress: {
    [key: string]: number;
  };
}

interface UserXPContextType {
  userXP: UserXP;
  addXP: (points: number, category?: string) => void;
  trackAction: (category: string, action: string) => void;
  checkAchievements: () => void;
}

const BADGES: Badge[] = [
  {
    id: 'phish_fighter',
    name: 'Phish Fighter',
    description: 'Detected 5 phishing attempts',
    icon: '🎣',
    requiredActions: 5,
    category: 'phishing'
  },
  {
    id: 'security_sentinel',
    name: 'Security Sentinel',
    description: 'Maintained normal behavior for 7 days',
    icon: '🛡️',
    requiredActions: 7,
    category: 'behavior'
  },
  {
    id: 'password_master',
    name: 'Password Master',
    description: 'Used strong passwords for 10 consecutive logins',
    icon: '🔐',
    requiredActions: 10,
    category: 'password'
  }
];

const XP_DECAY_RATE = 5; // XP lost per day of inactivity
const INACTIVITY_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const UserXPContext = createContext<UserXPContextType | undefined>(undefined);

export function UserXPProvider({ children }: { children: React.ReactNode }) {
  const [userXP, setUserXP] = useState<UserXP>({
    userId: 'default-user',
    level: 1,
    totalXP: 0,
    lastActive: new Date(),
    badges: [],
    achievements: [],
    currentProgress: {}
  });

  const calculateXPDecay = (lastActive: Date): number => {
    const now = new Date();
    const timeDiff = now.getTime() - lastActive.getTime();
    const daysSinceActive = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    return Math.max(0, daysSinceActive * XP_DECAY_RATE);
  };

  const showLevelUpAnimation = (newLevel: number) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast.success(`Level Up! You're now level ${newLevel}! 🎉`, {
      duration: 4000,
      position: 'top-center',
      icon: '⬆️'
    });
  };

  const addXP = (points: number, category?: string) => {
    setUserXP(prev => {
      const currentLevel = prev.level;
      const newXP = Math.max(0, prev.totalXP + points);
      const newLevel = Math.floor(newXP / 100) + 1;
      
      // Trigger level up animation if level increased
      if (newLevel > currentLevel) {
        showLevelUpAnimation(newLevel);
      }
      
      return {
        ...prev,
        totalXP: newXP,
        level: newLevel,
        lastActive: new Date()
      };
    });
  };

  const trackAction = (category: string, action: string) => {
    setUserXP(prev => {
      const currentCount = (prev.currentProgress[category] || 0) + 1;
      
      return {
        ...prev,
        lastActive: new Date(),
        currentProgress: {
          ...prev.currentProgress,
          [category]: currentCount
        }
      };
    });
    
    checkAchievements();
  };

  const checkAchievements = () => {
    BADGES.forEach(badge => {
      const progress = userXP.currentProgress[badge.category] || 0;
      const hasAchievement = userXP.achievements.some(a => a.badgeId === badge.id);
      
      if (progress >= badge.requiredActions && !hasAchievement) {
        const newAchievement: Achievement = {
          id: `${badge.id}-${Date.now()}`,
          timestamp: new Date(),
          badgeId: badge.id,
          category: badge.category
        };
        
        setUserXP(prev => ({
          ...prev,
          badges: [...prev.badges, badge],
          achievements: [...prev.achievements, newAchievement]
        }));
        
        // Show achievement notification
        toast.success(
          <div className="flex items-center gap-2">
            <span className="text-2xl">{badge.icon}</span>
            <div>
              <p className="font-bold">{badge.name} Unlocked!</p>
              <p className="text-sm">{badge.description}</p>
            </div>
          </div>,
          { duration: 5000 }
        );
      }
    });
  };

  // Check for XP decay every hour
  useEffect(() => {
    const checkXPDecay = () => {
      const now = new Date();
      const lastActive = new Date(userXP.lastActive);
      const timeSinceActive = now.getTime() - lastActive.getTime();

      if (timeSinceActive >= INACTIVITY_THRESHOLD) {
        const xpDecay = calculateXPDecay(lastActive);
        if (xpDecay > 0) {
          addXP(-xpDecay);
          toast.error(`Lost ${xpDecay} XP due to inactivity!`, {
            icon: '⚠️'
          });
        }
      }
    };

    const interval = setInterval(checkXPDecay, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [userXP.lastActive]);

  // Load user progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('userXP');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      parsed.lastActive = new Date(parsed.lastActive); // Convert string back to Date
      setUserXP(parsed);
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userXP', JSON.stringify(userXP));
  }, [userXP]);

  return (
    <UserXPContext.Provider value={{ userXP, addXP, trackAction, checkAchievements }}>
      {children}
    </UserXPContext.Provider>
  );
}

export const useUserXP = () => {
  const context = useContext(UserXPContext);
  if (context === undefined) {
    throw new Error('useUserXP must be used within a UserXPProvider');
  }
  return context;
}; 