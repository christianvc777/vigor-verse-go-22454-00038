import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, ArrowRight, Info } from 'lucide-react';
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
}

const Retos = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  const popularChallenges: Challenge[] = [
    {
      id: '1',
      title: '30 Días de Cardio',
      description: 'Desafío de resistencia cardiovascular por 30 días consecutivos',
      difficulty: 'Intermedio',
      duration: '30 días',
      participants: 1250,
      prize: 'Botella de agua premium + descuento 20%',
      startDate: '2024-10-01',
      endDate: '2024-10-30',
      image: '/api/placeholder/300/200',
      isJoined: false,
      category: 'Cardio',
      requirements: ['Mínimo 30 min de cardio diario', 'Registrar actividad en la app', 'Completar 25 de 30 días'],
      rules: ['No faltar más de 5 días', 'Intensidad mínima moderada', 'Subir evidencia fotográfica'],
    },
    {
      id: '2',
      title: 'Fuerza Total',
      description: 'Incrementa tu fuerza en ejercicios compuestos en 8 semanas',
      difficulty: 'Difícil',
      duration: '8 semanas',
      participants: 890,
      prize: 'Kit de suplementos + asesoría nutricional',
      startDate: '2024-09-15',
      endDate: '2024-11-10',
      image: '/api/placeholder/300/200',
      isJoined: true,
      category: 'Fuerza',
      requirements: ['Realizar test inicial y final', 'Entrenar 4 días por semana', 'Seguir rutina específica'],
      rules: ['Técnica correcta obligatoria', 'Progresión gradual de peso', 'Descanso mínimo entre series'],
    },
    {
      id: '3',
      title: 'Flexibilidad Diaria',
      description: 'Mejora tu flexibilidad con rutinas diarias de stretching',
      difficulty: 'Fácil',
      duration: '21 días',
      participants: 2100,
      prize: 'Mat de yoga premium + clases grupales gratis',
      startDate: '2024-10-05',
      endDate: '2024-10-25',
      image: '/api/placeholder/300/200',
      isJoined: false,
      category: 'Flexibilidad',
      requirements: ['15 minutos diarios de stretching', 'Registrar progreso semanal', 'Completar evaluación inicial'],
      rules: ['Mantener posiciones mínimo 30 segundos', 'No forzar movimientos', 'Calentar antes de estirar'],
    },
  ];

  const myProgress: Challenge[] = [
    {
      id: '2',
      title: 'Fuerza Total',
      description: 'Incrementa tu fuerza en ejercicios compuestos',
      difficulty: 'Difícil',
      duration: '8 semanas',
      participants: 890,
      prize: 'Kit de suplementos',
      startDate: '2024-09-15',
      endDate: '2024-11-10',
      image: '/api/placeholder/300/200',
      isJoined: true,
      category: 'Fuerza',
      requirements: [],
      rules: [],
      progress: 65,
    },
    {
      id: '4',
      title: 'Hidratación Saludable',
      description: 'Mantén una hidratación óptima durante 14 días',
      difficulty: 'Fácil',
      duration: '14 días',
      participants: 1500,
      prize: 'Botella inteligente + plan nutricional',
      startDate: '2024-09-20',
      endDate: '2024-10-04',
      image: '/api/placeholder/300/200',
      isJoined: true,
      category: 'Bienestar',
      requirements: [],
      rules: [],
      progress: 85,
    },
    {
      id: '5',
      title: 'Pasos Diarios 10K',
      description: 'Alcanza 10,000 pasos diarios por 30 días',
      difficulty: 'Intermedio',
      duration: '30 días',
      participants: 950,
      prize: 'Smartwatch fitness + membresía premium',
      startDate: '2024-09-25',
      endDate: '2024-10-25',
      image: '/api/placeholder/300/200',
      isJoined: true,
      category: 'Cardio',
      requirements: [],
      rules: [],
      progress: 42,
    },
  ];

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId);
    // Here you would handle joining the challenge
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-success text-success-foreground';
      case 'Intermedio': return 'bg-warning text-warning-foreground';
      case 'Difícil': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

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
        {/* Popular Challenges */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Populares
          </h2>
          
          <div className="space-y-4">
            {popularChallenges.map((challenge) => (
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
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {challenge.participants.toLocaleString()} participantes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!challenge.isJoined ? (
                    <Button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="fitness-button-primary flex-1"
                    >
                      Unirse
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="flex-1">
                      ✓ Unido
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChallenge(challenge)}
                    className="flex items-center gap-1"
                  >
                    <Info className="w-4 h-4" />
                    Más detalles
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* My Progress */}
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
            {myProgress.map((challenge) => (
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

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedChallenge(challenge)}
                  className="w-full"
                >
                  Ver detalles
                </Button>
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
        challenges={myProgress}
      />
    </div>
  );
};

export default Retos;