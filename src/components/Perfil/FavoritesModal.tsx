import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, Trophy } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesModal = ({ isOpen, onClose }: FavoritesModalProps) => {
  const favorites = [
    {
      id: 1,
      type: 'post',
      title: 'Rutina de cardio intenso',
      author: 'Carlos Fitness',
      likes: 234,
    },
    {
      id: 2,
      type: 'event',
      title: 'Yoga Matutino',
      date: '2024-10-15',
      location: 'Bodytech 93',
    },
    {
      id: 3,
      type: 'challenge',
      title: 'Desafío 30 días',
      progress: 75,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Favoritos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {favorites.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start gap-3">
                {item.type === 'post' && <Heart className="w-5 h-5 text-red-500 mt-1" />}
                {item.type === 'event' && <Calendar className="w-5 h-5 text-primary mt-1" />}
                {item.type === 'challenge' && <Trophy className="w-5 h-5 text-warning mt-1" />}
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.type === 'post' && (
                    <p className="text-sm text-muted-foreground">
                      Por {item.author} · {item.likes} me gusta
                    </p>
                  )}
                  {item.type === 'event' && (
                    <p className="text-sm text-muted-foreground">
                      {item.date} · {item.location}
                    </p>
                  )}
                  {item.type === 'challenge' && (
                    <div className="mt-2">
                      <Badge variant="secondary">{item.progress}% completado</Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          <Button onClick={onClose} className="w-full">Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesModal;