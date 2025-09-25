import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigModal = ({ isOpen, onClose }: ConfigModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Opciones de configuración próximamente...</p>
          <Button onClick={onClose} className="w-full">Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigModal;