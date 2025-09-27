import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
}

interface XPContextType {
  currentXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalXPForNextLevel: number;
  achievements: Achievement[];
  addXP: (amount: number, action: string) => void;
  unlockAchievement: (achievementId: string) => void;
}

const XPContext = createContext<XPContextType | undefined>(undefined);

const LEVEL_XP_REQUIREMENTS = {
  1: 0, 2: 500, 3: 1200, 4: 2000, 5: 3000,
  6: 4200, 7: 5600, 8: 7200, 9: 9000, 10: 11000,
  11: 13200, 12: 15600, 13: 18200, 14: 21000, 15: 24000,
  16: 27200, 17: 30600, 18: 34200, 19: 38000, 20: 42000
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_like', name: 'Primer Like', description: 'Da tu primer me gusta', icon: '❤️', xpReward: 50, unlocked: false },
  { id: 'first_post', name: 'Primera Publicación', description: 'Crea tu primera publicación', icon: '📝', xpReward: 100, unlocked: false },
  { id: 'first_comment', name: 'Primer Comentario', description: 'Comenta por primera vez', icon: '💬', xpReward: 75, unlocked: false },
  { id: 'first_match', name: 'Primer Match', description: 'Haz tu primer match', icon: '💫', xpReward: 150, unlocked: false },
  { id: 'first_chat', name: 'Primera Conversación', description: 'Inicia tu primer chat', icon: '💌', xpReward: 100, unlocked: false },
  { id: 'join_challenge', name: 'Retador', description: 'Únete a tu primer reto', icon: '🏆', xpReward: 200, unlocked: false },
  { id: 'attend_event', name: 'Participante Activo', description: 'Inscríbete a tu primer evento', icon: '🎯', xpReward: 150, unlocked: false },
  { id: 'level_5', name: 'Fitness Rookie', description: 'Alcanza el nivel 5', icon: '🥉', xpReward: 300, unlocked: false },
  { id: 'level_10', name: 'Fitness Enthusiast', description: 'Alcanza el nivel 10', icon: '🥈', xpReward: 500, unlocked: false },
  { id: 'level_15', name: 'Fitness Master', description: 'Alcanza el nivel 15', icon: '🥇', xpReward: 1000, unlocked: false },
  { id: 'social_butterfly', name: 'Mariposa Social', description: 'Haz 10 matches', icon: '🦋', xpReward: 400, unlocked: false },
  { id: 'content_creator', name: 'Creador de Contenido', description: 'Crea 10 publicaciones', icon: '🎨', xpReward: 600, unlocked: false },
];

export const XPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentXP, setCurrentXP] = useState(1250); // Starting XP
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const { toast } = useToast();

  const getCurrentLevel = (xp: number): number => {
    let level = 1;
    Object.entries(LEVEL_XP_REQUIREMENTS).forEach(([lvl, requiredXP]) => {
      if (xp >= requiredXP) {
        level = parseInt(lvl);
      }
    });
    return level;
  };

  const currentLevel = getCurrentLevel(currentXP);
  const nextLevel = currentLevel + 1;
  const totalXPForNextLevel = LEVEL_XP_REQUIREMENTS[nextLevel as keyof typeof LEVEL_XP_REQUIREMENTS] || 50000;
  const xpToNextLevel = totalXPForNextLevel - currentXP;

  const addXP = (amount: number, action: string) => {
    const oldLevel = currentLevel;
    const newXP = currentXP + amount;
    setCurrentXP(newXP);
    
    const newLevel = getCurrentLevel(newXP);
    
    toast({
      title: `+${amount} XP`,
      description: action,
      duration: 2000,
    });

    if (newLevel > oldLevel) {
      toast({
        title: `¡Nivel ${newLevel}!`,
        description: `¡Has alcanzado el nivel ${newLevel}!`,
        duration: 3000,
      });
      
      // Check for level achievements
      const levelAchievements = [`level_${newLevel}`];
      levelAchievements.forEach(achievementId => {
        unlockAchievement(achievementId);
      });
    }
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        const updated = prev.map(a => 
          a.id === achievementId ? { ...a, unlocked: true } : a
        );
        
        toast({
          title: `¡Logro Desbloqueado!`,
          description: `${achievement.icon} ${achievement.name} - +${achievement.xpReward} XP`,
          duration: 4000,
        });
        
        // Add achievement XP
        setTimeout(() => {
          setCurrentXP(xp => xp + achievement.xpReward);
        }, 500);
        
        return updated;
      }
      return prev;
    });
  };

  return (
    <XPContext.Provider value={{
      currentXP,
      currentLevel,
      xpToNextLevel,
      totalXPForNextLevel,
      achievements,
      addXP,
      unlockAchievement
    }}>
      {children}
    </XPContext.Provider>
  );
};

export const useXP = () => {
  const context = useContext(XPContext);
  if (context === undefined) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};