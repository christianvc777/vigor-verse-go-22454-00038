import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Calendar, 
  Heart,
  Flame,
  Timer,
  Trophy,
  Users,
  Zap
} from 'lucide-react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    workouts: number;
    calories: number;
    steps: number;
    progress: number;
  };
}

const DashboardModal = ({ isOpen, onClose, stats }: DashboardModalProps) => {
  const monthlyData = {
    totalWorkouts: 22,
    totalCalories: 12450,
    totalSteps: 189230,
    averageHeartRate: 142,
    strengthSessions: 12,
    cardioSessions: 10,
    restDays: 9,
    personalBests: 3,
  };

  const weeklyProgress = [
    { day: 'Lun', value: 85 },
    { day: 'Mar', value: 92 },
    { day: 'Mié', value: 78 },
    { day: 'Jue', value: 95 },
    { day: 'Vie', value: 88 },
    { day: 'Sáb', value: 76 },
    { day: 'Dom', value: 65 },
  ];

  const bodyMetrics = {
    weight: { current: 75.2, change: -1.8, unit: 'kg' },
    bodyFat: { current: 12.5, change: -2.1, unit: '%' },
    muscle: { current: 42.8, change: +1.3, unit: 'kg' },
    bmi: { current: 22.1, change: -0.4, unit: '' },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Dashboard Fitness Profesional
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="dashboard-card">
                <div className="text-center">
                  <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{monthlyData.totalWorkouts}</p>
                  <p className="text-sm text-muted-foreground">Entrenamientos</p>
                  <p className="text-xs text-success mt-1">Este mes</p>
                </div>
              </Card>

              <Card className="dashboard-card">
                <div className="text-center">
                  <Flame className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold">{monthlyData.totalCalories.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Calorías</p>
                  <p className="text-xs text-success mt-1">Quemadas</p>
                </div>
              </Card>

              <Card className="dashboard-card">
                <div className="text-center">
                  <Target className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{(monthlyData.totalSteps / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Pasos</p>
                  <p className="text-xs text-primary mt-1">Totales</p>
                </div>
              </Card>

              <Card className="dashboard-card">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{monthlyData.averageHeartRate}</p>
                  <p className="text-sm text-muted-foreground">FC Promedio</p>
                  <p className="text-xs text-warning mt-1">BPM</p>
                </div>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card className="dashboard-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Progreso Semanal
              </h3>
              <div className="space-y-3">
                {weeklyProgress.map((day) => (
                  <div key={day.day} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{day.day}</span>
                    <div className="flex-1 bg-secondary rounded-full h-3 relative">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                        style={{ width: `${day.value}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8">{day.value}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Training Distribution */}
            <Card className="dashboard-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Distribución de Entrenamientos
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fuerza</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(monthlyData.strengthSessions / monthlyData.totalWorkouts) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8">{monthlyData.strengthSessions}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cardio</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${(monthlyData.cardioSessions / monthlyData.totalWorkouts) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8">{monthlyData.cardioSessions}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Descanso</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div
                        className="bg-muted-foreground h-2 rounded-full"
                        style={{ width: `${(monthlyData.restDays / 31) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8">{monthlyData.restDays}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Body Metrics */}
            <Card className="dashboard-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Métricas Corporales
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(bodyMetrics).map(([key, metric]) => (
                  <div key={key} className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-lg font-bold">
                      {metric.current}{metric.unit}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize mb-1">
                      {key === 'bodyFat' ? 'Grasa Corporal' : 
                       key === 'muscle' ? 'Masa Muscular' :
                       key === 'weight' ? 'Peso' : 'IMC'}
                    </p>
                    <div className={`text-xs flex items-center justify-center gap-1 ${
                      metric.change > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${metric.change > 0 ? '' : 'rotate-180'}`} />
                      {Math.abs(metric.change)}{metric.unit}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievement Highlights */}
            <Card className="dashboard-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Logros Recientes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-success/10 rounded-lg">
                  <Trophy className="w-5 h-5 text-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">¡Nuevo Récord Personal!</p>
                    <p className="text-xs text-muted-foreground">Press de banca: 85kg</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Meta Semanal Cumplida</p>
                    <p className="text-xs text-muted-foreground">5 entrenamientos completados</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-accent/10 rounded-lg">
                  <Flame className="w-5 h-5 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Racha de Constancia</p>
                    <p className="text-xs text-muted-foreground">12 días consecutivos</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Monthly Summary */}
            <Card className="dashboard-card bg-gradient-to-br from-primary/10 to-accent/10">
              <h3 className="font-semibold mb-3 text-center">Resumen del Mes</h3>
              <div className="text-center space-y-2">
                <p className="text-sm">
                  <span className="font-bold text-primary">{monthlyData.personalBests}</span> récords personales batidos
                </p>
                <p className="text-sm">
                  Promedio de <span className="font-bold text-accent">{(monthlyData.totalWorkouts / 4).toFixed(1)}</span> entrenamientos por semana
                </p>
                <div className="mt-4 p-2 bg-card rounded-lg">
                  <p className="text-xs text-muted-foreground">Tu rendimiento está</p>
                  <p className="font-bold text-success">23% por encima del promedio</p>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardModal;