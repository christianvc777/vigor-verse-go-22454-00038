import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, MapPin, Users, Clock, User, DollarSign, CheckCircle, Package } from 'lucide-react';
import { Event } from './Eventos';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return 'bg-success text-success-foreground';
      case 'Intermedio': return 'bg-warning text-warning-foreground';
      case 'Avanzado': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleRegister = () => {
    console.log('Registering for event:', event.id);
    // Handle registration logic here
    onClose();
  };

  const availableSpots = event.capacity - event.registered;
  const isFullyBooked = availableSpots <= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6 text-primary" />
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Event Image Placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-16 h-16 text-primary/60" />
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getLevelColor(event.level)}>
                  {event.level}
                </Badge>
                <Badge variant="outline">
                  {event.category}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{event.description}</p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* Date & Time */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Fecha y Hora
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Fecha:</span> {new Date(event.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><span className="font-medium">Hora:</span> {event.time}</p>
                  <p><span className="font-medium">Duración:</span> {event.duration}</p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Ubicación
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Lugar:</span> {event.location}</p>
                  <p><span className="font-medium">Dirección:</span> {event.address}</p>
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Instructor
                </h3>
                <p className="text-sm">{event.instructor}</p>
              </div>

              {/* Capacity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-warning" />
                    Cupos
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>Inscritos: <span className="font-medium">{event.registered}</span></p>
                    <p>Capacidad: <span className="font-medium">{event.capacity}</span></p>
                    <p className={`font-medium ${isFullyBooked ? 'text-destructive' : 'text-success'}`}>
                      {isFullyBooked ? 'Agotado' : `${availableSpots} disponibles`}
                    </p>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Precio
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    ${event.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Requisitos
              </h3>
              <ul className="space-y-2">
                {event.requirements.map((req, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Bring */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Qué traer
              </h3>
              <ul className="space-y-2">
                {event.whatToBring.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <Package className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Registration Status */}
            {event.isRegistered && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-success">Ya estás inscrito en este evento</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Recibirás un recordatorio 24 horas antes del evento.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
          {!event.isRegistered ? (
            <Button 
              onClick={handleRegister} 
              className="fitness-button-primary flex-1"
              disabled={isFullyBooked}
            >
              {isFullyBooked ? 'Evento Agotado' : 'Inscribirse'}
            </Button>
          ) : (
            <Button variant="outline" disabled className="flex-1">
              ✓ Ya inscrito
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;