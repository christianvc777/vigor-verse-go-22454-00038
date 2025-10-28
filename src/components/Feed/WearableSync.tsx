import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Watch, Activity, Heart, TrendingUp, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WearableSync = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión",
          variant: "destructive",
        });
        return;
      }

      // Simular datos de wearable (en producción vendría de API real)
      const wearableData = {
        device_type: 'Apple Watch',
        steps: Math.floor(Math.random() * 5000) + 8000,
        distance_km: parseFloat((Math.random() * 3 + 5).toFixed(2)),
        calories_burned: Math.floor(Math.random() * 300) + 400,
        heart_rate_avg: Math.floor(Math.random() * 20) + 140,
        heart_rate_max: Math.floor(Math.random() * 20) + 170,
        heart_rate_min: Math.floor(Math.random() * 20) + 60,
        active_minutes: Math.floor(Math.random() * 30) + 45,
        sleep_hours: parseFloat((Math.random() * 2 + 6).toFixed(1)),
      };

      const { error } = await supabase
        .from('wearable_data')
        .upsert({
          user_id: user.id,
          ...wearableData,
          sync_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      setLastSync(new Date());
      setIsConnected(true);
      
      toast({
        title: "¡Sincronización completada!",
        description: `${wearableData.steps} pasos y ${wearableData.calories_burned} calorías sincronizadas. +50 XP`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo sincronizar",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="fitness-card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Watch className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Wearable Conectado</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? `Última sincronización: ${lastSync?.toLocaleTimeString()}` : 'No sincronizado hoy'}
            </p>
          </div>
        </div>
        {isConnected && (
          <Badge variant="outline" className="text-success border-success">
            ✓ Conectado
          </Badge>
        )}
      </div>

      {isConnected && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-muted rounded-lg">
            <Activity className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-xs font-bold">8,547</p>
            <p className="text-xs text-muted-foreground">pasos</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <Zap className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-xs font-bold">542</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
            <p className="text-xs font-bold">142</p>
            <p className="text-xs text-muted-foreground">bpm</p>
          </div>
        </div>
      )}

      <Button
        onClick={handleSync}
        disabled={isSyncing}
        className="w-full fitness-button-primary"
        size="sm"
      >
        {isSyncing ? (
          <>Sincronizando...</>
        ) : (
          <>
            <TrendingUp className="w-4 h-4 mr-2" />
            {isConnected ? 'Actualizar Datos' : 'Sincronizar Wearable'}
          </>
        )}
      </Button>
    </Card>
  );
};

export default WearableSync;
