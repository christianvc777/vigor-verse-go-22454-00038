import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Calendar, Target } from 'lucide-react';
import { Challenge } from './Retos';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: Challenge[];
}

const ProgressModal = ({ isOpen, onClose, challenges }: ProgressModalProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-success text-success-foreground';
      case 'Intermedio': return 'bg-warning text-warning-foreground';
      case 'Difícil': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getProgressStatus = (progress: number) => {
    if (progress >= 90) return { text: 'Casi completo', color: 'text-success' };
    if (progress >= 70) return { text: 'Excelente progreso', color: 'text-primary' };
    if (progress >= 50) return { text: 'Buen ritmo', color: 'text-warning' };
    return { text: 'Sigue adelante', color: 'text-muted-foreground' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Mi Progreso en Retos
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const status = getProgressStatus(challenge.progress || 0);
              return (
                <div key={challenge.id} className="fitness-card p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {challenge.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {challenge.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progreso actual</span>
                      <span className={`text-sm font-semibold ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completado</span>
                      <span className="font-semibold">{challenge.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-secondary rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300 relative"
                        style={{ width: `${challenge.progress}%` }}
                      >
                        {challenge.progress && challenge.progress > 0 && (
                          <div className="absolute right-0 top-0 h-full w-1 bg-white/30 rounded-r-full" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Challenge Stats */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">Días restantes</span>
                      </div>
                      <p className="text-sm font-semibold">
                        {Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Trophy className="w-4 h-4 text-accent" />
                        <span className="text-xs font-medium">Participantes</span>
                      </div>
                      <p className="text-sm font-semibold">
                        {challenge.participants.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Achievement Prediction */}
                  {challenge.progress && challenge.progress > 0 && (
                    <div className="mt-3 p-2 bg-primary/10 rounded-lg">
                      <p className="text-xs text-center">
                        {challenge.progress >= 90 
                          ? "¡Excelente! Estás a punto de completar este reto 🎉"
                          : challenge.progress >= 70
                          ? "¡Muy bien! Mantén el ritmo para completar el reto 💪"
                          : challenge.progress >= 50
                          ? "Buen progreso. ¡No te rindas ahora! 🚀"
                          : "Cada paso cuenta. ¡Tú puedes lograrlo! 💪"
                        }
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressModal;