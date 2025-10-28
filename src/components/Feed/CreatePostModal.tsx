import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Camera, MapPin, X, Package, DollarSign, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import trainerAvatar from '@/assets/trainer-avatar.jpg';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost?: (newPost: any) => void;
}

const CreatePostModal = ({ isOpen, onClose, onCreatePost }: CreatePostModalProps) => {
  const [postType, setPostType] = useState<'regular' | 'marketplace'>('regular');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Marketplace fields
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isService, setIsService] = useState(false);
  
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

    if (postType === 'marketplace') {
      if (!productName || !price || !whatsappNumber) {
        toast({
          title: "Error",
          description: "Completa todos los campos del marketplace",
          variant: "destructive",
        });
        return;
      }
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

      // If marketplace post, create marketplace entry
      if (postType === 'marketplace') {
        const { error: marketplaceError } = await supabase
          .from('marketplace_posts')
          .insert({
            post_id: postData.id,
            product_name: productName,
            price: parseFloat(price),
            currency: 'COP',
            category,
            condition,
            whatsapp_number: whatsappNumber,
            is_service: isService
          });

        if (marketplaceError) throw marketplaceError;
      }

      toast({
        title: "¡Publicación creada!",
        description: "Tu post ha sido compartido exitosamente. +100 XP",
      });
      
      // Reset form
      setContent('');
      setLocation('');
      setImages([]);
      setProductName('');
      setPrice('');
      setCategory('');
      setCondition('');
      setWhatsappNumber('');
      setIsService(false);
      setPostType('regular');
      onClose();
      
      if (onCreatePost) {
        const newPost = {
          user: { id: user.id, name: user.user_metadata?.full_name || 'Usuario', avatar: user.user_metadata?.avatar_url || trainerAvatar },
          content,
          images: uploadedImageUrls,
          timestamp: 'Ahora',
          location: location || 'Mi ubicación',
          tags: content.match(/#\w+/g)?.map(tag => tag.substring(1)) || [],
          postType: postType === 'marketplace' ? (isService ? 'service' : 'product') : 'regular',
          price: postType === 'marketplace' ? `$${parseFloat(price).toLocaleString()} COP` : undefined,
          whatsappNumber: postType === 'marketplace' ? whatsappNumber : undefined
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

          {/* Post Type Tabs */}
          <Tabs value={postType} onValueChange={(v) => setPostType(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="regular">Post Normal</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            </TabsList>

            <TabsContent value="regular" className="space-y-4 mt-4">
              <Textarea
                placeholder="¿Qué quieres compartir sobre tu entrenamiento hoy?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-24 resize-none"
              />

              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Agregar ubicación"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={!isService ? "default" : "outline"}
                  onClick={() => setIsService(false)}
                  className="w-full"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Producto
                </Button>
                <Button
                  type="button"
                  variant={isService ? "default" : "outline"}
                  onClick={() => setIsService(true)}
                  className="w-full"
                >
                  Servicio
                </Button>
              </div>

              <Input
                placeholder="Nombre del producto/servicio"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />

              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Precio en COP"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suplementos">Suplementos</SelectItem>
                  <SelectItem value="equipamiento">Equipamiento</SelectItem>
                  <SelectItem value="ropa">Ropa Deportiva</SelectItem>
                  <SelectItem value="tecnologia">Tecnología</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>

              {!isService && (
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Condición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="como-nuevo">Como Nuevo</SelectItem>
                    <SelectItem value="usado-bueno">Usado - Buen Estado</SelectItem>
                    <SelectItem value="usado-regular">Usado - Regular</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="WhatsApp (ej: +573001234567)"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Textarea
                placeholder="Descripción del producto/servicio"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-20 resize-none"
              />

              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Ubicación (opcional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </TabsContent>
          </Tabs>

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
