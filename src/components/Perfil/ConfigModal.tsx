import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigModal = ({ isOpen, onClose }: ConfigModalProps) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificaciones</Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Recibe notificaciones de nuevos retos, eventos y mensajes
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Modo oscuro</Label>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Activa el tema oscuro para proteger tu vista
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="publicProfile">Perfil público</Label>
              <Switch
                id="publicProfile"
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Permite que otros usuarios vean tu perfil
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold">Privacidad</h3>
            <p className="text-sm text-muted-foreground">
              Control de privacidad y datos personales
            </p>
          </div>

          <Button onClick={onClose} className="w-full">Guardar y Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigModal;