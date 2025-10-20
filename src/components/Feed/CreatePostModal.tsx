import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, MapPin, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import trainerAvatar from '@/assets/trainer-avatar.jpg';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost?: (newPost: any) => void;
}

const CreatePostModal = ({ isOpen, onClose, onCreatePost }: CreatePostModalProps) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const user = {
    name: 'Mi Usuario',
    avatar: trainerAvatar,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe algo para tu publicación",
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
          description: "Debes iniciar sesión para crear publicaciones",
          variant: "destructive",
        });
        return;
      }

      // Upload images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      
      for (const image of images) {
        const base64Data = image.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.jpg`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, blob);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        
        uploadedImageUrls.push(publicUrl);

        // Track storage usage
        await supabase.from('storage_usage').insert({
          user_id: user.id,
          file_path: fileName,
          file_size: blob.size,
          bucket_name: 'post-images'
        });
      }

      // Create post in database
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          image_urls: uploadedImageUrls,
          location: location || null
        })
        .select()
        .single();

      if (postError) throw postError;

      toast({
        title: "¡Publicación creada!",
        description: "Tu post ha sido compartido exitosamente. +100 XP",
      });
      
      setContent('');
      setLocation('');
      setImages([]);
      onClose();
      
      if (onCreatePost) {
        const newPost = {
          user: { id: user.id, name: user.user_metadata?.full_name || 'Usuario', avatar: user.user_metadata?.avatar_url || trainerAvatar },
          content,
          images: uploadedImageUrls,
          timestamp: 'Ahora',
          location: location || 'Mi ubicación',
          tags: content.match(/#\w+/g)?.map(tag => tag.substring(1)) || [],
          postType: 'regular' as const
        };
        onCreatePost(newPost);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la publicación",
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
          <DialogTitle className="text-center">Crear Publicación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">Comparte tu experiencia fitness</p>
            </div>
          </div>

          {/* Content */}
          <Textarea
            placeholder="¿Qué quieres compartir sobre tu entrenamiento hoy?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-24 resize-none"
          />

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Agregar ubicación"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Images Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Images */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary-dark">
              <Camera className="w-5 h-5" />
              <span className="text-sm font-medium">Agregar fotos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

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
              {isLoading ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;