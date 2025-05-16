import React, { createContext, useContext, useState, useEffect } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface UserXP {
  level: number;
  totalXP: number;
  badges: Badge[];
  userId: string;
}

interface UserXPContextType {
  userXP: UserXP;
  addXP: (amount: number, category?: string) => void;
  unlockBadge: (badgeId: string) => void;
  trackAction: (category: string, action: string) => void;
}

const UserXPContext = createContext<UserXPContextType | undefined>(undefined);

export function UserXPProvider({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const userId = 'user-123';

  const addXP = (amount: number, _category?: string) => {
    setTotalXP(prev => {
      const newXP = prev + amount;
      // Level up every 1000 XP
      if (newXP >= level * 1000) {
        setLevel(prevLevel => prevLevel + 1);
      }
      return newXP;
    });
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => {
      const badge = prev.find(b => b.id === badgeId);
      if (badge && !badge.unlockedAt) {
        return prev.map(b =>
          b.id === badgeId
            ? { ...b, unlockedAt: new Date().toISOString() }
            : b
        );
      }
      return prev;
    });
  };

  const trackAction = (_category: string, _action: string) => {
    // No-op for now
  };

  useEffect(() => {
    // Load initial badges
    setBadges([
      {
        id: 'security-basics',
        name: 'Security Basics',
        description: 'Completed basic security training',
        icon: 'shield',
      },
      {
        id: 'threat-detection',
        name: 'Threat Detection',
        description: 'Successfully identified and reported threats',
        icon: 'eye',
      },
      {
        id: 'best-practices',
        name: 'Best Practices',
        description: 'Implemented security best practices',
        icon: 'check-circle',
      },
    ]);
  }, []);

  const userXP: UserXP = {
    level,
    totalXP,
    badges,
    userId,
  };

  return (
    <UserXPContext.Provider value={{ userXP, addXP, unlockBadge, trackAction }}>
      {children}
    </UserXPContext.Provider>
  );
}

export function useUserXP() {
  const context = useContext(UserXPContext);
  if (context === undefined) {
    throw new Error('useUserXP must be used within a UserXPProvider');
  }
  return context;
} 