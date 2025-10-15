import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Target } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementsModal = ({ isOpen, onClose }: AchievementsModalProps) => {
  const certificates = [
    {
      id: 1,
      title: 'Certificado de Yoga Avanzado',
      institution: 'FitConnect Academy',
      date: 'Enero 2024',
      hours: '50 horas',
      description: 'Programa completo de yoga avanzado incluyendo técnicas de respiración y meditación',
      icon: Trophy,
    },
    {
      id: 2,
      title: 'Nutrición Deportiva',
      institution: 'Instituto de Salud Integral',
      date: 'Diciembre 2023',
      hours: '40 horas',
      description: 'Especialización en nutrición para deportistas de alto rendimiento',
      icon: Award,
    },
    {
      id: 3,
      title: 'Entrenamiento Funcional',
      institution: 'FitConnect Academy',
      date: 'Octubre 2023',
      hours: '60 horas',
      description: 'Certificación en entrenamiento funcional y cross training',
      icon: Target,
    },
    {
      id: 4,
      title: 'Primeros Auxilios Deportivos',
      institution: 'Cruz Roja Colombiana',
      date: 'Agosto 2023',
      hours: '30 horas',
      description: 'Capacitación en atención de emergencias y primeros auxilios en actividades deportivas',
      icon: Award,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">🏆 Certificados y Logros</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {certificates.map((cert) => {
            const Icon = cert.icon;
            return (
              <Card key={cert.id} className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">{cert.institution}</p>
                      <p className="text-sm">{cert.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{cert.date}</Badge>
                        <Badge variant="outline">{cert.hours}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementsModal;
