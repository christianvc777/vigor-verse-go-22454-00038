import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
}

const EditProfileModal = ({ isOpen, onClose, profile }: EditProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Funcionalidad de edición de perfil próximamente...</p>
          <Button onClick={onClose} className="w-full">Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;