import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

const LEVEL_XP = {
  1: 0, 2: 500, 3: 1200, 4: 2000, 5: 3000,
  6: 4200, 7: 5600, 8: 7200, 9: 9000, 10: 11000,
  11: 13200, 12: 15600, 13: 18200, 14: 21000, 15: 24000,
  16: 27200, 17: 30600, 18: 34200, 19: 38000, 20: 42000
};

const XPBar = () => {
  const [currentXP, setCurrentXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    loadUserXP();
    
    // Subscribe to XP changes
    const channel = supabase
      .channel('xp-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_xp'
        },
        () => {
          loadUserXP();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadUserXP = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_xp')
      .select('total_xp, current_level')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setCurrentXP(data.total_xp);
      setCurrentLevel(data.current_level);
    }
  };

  const nextLevel = currentLevel + 1;
  const totalXPForNextLevel = LEVEL_XP[nextLevel as keyof typeof LEVEL_XP] || 50000;
  const currentLevelStartXP = LEVEL_XP[currentLevel as keyof typeof LEVEL_XP] || 0;
  const xpInCurrentLevel = currentXP - currentLevelStartXP;
  const xpNeededForLevel = totalXPForNextLevel - currentLevelStartXP;
  const levelProgress = (xpInCurrentLevel / xpNeededForLevel) * 100;

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
          {Math.max(0, totalXPForNextLevel - currentXP)} XP
        </div>
      </div>
    </div>
  );
};

export default XPBar;