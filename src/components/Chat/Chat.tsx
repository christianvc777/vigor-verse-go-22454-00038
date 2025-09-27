import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Image, Smile, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useXP } from '@/contexts/XPContext';
import trainerAvatar from '@/assets/trainer-avatar.jpg';
import ChatList from './ChatList';

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

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addXP, unlockAchievement } = useXP();

  const chatUsers: ChatUser[] = [
    {
      id: '1',
      name: 'Diego Strong',
      avatar: trainerAvatar,
      isOnline: true
    },
    {
      id: '2',
      name: 'Ana Fitness',
      avatar: trainerAvatar,
      isOnline: false,
      lastSeen: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
    },
    {
      id: '3',
      name: 'María Wellness',
      avatar: trainerAvatar,
      isOnline: true
    }
  ];

  // Initialize sample messages
  useEffect(() => {
    setMessages({
      '1': [
        {
          id: '1',
          text: '¡Hola! ¿Cómo va tu entrenamiento hoy?',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          senderId: '1',
          isRead: true
        },
        {
          id: '2',
          text: '¡Muy bien! Acabo de terminar una sesión de powerlifting increíble 💪',
          timestamp: new Date(Date.now() - 55 * 60 * 1000),
          senderId: 'me',
          isRead: true
        },
        {
          id: '3',
          text: '¡Genial! ¿Qué ejercicios hiciste?',
          timestamp: new Date(Date.now() - 50 * 60 * 1000),
          senderId: '1',
          isRead: true
        }
      ],
      '2': [
        {
          id: '4',
          text: '¿Te gustaría entrenar juntos mañana?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          senderId: '2',
          isRead: false
        }
      ],
      '3': [
        {
          id: '5',
          text: 'Hola! Vi tu post sobre nutrición, muy interesante 🥗',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          senderId: '3',
          isRead: false
        }
      ]
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      senderId: 'me',
      isRead: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), message]
    }));

    setNewMessage('');
    addXP(50, 'Mensaje enviado');
    unlockAchievement('first_chat');

    // Simulate response
    setTimeout(() => {
      const responses = [
        '¡Excelente!',
        'Me parece genial 👍',
        '¿Cuándo podemos entrenar juntos?',
        'Tienes muy buena técnica',
        '¡Sigue así! 💪',
        'Comparte más tips como ese'
      ];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        senderId: selectedChat,
        isRead: false
      };

      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), responseMessage]
      }));
    }, 1000 + Math.random() * 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedChat) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const message: Message = {
          id: Date.now().toString(),
          text: '',
          image: e.target?.result as string,
          timestamp: new Date(),
          senderId: 'me',
          isRead: false
        };

        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), message]
        }));

        addXP(75, 'Imagen enviada');
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedUser = chatUsers.find(user => user.id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  if (!selectedChat) {
    return <ChatList users={chatUsers} messages={messages} onSelectChat={setSelectedChat} />;
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen flex flex-col">
      {/* Chat Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedChat(null)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedUser?.avatar} />
              <AvatarFallback>{selectedUser?.name[0]}</AvatarFallback>
            </Avatar>
            {selectedUser?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
            )}
          </div>
          
          <div className="flex-1">
            <p className="font-semibold">{selectedUser?.name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedUser?.isOnline ? 'En línea' : 
                selectedUser?.lastSeen ? `Activo hace ${Math.floor((Date.now() - selectedUser.lastSeen.getTime()) / (1000 * 60))} min` : 'Desconectado'
              }
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.senderId === 'me' ? 'order-1' : 'order-2'
              }`}>
                <div className={`p-3 rounded-2xl ${
                  message.senderId === 'me' 
                    ? 'bg-primary text-primary-foreground rounded-br-md' 
                    : 'bg-muted rounded-bl-md'
                }`}>
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Shared" 
                      className="w-full h-auto rounded-lg mb-2"
                    />
                  )}
                  {message.text && <p className="text-sm">{message.text}</p>}
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${
                  message.senderId === 'me' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card/80 backdrop-blur-md">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="w-4 h-4" />
              </Button>
              
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="border-0 bg-transparent focus-visible:ring-0 p-0"
              />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="fitness-button-primary rounded-full h-10 w-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default Chat;