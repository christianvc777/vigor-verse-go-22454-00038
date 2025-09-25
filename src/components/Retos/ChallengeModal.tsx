import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Users, Calendar, Gift, CheckCircle, Clock } from 'lucide-react';
import { Challenge } from './Retos';

interface ChallengeModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeModal = ({ challenge, isOpen, onClose }: ChallengeModalProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-success text-success-foreground';
      case 'Intermedio': return 'bg-warning text-warning-foreground';
      case 'Difícil': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleJoin = () => {
    console.log('Joining challenge:', challenge.id);
    // Handle join logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-6 h-6 text-primary" />
            {challenge.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Challenge Image Placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-16 h-16 text-primary/60" />
            </div>

            {/* Basic Info */}
            <div>
              <p className="text-muted-foreground mb-4">{challenge.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {challenge.duration}
                </Badge>
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {challenge.participants.toLocaleString()}
                </Badge>
              </div>
            </div>

            {/* Duration & Dates */}
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Fechas del Reto
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Inicio</p>
                  <p className="font-medium">{new Date(challenge.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Final</p>
                  <p className="font-medium">{new Date(challenge.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Prize */}
            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Gift className="w-5 h-5 text-accent" />
                Premio
              </h3>
              <p className="text-sm">{challenge.prize}</p>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Requisitos
              </h3>
              <ul className="space-y-2">
                {challenge.requirements.map((req, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rules */}
            <div>
              <h3 className="font-semibold mb-3">Reglas del Reto</h3>
              <ul className="space-y-2">
                {challenge.rules.map((rule, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-primary mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress (if joined) */}
            {challenge.isJoined && challenge.progress !== undefined && (
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Tu Progreso</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completado</span>
                  <span className="font-semibold">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
          {!challenge.isJoined ? (
            <Button onClick={handleJoin} className="fitness-button-primary flex-1">
              Unirse al Reto
            </Button>
          ) : (
            <Button variant="outline" disabled className="flex-1">
              ✓ Ya estás participando
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeModal;