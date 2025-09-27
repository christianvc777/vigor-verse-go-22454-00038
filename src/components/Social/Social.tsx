import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, MessageCircle, UserPlus, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useXP } from '@/contexts/XPContext';
import trainerAvatar from '@/assets/trainer-avatar.jpg';
import UserProfileModal from './UserProfileModal';

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

const Social = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SocialUser | null>(null);
  const [users, setUsers] = useState<SocialUser[]>([
    {
      id: '1',
      name: 'Ana Fitness',
      avatar: trainerAvatar,
      bio: 'Entrenadora personal certificada 💪 Especialista en HIIT y funcional',
      age: 28,
      location: 'Bogotá, Colombia',
      interests: ['HIIT', 'Yoga', 'Nutrición', 'Running'],
      followers: 1254,
      following: 347,
      posts: 89,
      status: 'none',
      isOnline: true,
      fitnessLevel: 'Avanzado'
    },
    {
      id: '2',
      name: 'Carlos Runner',
      avatar: trainerAvatar,
      bio: 'Corredor de maratones 🏃‍♂️ Amante del fitness y vida saludable',
      age: 32,
      location: 'Medellín, Colombia',
      interests: ['Running', 'Crossfit', 'Ciclismo'],
      followers: 890,
      following: 234,
      posts: 156,
      status: 'received',
      isOnline: false,
      fitnessLevel: 'Avanzado'
    },
    {
      id: '3',
      name: 'María Wellness',
      avatar: trainerAvatar,
      bio: 'Coach de wellness y mindfulness 🧘‍♀️ Encuentra tu equilibrio',
      age: 26,
      location: 'Cali, Colombia',
      interests: ['Yoga', 'Meditación', 'Pilates', 'Nutrición'],
      followers: 2103,
      following: 445,
      posts: 203,
      status: 'sent',
      isOnline: true,
      fitnessLevel: 'Intermedio'
    },
    {
      id: '4',
      name: 'Diego Strong',
      avatar: trainerAvatar,
      bio: 'Powerlifter y coach de fuerza 🏋️‍♂️ Construye tu mejor versión',
      age: 30,
      location: 'Barranquilla, Colombia',
      interests: ['Powerlifting', 'Bodybuilding', 'Nutrición'],
      followers: 567,
      following: 189,
      posts: 78,
      status: 'matched',
      isOnline: true,
      fitnessLevel: 'Experto'
    },
    {
      id: '5',
      name: 'Sofía Health',
      avatar: trainerAvatar,
      bio: 'Nutricionista deportiva 🥗 Alimenta tu rendimiento',
      age: 29,
      location: 'Bogotá, Colombia',
      interests: ['Nutrición', 'Cocina saludable', 'Suplementación'],
      followers: 1876,
      following: 392,
      posts: 167,
      status: 'none',
      isOnline: false,
      fitnessLevel: 'Avanzado'
    }
  ]);

  const { toast } = useToast();
  const { addXP, unlockAchievement } = useXP();

  const suggestedUsers = users.filter(user => user.status === 'none').slice(0, 3);
  const pendingRequests = users.filter(user => user.status === 'received');
  const matches = users.filter(user => user.status === 'matched');
  
  const filteredUsers = searchQuery 
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.interests.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : users;

  const handleAction = (userId: string, action: 'follow' | 'like' | 'reject' | 'accept') => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        let newStatus = user.status;
        let message = '';
        
        switch (action) {
          case 'follow':
            newStatus = 'sent';
            message = `Solicitud enviada a ${user.name}`;
            addXP(25, 'Solicitud de amistad enviada');
            break;
          case 'like':
            if (user.status === 'received') {
              newStatus = 'matched';
              message = `¡Match con ${user.name}! 💫`;
              addXP(150, 'Nuevo match creado');
              unlockAchievement('first_match');
            } else {
              newStatus = 'sent';
              message = `Reacción enviada a ${user.name}`;
              addXP(25, 'Reacción enviada');
            }
            break;
          case 'reject':
            newStatus = 'none';
            message = `Solicitud rechazada`;
            break;
          case 'accept':
            newStatus = 'matched';
            message = `¡Match con ${user.name}! 💫`;
            addXP(150, 'Match aceptado');
            unlockAchievement('first_match');
            break;
        }
        
        toast({
          title: message,
          duration: 2000,
        });
        
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const getStatusButton = (user: SocialUser) => {
    switch (user.status) {
      case 'sent':
        return (
          <Button variant="outline" size="sm" disabled>
            <UserPlus className="w-4 h-4 mr-1" />
            Enviado
          </Button>
        );
      case 'received':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handleAction(user.id, 'accept')}
              className="fitness-button-primary"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAction(user.id, 'reject')}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'matched':
        return (
          <Button 
            size="sm"
            onClick={() => window.location.href = '/chat'}
            className="fitness-button-primary"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Chatear
          </Button>
        );
      default:
        return (
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => handleAction(user.id, 'like')}
              className="fitness-button-primary"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAction(user.id, 'follow')}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
          Descubrir
        </h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Solicitudes Pendientes</h3>
            <div className="space-y-3">
              {pendingRequests.map((user) => (
                <Card key={user.id} className="fitness-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 cursor-pointer" onClick={() => setSelectedUser(user)}>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.location}</p>
                    </div>
                    {getStatusButton(user)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Matches */}
        {matches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Tus Matches</h3>
            <div className="space-y-3">
              {matches.map((user) => (
                <Card key={user.id} className="fitness-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 cursor-pointer" onClick={() => setSelectedUser(user)}>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.location}</p>
                      <div className="flex gap-1 mt-1">
                        {user.interests.slice(0, 2).map((interest, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {getStatusButton(user)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Users */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            {searchQuery ? 'Resultados de Búsqueda' : 'Sugerencias Para Ti'}
          </h3>
          <div className="space-y-3">
            {(searchQuery ? filteredUsers : suggestedUsers).map((user) => (
              <Card key={user.id} className="fitness-card p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 cursor-pointer" onClick={() => setSelectedUser(user)}>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{user.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {user.fitnessLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>
                    <p className="text-xs text-muted-foreground mb-2">{user.location} • {user.age} años</p>
                    
                    <div className="flex gap-1 mb-3">
                      {user.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span>{user.followers} seguidores</span>
                      <span>{user.posts} posts</span>
                    </div>
                    
                    <div className="flex justify-end">
                      {getStatusButton(user)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default Social;