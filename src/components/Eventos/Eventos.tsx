import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Plus, Info } from 'lucide-react';
import EventModal from './EventModal';
import CreateEventModal from './CreateEventModal';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  instructor: string;
  capacity: number;
  registered: number;
  price: number;
  category: string;
  image: string;
  isRegistered: boolean;
  requirements: string[];
  whatToBring: string[];
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
}

const Eventos = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Yoga Matutino',
      description: 'Sesión de yoga para comenzar el día con energía positiva y relajación',
      date: '2024-10-15',
      time: '07:00',
      location: 'Bodytech 93',
      address: 'Calle 93 #11-27, Bogotá',
      instructor: 'Ana María González',
      capacity: 20,
      registered: 12,
      price: 25000,
      category: 'Yoga',
      image: '/api/placeholder/300/200',
      isRegistered: false,
      requirements: ['Esterilla de yoga', 'Ropa cómoda', 'Toalla pequeña'],
      whatToBring: ['Botella de agua', 'Esterilla propia (opcional)'],
      duration: '60 minutos',
      level: 'Principiante',
    },
    {
      id: '2',
      title: 'HIIT Intensivo',
      description: 'Entrenamiento de alta intensidad para quemar calorías y tonificar',
      date: '2024-10-16',
      time: '18:30',
      location: 'Smart Fit Chapinero',
      address: 'Carrera 13 #63-42, Bogotá',
      instructor: 'Carlos Ruiz',
      capacity: 15,
      registered: 8,
      price: 35000,
      category: 'HIIT',
      image: '/api/placeholder/300/200',
      isRegistered: true,
      requirements: ['Nivel físico intermedio', 'Calzado deportivo'],
      whatToBring: ['Botella de agua', 'Toalla', 'Ropa deportiva'],
      duration: '45 minutos',
      level: 'Intermedio',
    },
    {
      id: '3',
      title: 'Spinning Challenge',
      description: 'Desafío de spinning con música motivacional y competencia amigable',
      date: '2024-10-18',
      time: '19:00',
      location: 'Gold\'s Gym Zona Rosa',
      address: 'Calle 84 #13-54, Bogotá',
      instructor: 'María Fernanda López',
      capacity: 25,
      registered: 18,
      price: 30000,
      category: 'Spinning',
      image: '/api/placeholder/300/200',
      isRegistered: false,
      requirements: ['Experiencia básica en spinning', 'Resistencia cardiovascular'],
      whatToBring: ['Botella de agua grande', 'Toalla', 'Zapatos con clip (opcional)'],
      duration: '50 minutos',
      level: 'Intermedio',
    },
    {
      id: '4',
      title: 'Aqua Fitness',
      description: 'Ejercicios acuáticos de bajo impacto para todas las edades',
      date: '2024-10-20',
      time: '10:00',
      location: 'Club El Nogal',
      address: 'Carrera 7 #73-55, Bogotá',
      instructor: 'Sandra Morales',
      capacity: 12,
      registered: 7,
      price: 40000,
      category: 'Aqua',
      image: '/api/placeholder/300/200',
      isRegistered: false,
      requirements: ['Saber nadar (básico)', 'Traje de baño'],
      whatToBring: ['Traje de baño', 'Toalla', 'Gafas de natación'],
      duration: '45 minutos',
      level: 'Principiante',
    },
  ]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await (supabase as any)
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    const defaultEvents = [
      {
        id: '1',
        title: 'Yoga Matutino',
        description: 'Sesión de yoga para comenzar el día con energía positiva y relajación',
        date: '2024-10-15',
        time: '07:00',
        location: 'Bodytech 93',
        address: 'Calle 93 #11-27, Bogotá',
        instructor: 'Ana María González',
        capacity: 20,
        registered: 12,
        price: 25000,
        category: 'Yoga',
        image: '/api/placeholder/300/200',
        isRegistered: false,
        requirements: ['Esterilla de yoga', 'Ropa cómoda', 'Toalla pequeña'],
        whatToBring: ['Botella de agua', 'Esterilla propia (opcional)'],
        duration: '60 minutos',
        level: 'Principiante' as const,
      },
      {
        id: '2',
        title: 'HIIT Intensivo',
        description: 'Entrenamiento de alta intensidad para quemar calorías y tonificar',
        date: '2024-10-16',
        time: '18:30',
        location: 'Smart Fit Chapinero',
        address: 'Carrera 13 #63-42, Bogotá',
        instructor: 'Carlos Ruiz',
        capacity: 15,
        registered: 8,
        price: 35000,
        category: 'HIIT',
        image: '/api/placeholder/300/200',
        isRegistered: true,
        requirements: ['Nivel físico intermedio', 'Calzado deportivo'],
        whatToBring: ['Botella de agua', 'Toalla', 'Ropa deportiva'],
        duration: '45 minutos',
        level: 'Intermedio' as const,
      },
      {
        id: '3',
        title: 'Spinning Challenge',
        description: 'Desafío de spinning con música motivacional y competencia amigable',
        date: '2024-10-18',
        time: '19:00',
        location: 'Gold\'s Gym Zona Rosa',
        address: 'Calle 84 #13-54, Bogotá',
        instructor: 'María Fernanda López',
        capacity: 25,
        registered: 18,
        price: 30000,
        category: 'Spinning',
        image: '/api/placeholder/300/200',
        isRegistered: false,
        requirements: ['Experiencia básica en spinning', 'Resistencia cardiovascular'],
        whatToBring: ['Botella de agua grande', 'Toalla', 'Zapatos con clip (opcional)'],
        duration: '50 minutos',
        level: 'Intermedio' as const,
      },
      {
        id: '4',
        title: 'Aqua Fitness',
        description: 'Ejercicios acuáticos de bajo impacto para todas las edades',
        date: '2024-10-20',
        time: '10:00',
        location: 'Club El Nogal',
        address: 'Carrera 7 #73-55, Bogotá',
        instructor: 'Sandra Morales',
        capacity: 12,
        registered: 7,
        price: 40000,
        category: 'Aqua',
        image: '/api/placeholder/300/200',
        isRegistered: false,
        requirements: ['Saber nadar (básico)', 'Traje de baño'],
        whatToBring: ['Traje de baño', 'Toalla', 'Gafas de natación'],
        duration: '45 minutos',
        level: 'Principiante' as const,
      },
    ];

    if (!error && data) {
      const formattedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time,
        location: event.location,
        address: event.location,
        instructor: event.instructor,
        capacity: event.capacity,
        registered: event.registered || 0,
        price: event.price,
        category: event.category,
        image: '/api/placeholder/300/200',
        isRegistered: false,
        requirements: [],
        whatToBring: [],
        duration: '60 minutos',
        level: event.level as 'Principiante' | 'Intermedio' | 'Avanzado',
      }));
      setEvents([...formattedEvents, ...defaultEvents]);
    } else {
      setEvents(defaultEvents);
    }
  };

  const handleRegister = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: !event.isRegistered, registered: event.isRegistered ? event.registered - 1 : event.registered + 1 }
        : event
    ));
  };

  const handleCreateEvent = (newEvent: any) => {
    const event = {
      ...newEvent,
      id: `event-${events.length + 1}`,
      image: '/api/placeholder/300/200',
      isRegistered: false,
      requirements: [],
      whatToBring: [],
      duration: '60 minutos',
      address: newEvent.location,
    };
    setEvents([event, ...events]);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return 'bg-success text-success-foreground';
      case 'Intermedio': return 'bg-warning text-warning-foreground';
      case 'Avanzado': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Eventos
          </h1>
          <Button
            onClick={() => setShowCreateEvent(true)}
            size="sm"
            className="fitness-button-primary rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Crear
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="fitness-card overflow-hidden">
            {/* Event Image Placeholder */}
            <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-primary/60" />
            </div>

            <div className="p-4">
              {/* Event Header */}
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <Badge className={`${getLevelColor(event.level)} text-xs`}>
                    {event.level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
              </div>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(event.date).toLocaleDateString()} - {event.time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-warning" />
                  <span>{event.registered}/{event.capacity} inscritos</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{event.duration}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-lg font-bold text-primary">
                  ${event.price.toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!event.isRegistered ? (
                  <Button
                    onClick={() => handleRegister(event.id)}
                    className="fitness-button-primary flex-1"
                    disabled={event.registered >= event.capacity}
                  >
                    {event.registered >= event.capacity ? 'Agotado' : 'Inscribirse'}
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="flex-1">
                    ✓ Inscrito
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setSelectedEvent(event)}
                  className="flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  Más info
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      
      <CreateEventModal
        isOpen={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default Eventos;