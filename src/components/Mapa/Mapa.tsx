import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Star, Clock, Phone, Navigation } from 'lucide-react';
import gymHero from '@/assets/gym-hero.jpg';

export interface Location {
  id: string;
  name: string;
  type: 'Gimnasio' | 'Estudio' | 'Parque' | 'Piscina';
  address: string;
  rating: number;
  distance: string;
  image: string;
  amenities: string[];
  hours: string;
  phone?: string;
  priceRange: string;
  description: string;
}

const Mapa = () => {
  const [selectedType, setSelectedType] = useState<string>('Todos');

  const locations: Location[] = [
    {
      id: '1',
      name: 'Bodytech La 93',
      type: 'Gimnasio',
      address: 'Calle 93 #11-27, Chapinero, Bogotá',
      rating: 4.5,
      distance: '0.8 km',
      image: gymHero,
      amenities: ['Pesas', 'Cardio', 'Clases grupales', 'Piscina', 'Sauna'],
      hours: 'Lun-Vie: 5:00-23:00 | Sáb-Dom: 6:00-20:00',
      phone: '+57 1 555-0123',
      priceRange: '$$$$',
      description: 'Gimnasio premium con equipos de última tecnología y amplia variedad de clases.'
    },
    {
      id: '2',
      name: 'Smart Fit Chapinero',
      type: 'Gimnasio',
      address: 'Carrera 13 #63-42, Chapinero, Bogotá',
      rating: 4.2,
      distance: '1.2 km',
      image: gymHero,
      amenities: ['Pesas', 'Cardio', 'Clases', 'App Smart Fit'],
      hours: 'Lun-Dom: 6:00-22:00',
      phone: '+57 1 555-0124',
      priceRange: '$$',
      description: 'Cadena de gimnasios accesible con equipos modernos y ambiente energético.'
    },
    {
      id: '3',
      name: 'Gold\'s Gym Zona Rosa',
      type: 'Gimnasio',
      address: 'Calle 84 #13-54, Zona Rosa, Bogotá',
      rating: 4.7,
      distance: '1.5 km',
      image: gymHero,
      amenities: ['Pesas libres', 'CrossFit', 'Spinning', 'Entrenador personal'],
      hours: 'Lun-Vie: 5:30-23:00 | Sáb-Dom: 7:00-21:00',
      phone: '+57 1 555-0125',
      priceRange: '$$$',
      description: 'Legendario gimnasio enfocado en fuerza y entrenamiento de alto rendimiento.'
    },
    {
      id: '4',
      name: 'Parque El Virrey',
      type: 'Parque',
      address: 'Carrera 15 con Calle 88, Chapinero, Bogotá',
      rating: 4.6,
      distance: '0.5 km',
      image: gymHero,
      amenities: ['Ciclovía', 'Senderos', 'Máquinas outdoor', 'Zona de estiramiento'],
      hours: '24 horas',
      priceRange: 'Gratis',
      description: 'Parque lineal perfecto para correr, caminar y ejercitarse al aire libre.'
    },
    {
      id: '5',
      name: 'Studio Yoga Zen',
      type: 'Estudio',
      address: 'Carrera 11 #70-25, Chapinero, Bogotá',
      rating: 4.8,
      distance: '0.9 km',
      image: gymHero,
      amenities: ['Yoga', 'Meditación', 'Pilates', 'Props incluidos'],
      hours: 'Lun-Vie: 6:00-21:00 | Sáb-Dom: 8:00-18:00',
      phone: '+57 1 555-0126',
      priceRange: '$$$',
      description: 'Estudio especializado en yoga y bienestar mental con instructores certificados.'
    },
    {
      id: '6',
      name: 'Piscina Club El Nogal',
      type: 'Piscina',
      address: 'Carrera 7 #73-55, Chapinero, Bogotá',
      rating: 4.4,
      distance: '2.0 km',
      image: gymHero,
      amenities: ['Piscina olímpica', 'Aqua fitness', 'Natación', 'Hidromasaje'],
      hours: 'Lun-Dom: 6:00-20:00',
      phone: '+57 1 555-0127',
      priceRange: '$$$$',
      description: 'Club exclusivo con instalaciones acuáticas de primera clase.'
    }
  ];

  const locationTypes = ['Todos', 'Gimnasio', 'Estudio', 'Parque', 'Piscina'];

  const filteredLocations = selectedType === 'Todos' 
    ? locations 
    : locations.filter(location => location.type === selectedType);

  const openInGoogleMaps = () => {
    const query = encodeURIComponent('Bodytech Bogotá');
    const url = `https://www.google.com/maps/search/${query}`;
    window.open(url, '_blank');
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case 'Gratis': return 'text-success';
      case '$': return 'text-success';
      case '$$': return 'text-warning';
      case '$$$': return 'text-primary';
      case '$$$$': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Mapa Wellness
          </h1>
          <Button
            onClick={openInGoogleMaps}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={gymHero}
          alt="Mapa de ubicaciones fitness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-lg font-semibold">6 ubicaciones encontradas</h2>
          <p className="text-sm opacity-90">En tu área de Chapinero</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {locationTypes.map((type) => (
            <Button
              key={type}
              onClick={() => setSelectedType(type)}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${
                selectedType === type ? 'fitness-button-primary' : ''
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Locations List */}
      <div className="px-4 pb-4 space-y-4">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="fitness-card overflow-hidden">
            {/* Location Image */}
            <div className="h-32 relative overflow-hidden">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-black/70 text-white border-0">
                  {location.distance}
                </Badge>
              </div>
            </div>

            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {location.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{location.rating}</span>
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${getPriceColor(location.priceRange)}`}>
                  {location.priceRange}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{location.address}</p>
              </div>

              {/* Description */}
              <p className="text-sm mb-3">{location.description}</p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-3">
                {location.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {location.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{location.amenities.length - 3} más
                  </Badge>
                )}
              </div>

              {/* Hours & Contact */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{location.hours}</span>
                </div>
                {location.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{location.phone}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const query = encodeURIComponent(location.name + ' ' + location.address);
                    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
                  }}
                  className="fitness-button-primary flex-1"
                >
                  Ver en Google Maps
                </Button>
                <Button variant="outline" size="icon">
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Mapa;