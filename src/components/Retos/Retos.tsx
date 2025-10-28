import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, ArrowRight, Info, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ChallengeModal from './ChallengeModal';
import ProgressModal from './ProgressModal';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Difícil';
  duration: string;
  participants: number;
  prize: string;
  startDate: string;
  endDate: string;
  image: string;
  isJoined: boolean;
  category: string;
  requirements: string[];
  rules: string[];
  progress?: number;
  currentProgress?: number;
  targetValue?: number;
  unit?: string;
}

const Retos = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userMetrics, setUserMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChallengesAndMetrics();
  }, []);

  const loadChallengesAndMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Load challenges from database
      const { data: dbChallenges } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      // Load user's challenge progress
      const { data: userChallenges } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id);

      // Load user metrics
      const { data: metrics } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserMetrics(metrics);

      if (dbChallenges) {
        const enrichedChallenges: Challenge[] = dbChallenges.map((challenge) => {
          const userChallenge = userChallenges?.find(uc => uc.challenge_id === challenge.id);
          const isJoined = !!userChallenge;
          
          // Calculate progress based on challenge type and user metrics
          let currentProgress = userChallenge?.current_progress || 0;
          let progress = 0;
          
          if (isJoined && metrics) {
            switch (challenge.challenge_type) {
              case 'steps':
                currentProgress = metrics.steps_today || 0;
                progress = Math.min((currentProgress / challenge.target_value) * 100, 100);
                break;
              case 'calories':
                currentProgress = metrics.calories_burned_today || 0;
                progress = Math.min((currentProgress / challenge.target_value) * 100, 100);
                break;
              case 'workouts':
                currentProgress = metrics.workouts_this_week || 0;
                progress = Math.min((currentProgress / challenge.target_value) * 100, 100);
                break;
              case 'streak':
                currentProgress = metrics.streak_days || 0;
                progress = Math.min((currentProgress / challenge.target_value) * 100, 100);
                break;
            }
          }

          return {
            id: challenge.id,
            title: challenge.title,
            description: challenge.description || '',
            difficulty: 'Intermedio' as const,
            duration: `${challenge.duration_days} días`,
            participants: 0,
            prize: `${challenge.xp_reward} XP`,
            startDate: challenge.start_date,
            endDate: challenge.end_date,
            image: '/api/placeholder/300/200',
            isJoined,
            category: challenge.challenge_type,
            requirements: [],
            rules: [],
            progress: Math.round(progress),
            currentProgress,
            targetValue: challenge.target_value,
            unit: challenge.unit
          };
        });

        setChallenges(enrichedChallenges);
      }
    } catch (error: any) {
      console.error('Error loading challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión",
          variant: "destructive",
        });
        return;
      }

      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      if (challenge.isJoined) {
        // Leave challenge
        await supabase
          .from('user_challenges')
          .delete()
          .eq('user_id', user.id)
          .eq('challenge_id', challengeId);
        
        toast({
          title: "Has abandonado el reto",
          description: "Puedes unirte de nuevo cuando quieras",
        });
      } else {
        // Join challenge
        await supabase
          .from('user_challenges')
          .insert({
            user_id: user.id,
            challenge_id: challengeId,
            current_progress: 0
          });

        toast({
          title: "¡Te has unido al reto!",
          description: `Comenzaste el reto: ${challenge.title}. +50 XP`,
        });
      }

      await loadChallengesAndMetrics();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-success text-success-foreground';
      case 'Intermedio': return 'bg-warning text-warning-foreground';
      case 'Difícil': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen flex items-center justify-center">
        <p>Cargando retos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Retos Fitness
        </h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Metrics Overview */}
        {userMetrics && (
          <Card className="fitness-card p-4 bg-gradient-to-br from-primary/10 to-accent/10">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tus Métricas Hoy
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{userMetrics.steps_today || 0}</p>
                <p className="text-xs text-muted-foreground">Pasos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{userMetrics.calories_burned_today || 0}</p>
                <p className="text-xs text-muted-foreground">Calorías</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{userMetrics.workouts_this_week || 0}</p>
                <p className="text-xs text-muted-foreground">Entrenamientos</p>
              </div>
            </div>
          </Card>
        )}

        {/* My Progress */}
        {challenges.filter(c => c.isJoined).length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Mi Progreso
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProgress(true)}
                className="text-primary"
              >
                Ver más <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              {challenges.filter(c => c.isJoined).map((challenge) => (
                <Card key={challenge.id} className="fitness-card p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{challenge.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{challenge.description}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getDifficultyColor(challenge.difficulty)} text-xs`}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {challenge.duration}
                        </Badge>
                      </div>

                      {/* Real Progress */}
                      <div className="text-sm mb-2">
                        <span className="font-semibold">{challenge.currentProgress}</span> / {challenge.targetValue} {challenge.unit}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso</span>
                      <span className="font-semibold">{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChallenge(challenge)}
                      className="flex-1"
                    >
                      Ver detalles
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJoinChallenge(challenge.id)}
                    >
                      Abandonar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Available Challenges */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Retos Disponibles
          </h2>
          
          <div className="space-y-4">
            {challenges.filter(c => !c.isJoined).map((challenge) => (
              <Card key={challenge.id} className="fitness-card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {challenge.duration}
                      </Badge>
                      <Badge variant="secondary">
                        {challenge.prize}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Meta: <span className="font-semibold text-foreground">{challenge.targetValue} {challenge.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className="fitness-button-primary flex-1"
                  >
                    Unirse al Reto
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChallenge(challenge)}
                    className="flex items-center gap-1"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
      
      <ProgressModal
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        challenges={challenges.filter(c => c.isJoined)}
      />
    </div>
  );
};

export default Retos;
