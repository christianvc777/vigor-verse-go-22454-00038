import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, Zap, HardDrive, TrendingUp, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminKPIs = () => {
  const [dailySignups, setDailySignups] = useState<any[]>([]);
  const [dailyPosts, setDailyPosts] = useState<any[]>([]);
  const [xpStats, setXpStats] = useState<any[]>([]);
  const [dailyXP, setDailyXP] = useState<any[]>([]);
  const [storageUsage, setStorageUsage] = useState<any[]>([]);
  const [engagement, setEngagement] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      // Daily Signups
      const { data: signupsData } = await supabase
        .from('kpi_daily_signups')
        .select('*')
        .order('signup_date', { ascending: false })
        .limit(30);
      
      if (signupsData) setDailySignups(signupsData);

      // Daily Posts
      const { data: postsData } = await supabase
        .from('kpi_daily_posts')
        .select('*')
        .order('post_date', { ascending: false })
        .limit(30);
      
      if (postsData) setDailyPosts(postsData);

      // XP Stats by Level
      const { data: xpData } = await supabase
        .from('kpi_xp_stats')
        .select('*')
        .order('current_level', { ascending: true });
      
      if (xpData) setXpStats(xpData);

      // Daily XP Earned
      const { data: dailyXPData } = await supabase
        .from('kpi_daily_xp_earned')
        .select('*')
        .order('xp_date', { ascending: false })
        .limit(30);
      
      if (dailyXPData) setDailyXP(dailyXPData);

      // Storage Usage
      const { data: storageData } = await supabase
        .from('kpi_storage_usage')
        .select('*')
        .order('upload_date', { ascending: false })
        .limit(30);
      
      if (storageData) setStorageUsage(storageData);

      // Engagement
      const { data: engagementData } = await supabase
        .from('kpi_engagement_stats')
        .select('*')
        .order('engagement_date', { ascending: false })
        .limit(30);
      
      if (engagementData) setEngagement(engagementData);

      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error cargando KPIs",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando KPIs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Panel de KPIs - TESO</h1>
            <p className="text-muted-foreground mt-2">Métricas clave de producto y engagement</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Signups Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailySignups[0]?.cumulative_signups || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dailySignups[0]?.signups_count || 0} hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Posts Creados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailyPosts.reduce((acc, curr) => acc + (curr.posts_count || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dailyPosts[0]?.posts_count || 0} hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">XP Promedio</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {xpStats[0]?.avg_xp || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Por usuario
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Storage Usado</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {storageUsage.reduce((acc, curr) => acc + parseFloat(curr.total_mb || 0), 0).toFixed(1)} MB
              </div>
              <p className="text-xs text-muted-foreground">
                {storageUsage.reduce((acc, curr) => acc + (curr.files_uploaded || 0), 0)} archivos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Signups Diarios</CardTitle>
              <CardDescription>Nuevos usuarios registrados por día</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySignups.slice(0, 14).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="signup_date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="signups_count" fill="#8884d8" name="Signups" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Posts Diarios</CardTitle>
              <CardDescription>Publicaciones creadas por día</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyPosts.slice(0, 14).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="post_date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="posts_count" stroke="#82ca9d" name="Posts" />
                  <Line type="monotone" dataKey="unique_users_posting" stroke="#8884d8" name="Usuarios" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Niveles</CardTitle>
              <CardDescription>Usuarios por nivel de XP</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={xpStats}
                    dataKey="users_at_level"
                    nameKey="current_level"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `Nivel ${entry.current_level}`}
                  >
                    {xpStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>XP Ganado Diario</CardTitle>
              <CardDescription>Puntos de experiencia ganados por día</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyXP.slice(0, 14).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="xp_date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_xp_earned" fill="#ffc658" name="XP Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
              <CardDescription>Likes y comentarios por día</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagement.slice(0, 14).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="engagement_date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total_likes" stroke="#ff7c7c" name="Likes" />
                  <Line type="monotone" dataKey="total_comments" stroke="#82ca9d" name="Comentarios" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uso de Storage</CardTitle>
              <CardDescription>Archivos subidos por día</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={storageUsage.slice(0, 14).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="upload_date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="files_uploaded" fill="#8884d8" name="Archivos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminKPIs;
