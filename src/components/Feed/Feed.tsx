import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Plus } from 'lucide-react';
import PostModal from './PostModal';
import CreatePostModal from './CreatePostModal';
import workoutPost1 from '@/assets/workout-post-1.jpg';
import nutritionPost1 from '@/assets/nutrition-post-1.jpg';
import groupFitnessPost from '@/assets/group-fitness-post.jpg';
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
}

const Feed = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Sample posts with default fitness images
  const [posts] = useState<Post[]>([
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
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'María Wellness',
        avatar: trainerAvatar,
      },
      content: 'Meal prep del domingo 🥗 Una buena alimentación es el 70% del éxito. ¿Cuál es tu comida favorita post-entrenamiento?',
      images: [nutritionPost1],
      likes: 89,
      comments: 15,
      timestamp: 'Hace 4 horas',
      location: 'Smart Fit Chapinero',
      isLiked: true,
      tags: ['nutrition', 'mealprep', 'healthy'],
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Team FitClub',
        avatar: trainerAvatar,
      },
      content: '¡Clase grupal de HIIT completada! 🔥 La energía del grupo es incomparable. ¡Nos vemos mañana para más!',
      images: [groupFitnessPost],
      likes: 156,
      comments: 32,
      timestamp: 'Hace 6 horas',
      location: 'Gold\'s Gym Zona Rosa',
      isLiked: false,
      tags: ['hiit', 'group', 'energy'],
    },
  ]);

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            ZestWell
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
        {posts.map((post) => (
          <Card
            key={post.id}
            className="fitness-card overflow-hidden cursor-pointer"
            onClick={() => setSelectedPost(post)}
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
            <div className="post-image-container">
              <img
                src={post.images[0]}
                alt="Post"
                className="w-full h-full object-cover"
              />
              {post.images.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  1/{post.images.length}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${post.isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 p-0`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share className="w-5 h-5" />
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
        ))}
      </div>

      {/* Modals */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
      
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </div>
  );
};

export default Feed;