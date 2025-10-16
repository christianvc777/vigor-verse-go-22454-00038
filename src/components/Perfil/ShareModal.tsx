import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Facebook, MessageCircle, Mail, Copy } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
}

const ShareModal = ({ isOpen, onClose, profile }: ShareModalProps) => {
  const { toast } = useToast();
  const profileUrl = `https://teso.app/perfil/${profile.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'Enlace copiado',
      description: 'El enlace de tu perfil ha sido copiado',
    });
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => window.open(`https://wa.me/?text=¡Mira mi perfil en Teso! ${profileUrl}`, '_blank'),
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${profileUrl}`, '_blank'),
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => window.open(`mailto:?subject=Mi perfil en Teso&body=¡Mira mi perfil! ${profileUrl}`, '_blank'),
    },
    {
      name: 'Copiar enlace',
      icon: Copy,
      action: copyToClipboard,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg">
        <DialogHeader>
          <DialogTitle>Compartir Perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Comparte tu perfil con amigos y familiares
          </p>
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={option.action}
              >
                <option.icon className="w-6 h-6" />
                <span className="text-sm">{option.name}</span>
              </Button>
            ))}
          </div>
          <Button onClick={onClose} className="w-full">Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;