import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useXP } from '@/contexts/XPContext';
import CreatePostModal from './CreatePostModal';
import WearableSync from './WearableSync';
import CheckoutFlow from '../Marketplace/CheckoutFlow';
import workoutPost1 from '@/assets/workout-post-1.jpg';
import gymEquipmentPost from '@/assets/gym-equipment-post.jpg';
import healthyMealPost from '@/assets/healthy-meal-post.jpg';
import doctorSpecialist from '@/assets/doctor-specialist.jpg';
import proteinSupplements from '@/assets/protein-supplements.jpg';
import smartwatchFitness from '@/assets/smartwatch-fitness.jpg';
import proteinShakePost from '@/assets/protein-shake-post.jpg';
import healthyFoodPost from '@/assets/healthy-food-post.jpg';
import fitnessPointsTrainer from '@/assets/fitness-tips-trainer.jpg';
import trainerAvatar from '@/assets/trainer-avatar.jpg';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  timestamp: string;
  location: string;
  isLiked: boolean;
  tags?: string[];
  postType?: 'regular' | 'service' | 'product' | 'recipe' | 'specialist';
  price?: string;
  whatsappNumber?: string;
}

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: string]: number}>({});
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Carlos Fitness',
        avatar: trainerAvatar,
      },
      content: '¡Increíble sesión de entrenamiento hoy! 💪 Recuerden que la constancia es clave. #NoExcuses #FitnessMotivation',
      images: [workoutPost1],
      likes: 128,
      comments: 24,
      timestamp: 'Hace 2 horas',
      location: 'Bodytech La 93',
      isLiked: false,
      tags: ['fitness', 'workout', 'motivation'],
      postType: 'regular'
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'María Wellness',
        avatar: trainerAvatar,
      },
      content: 'Meal prep del domingo 🥗 Una buena alimentación es el 70% del éxito. ¿Cuál es tu comida favorita post-entrenamiento?',
      images: [healthyMealPost],
      likes: 89,
      comments: 15,
      timestamp: 'Hace 4 horas',
      location: 'Smart Fit Chapinero',
      isLiked: true,
      tags: ['nutrition', 'mealprep', 'healthy'],
      postType: 'regular'
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Team FitClub',
        avatar: trainerAvatar,
      },
      content: '¡Clase grupal de HIIT completada! 🔥 La energía del grupo es incomparable. ¡Nos vemos mañana para más!',
      images: [gymEquipmentPost],
      likes: 156,
      comments: 32,
      timestamp: 'Hace 6 horas',
      location: 'Gold\'s Gym Zona Rosa',
      isLiked: false,
      tags: ['hiit', 'group', 'energy'],
      postType: 'regular'
    },
    {
      id: '4',
      user: {
        id: '4',
        name: 'Dr. Ana Rodríguez',
        avatar: trainerAvatar,
      },
      content: '🩺 Consultas virtuales de medicina deportiva disponibles. Evaluación postural, lesiones y planes de recuperación personalizados.',
      images: [doctorSpecialist],
      likes: 67,
      comments: 12,
      timestamp: 'Hace 1 hora',
      location: 'Clínica Deportiva Médica',
      isLiked: false,
      tags: ['medicina', 'consulta', 'deportiva'],
      postType: 'service',
      price: '$150.000 COP',
      whatsappNumber: '+573001234567'
    },
    {
      id: '5',
      user: {
        id: '5',
        name: 'FitStore Colombia',
        avatar: trainerAvatar,
      },
      content: '💪 Proteína Whey Premium con 25g de proteína por porción. ¡Perfecta para tu post-entreno! Envío gratis en Bogotá.',
      images: [proteinSupplements],
      likes: 203,
      comments: 38,
      timestamp: 'Hace 3 horas',
      location: 'Tienda Online',
      isLiked: false,
      tags: ['proteina', 'suplementos', 'whey'],
      postType: 'product',
      price: '$89.000 COP',
      whatsappNumber: '+573009876543'
    },
    {
      id: '6',
      user: {
        id: '6',
        name: 'TechFit Store',
        avatar: trainerAvatar,
      },
      content: '⌚ Apple Watch Series 9 - Tu compañero perfecto de entrenamiento. Monitoreo de signos vitales, GPS, resistente al agua.',
      images: [smartwatchFitness],
      likes: 445,
      comments: 76,
      timestamp: 'Hace 5 horas',
      location: 'Centro Comercial Andino',
      isLiked: true,
      tags: ['smartwatch', 'apple', 'tecnologia'],
      postType: 'product',
      price: '$1.299.000 COP',
      whatsappNumber: '+573005555555'
    },
    {
      id: '7',
      user: {
        id: '7',
        name: 'Chef Saludable Laura',
        avatar: trainerAvatar,
      },
      content: '🥘 Receta: Bandeja Paisa Saludable - Versión fitness de nuestro plato tradicional. Rica en proteína y baja en grasa.',
      images: [proteinShakePost],
      likes: 312,
      comments: 89,
      timestamp: 'Hace 8 horas',
      location: 'Cocina Fitness',
      isLiked: false,
      tags: ['receta', 'colombiana', 'saludable'],
      postType: 'recipe'
    },
    {
      id: '8',
      user: {
        id: '8',
        name: 'NutriVida',
        avatar: trainerAvatar,
      },
      content: '🥗 Bowl de Quinoa Power: La combinación perfecta de proteínas vegetales y nutrientes. ¡Energía para todo el día!',
      images: [healthyFoodPost],
      likes: 178,
      comments: 45,
      timestamp: 'Hace 12 horas',
      location: 'Restaurante Saludable',
      isLiked: true,
      tags: ['quinoa', 'vegetariano', 'bowl'],
      postType: 'recipe'
    },
    {
      id: '9',
      user: {
        id: '9',
        name: 'Coach Fitness Pro',
        avatar: trainerAvatar,
      },
      content: '💡 TIP: La hidratación es clave para el rendimiento. Bebe agua antes, durante y después del ejercicio. ¡Tu cuerpo te lo agradecerá!',
      images: [fitnessPointsTrainer],
      likes: 267,
      comments: 34,
      timestamp: 'Hace 1 día',
      location: 'Gimnasio Virtual',
      isLiked: false,
      tags: ['tips', 'hidratacion', 'consejo'],
      postType: 'regular'
    }
  ]);

  const { toast } = useToast();
  const { addXP } = useXP();

  const nextImage = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && post.images.length > 1) {
      setCurrentImageIndexes(prev => ({
        ...prev,
        [postId]: ((prev[postId] || 0) + 1) % post.images.length
      }));
    }
  };

  const prevImage = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && post.images.length > 1) {
      setCurrentImageIndexes(prev => ({
        ...prev,
        [postId]: ((prev[postId] || 0) - 1 + post.images.length) % post.images.length
      }));
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        const newLikes = newIsLiked ? post.likes + 1 : post.likes - 1;
        
        if (newIsLiked) {
          addXP(25, 'Me gusta en post');
        }
        
        return { ...post, isLiked: newIsLiked, likes: newLikes };
      }
      return post;
    }));
  };

  const openWhatsApp = (phoneNumber: string, message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const openChat = (userId: string, userName: string) => {
    addXP(50, 'Chat iniciado');
    window.location.href = '/chat';
  };

  const addNewPost = (newPost: Omit<Post, 'id' | 'likes' | 'comments' | 'isLiked'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      likes: 0,
      comments: 0,
      isLiked: false
    };
    setPosts(prev => [post, ...prev]);
    addXP(100, 'Nueva publicación creada');
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Teso
          </h1>
          <Button
            onClick={() => setShowCreatePost(true)}
            size="sm"
            className="fitness-button-primary rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Crear
          </Button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="p-4 space-y-4">
        {/* Wearable Integration */}
        <WearableSync />
        {posts.map((post) => {
          const currentImageIndex = currentImageIndexes[post.id] || 0;
          return (
          <Card
            key={post.id}
            className="fitness-card overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-4 pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{post.user.name}</p>
                  <p className="text-xs text-muted-foreground">{post.location}</p>
                </div>
              </div>
            </div>

            {/* Post Image */}
            <div className="post-image-container relative">
              <img
                src={post.images[currentImageIndex]}
                alt="Post"
                className="w-full h-full object-cover"
              />
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={() => prevImage(post.id)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => nextImage(post.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1}/{post.images.length}
                  </div>
                </>
              )}
            </div>

              {/* Post Content with Enhanced Features */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className="p-0 h-auto"
                    >
                      <Heart
                        className={`w-6 h-6 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openChat(post.user.id, post.user.name);
                      }}
                      className="p-0 h-auto"
                    >
                      <MessageCircle className="w-6 h-6 text-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "Compartido",
                          description: "Post compartido exitosamente",
                        });
                      }}
                      className="p-0 h-auto"
                    >
                      <Share className="w-6 h-6 text-foreground" />
                    </Button>
                  </div>
                </div>

                <p className="font-semibold text-sm mb-1">
                  {post.likes} Me gusta
                </p>

                <p className="text-sm mb-2">
                  <span className="font-semibold">{post.user.name}</span>{' '}
                  {post.content}
                </p>

                {/* Price and Service Info */}
                {post.price && (
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-primary font-semibold">
                      {post.price}
                    </Badge>
                    {post.postType === 'service' && (
                      <Badge variant="outline">Servicio</Badge>
                    )}
                    {post.postType === 'product' && (
                      <Badge variant="outline">Producto</Badge>
                    )}
                  </div>
                )}

                {/* WhatsApp Contact Button */}
                {post.whatsappNumber && (
                  <div className="flex gap-2 mb-2">
                    <Button
                      size="sm"
                      className="fitness-button-primary flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWhatsApp(post.whatsappNumber!, `Hola! Vi tu ${post.postType === 'service' ? 'servicio' : 'producto'} en Teso: ${post.content.substring(0, 50)}...`);
                      }}
                    >
                      Contactar por WhatsApp
                    </Button>
                    {post.postType === 'product' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct({
                            name: post.content.substring(0, 50),
                            price: parseInt(post.price?.replace(/[^0-9]/g, '') || '0'),
                            image: post.images[0]
                          });
                          setShowCheckout(true);
                        }}
                      >
                        Comprar
                      </Button>
                    )}
                  </div>
                )}

                {post.tags && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-primary text-xs hover:underline cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Ver los {post.comments} comentarios
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {post.timestamp}
                  </p>
                </div>
              </div>
          </Card>
          );
        })}
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onCreatePost={addNewPost}
      />
      
      {selectedProduct && (
        <CheckoutFlow
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Feed;