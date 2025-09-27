import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, Users, Calendar, MapPin, User, Search, MessageCircle } from 'lucide-react';
import XPBar from './XPBar';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/social', icon: Search, label: 'Buscar' },
    { path: '/retos', icon: Users, label: 'Retos' },
    { path: '/eventos', icon: Calendar, label: 'Eventos' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/mapa', icon: MapPin, label: 'Mapa' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* XP Bar */}
      <XPBar />
      
      {/* Main Content */}
      <main className="pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;