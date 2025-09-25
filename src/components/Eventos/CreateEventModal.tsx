import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal = ({ isOpen, onClose }: CreateEventModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    address: '',
    instructor: '',
    capacity: '',
    price: '',
    category: '',
    level: '',
    duration: '',
    requirements: '',
    whatToBring: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.description || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "¡Evento creado!",
        description: "Tu evento ha sido creado exitosamente",
      });
      setIsLoading(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        address: '',
        instructor: '',
        capacity: '',
        price: '',
        category: '',
        level: '',
        duration: '',
        requirements: '',
        whatToBring: '',
      });
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Crear Nuevo Evento
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] pr-4 space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título del evento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: Yoga Matutino"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe tu evento fitness..."
                className="min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="spinning">Spinning</SelectItem>
                    <SelectItem value="pilates">Pilates</SelectItem>
                    <SelectItem value="crossfit">CrossFit</SelectItem>
                    <SelectItem value="aqua">Aqua Fitness</SelectItem>
                    <SelectItem value="dance">Dance Fitness</SelectItem>
                    <SelectItem value="funcional">Entrenamiento Funcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Nivel</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principiante">Principiante</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Fecha y Hora</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="time">Hora *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duración</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutos">30 minutos</SelectItem>
                  <SelectItem value="45 minutos">45 minutos</SelectItem>
                  <SelectItem value="60 minutos">60 minutos</SelectItem>
                  <SelectItem value="90 minutos">90 minutos</SelectItem>
                  <SelectItem value="120 minutos">120 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">Ubicación</h3>
            </div>

            <div>
              <Label htmlFor="location">Lugar</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ej: Bodytech 93"
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección completa</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Ej: Calle 93 #11-27, Bogotá"
              />
            </div>
          </div>

          {/* Instructor & Capacity */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                placeholder="Nombre del instructor"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity" className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Capacidad
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="Ej: 20"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="price" className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Precio (COP)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Ej: 25000"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="requirements">Requisitos</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="Requisitos para participar (separados por comas)"
                className="min-h-16"
              />
            </div>

            <div>
              <Label htmlFor="whatToBring">Qué traer</Label>
              <Textarea
                id="whatToBring"
                value={formData.whatToBring}
                onChange={(e) => handleInputChange('whatToBring', e.target.value)}
                placeholder="Elementos que debe traer el participante (separados por comas)"
                className="min-h-16"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="fitness-button-primary"
          >
            {isLoading ? 'Creando...' : 'Crear Evento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;