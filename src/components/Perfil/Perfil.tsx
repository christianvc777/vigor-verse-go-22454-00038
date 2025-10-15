import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  Edit, 
  Share, 
  Trophy, 
  Target, 
  Heart, 
  TrendingUp,
  Calendar,
  Activity,
  Award,
  Bookmark,
  Users,
  MessageCircle
} from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import ShareModal from './ShareModal';
import DashboardModal from './DashboardModal';
import ConfigModal from './ConfigModal';
import FavoritesModal from './FavoritesModal';
import AchievementsModal from './AchievementsModal';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import trainerAvatar from '@/assets/trainer-avatar.jpg';

const Perfil = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showShare, setShowShare] = useState(false);
const [showDashboard, setShowDashboard] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const userProfile = {
    name: 'Carlos Fitness',
    username: '@carlosfitness',
    bio: 'Entrenador personal certificado | Transformando vidas a través del fitness 💪',
    avatar: trainerAvatar,
    followers: 1240,
    following: 890,
    posts: 156,
    location: 'Bogotá, Colombia',
    joined: 'Enero 2023',
    verified: true,
  };

  const weeklyStats = {
    workouts: 5,
    calories: 2840,
    steps: 45230,
    progress: 78,
  };

  const achievements = [
    { id: '1', title: '30 Días Consecutivos', icon: Trophy, earned: true },
    { id: '2', title: 'Quema Calorías Pro', icon: Target, earned: true },
    { id: '3', title: 'Cardio Master', icon: Heart, earned: false },
    { id: '4', title: 'Fuerza Legendaria', icon: Award, earned: true },
  ];

  const myPosts = [
    { id: '1', image: '/api/placeholder/150/150', likes: 89, comments: 12 },
    { id: '2', image: '/api/placeholder/150/150', likes: 156, comments: 23 },
    { id: '3', image: '/api/placeholder/150/150', likes: 234, comments: 45 },
    { id: '4', image: '/api/placeholder/150/150', likes: 98, comments: 8 },
    { id: '5', image: '/api/placeholder/150/150', likes: 167, comments: 19 },
    { id: '6', image: '/api/placeholder/150/150', likes: 203, comments: 31 },
  ];

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-md z-30 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Perfil</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShare(true)}
            >
              <Share className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEditProfile(true)}
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
            </Avatar>
            {userProfile.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Award className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold mb-1">{userProfile.name}</h2>
          <p className="text-muted-foreground text-sm mb-2">{userProfile.username}</p>
          <p className="text-sm mb-4">{userProfile.bio}</p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <p className="font-bold text-lg">{userProfile.posts}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{userProfile.followers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{userProfile.following}</p>
              <p className="text-xs text-muted-foreground">Siguiendo</p>
            </div>
          </div>
        </div>

        {/* Quick Stats - Dashboard Preview */}
        <Card className="fitness-card p-4 cursor-pointer" onClick={() => setShowDashboard(true)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Dashboard - Progreso Semanal
            </h3>
            <Button variant="ghost" size="sm">
              Ver más →
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="stat-card">
              <Activity className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Entrenamientos</p>
              <p className="font-bold text-lg">{weeklyStats.workouts}</p>
            </div>
            <div className="stat-card">
              <Target className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Calorías</p>
              <p className="font-bold text-lg">{weeklyStats.calories.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Meta semanal</span>
              <span className="font-semibold">{weeklyStats.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                style={{ width: `${weeklyStats.progress}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            onClick={() => setShowConfig(true)}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Configuración</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            onClick={() => setShowFavorites(true)}
          >
            <Bookmark className="w-5 h-5 mb-1" />
            <span className="text-xs">Favoritos</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            onClick={() => setShowAchievements(true)}
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-xs">Logros</span>
          </Button>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Actividad
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Logros
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-4">
            <div className="grid grid-cols-3 gap-1">
              {myPosts.map((post) => (
                <div key={post.id} className="relative aspect-square">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary/60" />
                  </div>
                  <div className="absolute bottom-1 right-1 flex gap-1">
                    <div className="bg-black/70 text-white text-xs px-1 rounded flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-4">
            <div className="space-y-4">
              <Card className="fitness-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Completaste el reto "30 Días de Cardio"</p>
                    <p className="text-xs text-muted-foreground">Hace 2 días</p>
                  </div>
                </div>
              </Card>
              
              <Card className="fitness-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Te uniste al evento "HIIT Intensivo"</p>
                    <p className="text-xs text-muted-foreground">Hace 1 semana</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card
                    key={achievement.id}
                    className={`fitness-card p-4 text-center ${
                      achievement.earned ? 'bg-primary/10' : 'opacity-50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      achievement.earned ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <p className="font-medium text-sm">{achievement.title}</p>
                    {achievement.earned && (
                      <Badge className="mt-2" variant="secondary">
                        Desbloqueado
                      </Badge>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        profile={userProfile}
      />
      
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        profile={userProfile}
      />
      
      <DashboardModal
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        stats={weeklyStats}
      />
      
      <ConfigModal
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
      />
      
      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </div>
  );
};

export default Perfil;