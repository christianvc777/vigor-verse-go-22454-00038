import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, UserPlus, X, Check, MapPin, Calendar } from 'lucide-react';

interface SocialUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  age: number;
  location: string;
  interests: string[];
  followers: number;
  following: number;
  posts: number;
  status: 'none' | 'sent' | 'received' | 'matched' | 'following';
  isOnline: boolean;
  fitnessLevel: string;
}

interface UserProfileModalProps {
  user: SocialUser;
  isOpen: boolean;
  onClose: () => void;
  onAction: (userId: string, action: 'follow' | 'like' | 'reject' | 'accept') => void;
}

const UserProfileModal = ({ user, isOpen, onClose, onAction }: UserProfileModalProps) => {
  const getActionButtons = () => {
    switch (user.status) {
      case 'sent':
        return (
          <Button variant="outline" disabled className="flex-1">
            <UserPlus className="w-4 h-4 mr-2" />
            Solicitud Enviada
          </Button>
        );
      case 'received':
        return (
          <div className="flex gap-3">
            <Button 
              onClick={() => onAction(user.id, 'accept')}
              className="fitness-button-primary flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              Aceptar
            </Button>
            <Button 
              variant="outline"
              onClick={() => onAction(user.id, 'reject')}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Rechazar
            </Button>
          </div>
        );
      case 'matched':
        return (
          <Button 
            onClick={() => window.location.href = '/chat'}
            className="fitness-button-primary flex-1"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Enviar Mensaje
          </Button>
        );
      default:
        return (
          <div className="flex gap-3">
            <Button 
              onClick={() => onAction(user.id, 'like')}
              className="fitness-button-primary flex-1"
            >
              <Heart className="w-4 h-4 mr-2" />
              Me Gusta
            </Button>
            <Button 
              variant="outline"
              onClick={() => onAction(user.id, 'follow')}
              className="flex-1"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Seguir
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content max-w-md">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 rounded-full border-3 border-card"></div>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <Badge variant="outline">{user.fitnessLevel}</Badge>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
              <span>•</span>
              <Calendar className="w-4 h-4" />
              <span>{user.age} años</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around py-4 border-y border-border">
            <div className="text-center">
              <div className="text-xl font-bold">{user.posts}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{user.followers}</div>
              <div className="text-sm text-muted-foreground">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{user.following}</div>
              <div className="text-sm text-muted-foreground">Siguiendo</div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="font-semibold mb-2">Sobre mí</h3>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          </div>

          {/* Interests */}
          <div>
            <h3 className="font-semibold mb-2">Intereses</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4">
            {getActionButtons()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;