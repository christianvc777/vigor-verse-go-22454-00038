import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
}

const ShareModal = ({ isOpen, onClose, profile }: ShareModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg">
        <DialogHeader>
          <DialogTitle>Compartir Perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Opciones para compartir en redes sociales...</p>
          <Button onClick={onClose} className="w-full">Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;