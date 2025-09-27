import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  text: string;
  image?: string;
  timestamp: Date;
  senderId: string;
  isRead: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface ChatListProps {
  users: ChatUser[];
  messages: Record<string, Message[]>;
  onSelectChat: (userId: string) => void;
}

const ChatList = ({ users, messages, onSelectChat }: ChatListProps) => {
  const getLastMessage = (userId: string) => {
    const userMessages = messages[userId] || [];
    return userMessages[userMessages.length - 1];
  };

  const getUnreadCount = (userId: string) => {
    const userMessages = messages[userId] || [];
    return userMessages.filter(msg => !msg.isRead && msg.senderId !== 'me').length;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Chats
        </h1>
      </div>

      {/* Chat List */}
      <div className="p-4">
        <div className="space-y-2">
          {users.map((user) => {
            const lastMessage = getLastMessage(user.id);
            const unreadCount = getUnreadCount(user.id);

            return (
              <Card
                key={user.id}
                className="fitness-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onSelectChat(user.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{user.name}</p>
                      {lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage ? (
                          lastMessage.image ? 
                            (lastMessage.senderId === 'me' ? 'Enviaste una imagen' : 'Imagen recibida') :
                            lastMessage.text
                        ) : (
                          'No hay mensajes'
                        )}
                      </p>
                      
                      {unreadCount > 0 && (
                        <Badge className="fitness-button-primary rounded-full min-w-5 h-5 text-xs flex items-center justify-center">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold mb-2">No tienes chats</h3>
            <p className="text-muted-foreground">
              Haz match con alguien para empezar a chatear
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;