import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useXP } from '@/contexts/XPContext';

const XPBar = () => {
  const { currentLevel, currentXP, xpToNextLevel, totalXPForNextLevel } = useXP();
  
  const currentLevelXP = totalXPForNextLevel - xpToNextLevel;
  const levelProgress = (currentLevelXP / (totalXPForNextLevel - (currentLevel > 1 ? 
    Object.entries({1: 0, 2: 500, 3: 1200, 4: 2000, 5: 3000, 6: 4200, 7: 5600, 8: 7200, 9: 9000, 10: 11000, 11: 13200, 12: 15600, 13: 18200, 14: 21000, 15: 24000, 16: 27200, 17: 30600, 18: 34200, 19: 38000, 20: 42000}).find(([level]) => parseInt(level) === currentLevel)?.[1] || 0 : 0))) * 100;

  return (
    <div className="bg-card/80 backdrop-blur-md px-4 py-2 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center text-white text-xs font-bold">
            {currentLevel}
          </div>
          <div className="text-sm font-medium">
            Nivel {currentLevel}
          </div>
        </div>
        
        <div className="flex-1">
          <Progress 
            value={levelProgress} 
            className="h-2"
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          {Math.max(0, xpToNextLevel)} XP
        </div>
      </div>
    </div>
  );
};

export default XPBar;