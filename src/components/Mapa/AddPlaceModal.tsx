import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceAdded: () => void;
}

const AddPlaceModal = ({ isOpen, onClose, onPlaceAdded }: AddPlaceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: '',
    phone: '',
    website: '',
    latitude: '',
    longitude: '',
    monthlyPrice: ''
  });
  const [image, setImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.category) {
      toast({
        title: "Error",
        description: "Completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

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

      // Upload image if exists
      let imageUrl = '';
      if (image) {
        const base64Data = image.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        const fileName = `places/${user.id}/${Date.now()}.jpg`;
        
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, blob);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Default coordinates for Bogotá if not provided
      const lat = formData.latitude || '4.7110';
      const lng = formData.longitude || '-74.0721';

      const { error } = await supabase
        .from('places')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          address: formData.address,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          category: formData.category,
          image_url: imageUrl || null,
          phone: formData.phone || null,
          website: formData.website || null,
          rating: 0,
          monthly_price: formData.monthlyPrice ? parseFloat(formData.monthlyPrice) : null
        });

      if (error) throw error;

      toast({
        title: "¡Lugar agregado!",
        description: "Tu lugar ha sido publicado exitosamente. +75 XP",
      });

      onPlaceAdded();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        category: '',
        phone: '',
        website: '',
        latitude: '',
        longitude: '',
        monthlyPrice: ''
      });
      setImage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el lugar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Lugar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nombre del lugar *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría *" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gimnasio">Gimnasio</SelectItem>
              <SelectItem value="Estudio">Estudio de Yoga/Pilates</SelectItem>
              <SelectItem value="Parque">Parque</SelectItem>
              <SelectItem value="Piscina">Piscina</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Descripción del lugar"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-20"
          />

          <Input
            placeholder="Dirección completa *"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Latitud (opcional)"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            />
            <Input
              placeholder="Longitud (opcional)"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            />
          </div>

          <Input
            placeholder="Teléfono (opcional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            placeholder="Sitio web (opcional)"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />

          <Input
            placeholder="Precio mensual (opcional, ej: 150000)"
            type="number"
            value={formData.monthlyPrice}
            onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
          />

          {/* Image Preview */}
          {image && (
            <div className="relative">
              <img
                src={image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-8 h-8"
                onClick={() => setImage('')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Add Image */}
          <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary-dark">
            <Camera className="w-5 h-5" />
            <span className="text-sm font-medium">Agregar foto del lugar</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="fitness-button-primary"
            >
              {isLoading ? 'Agregando...' : 'Agregar Lugar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlaceModal;
