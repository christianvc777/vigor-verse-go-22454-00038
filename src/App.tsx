import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { XPProvider } from "./contexts/XPContext";
import Layout from "./components/Layout";
import Feed from "./components/Feed/Feed";
import Social from "./components/Social/Social";
import Chat from "./components/Chat/Chat";
import Retos from "./components/Retos/Retos";
import Eventos from "./components/Eventos/Eventos";
import Mapa from "./components/Mapa/Mapa";
import Perfil from "./components/Perfil/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <XPProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
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

export default App;
