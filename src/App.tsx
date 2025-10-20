import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { XPProvider } from "./contexts/XPContext";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Layout from "./components/Layout";
import Feed from "./components/Feed/Feed";
import Social from "./components/Social/Social";
import Chat from "./components/Chat/Chat";
import Retos from "./components/Retos/Retos";
import Eventos from "./components/Eventos/Eventos";
import Mapa from "./components/Mapa/Mapa";
import Perfil from "./components/Perfil/Perfil";
import Auth from "./pages/Auth";
import AdminKPIs from "./pages/AdminKPIs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <XPProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" replace />} />
              <Route path="/admin/kpis" element={session ? <AdminKPIs /> : <Navigate to="/auth" replace />} />
              <Route path="/" element={session ? <Layout /> : <Navigate to="/auth" replace />}>
                <Route index element={<Feed />} />
                <Route path="social" element={<Social />} />
                <Route path="chat" element={<Chat />} />
                <Route path="retos" element={<Retos />} />
                <Route path="eventos" element={<Eventos />} />
                <Route path="mapa" element={<Mapa />} />
                <Route path="perfil" element={<Perfil />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </XPProvider>
    </QueryClientProvider>
  );
};

export default App;
