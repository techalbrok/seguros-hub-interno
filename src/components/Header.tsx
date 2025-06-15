
import { User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsDropdown } from "./notifications/NotificationsDropdown";
import { SidebarTrigger } from "./ui/sidebar";
import { useEffect } from "react";

export const Header = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    user,
    signOut,
    isAdmin,
    profile,
  } = useAuth();
  const {
    config
  } = useBrokerageConfig();

  useEffect(() => {
    if (config) {
      const root = document.documentElement;

      const primaryColor = theme === 'dark' ? config.primary_color_dark : config.primary_color_light;
      const accentColor = theme === 'dark' ? config.accent_color_dark : config.accent_color_light;

      if (primaryColor) {
        root.style.setProperty('--color-primary', primaryColor);
      }
      
      if (accentColor) {
        root.style.setProperty('--color-accent', accentColor);
      }
    }
  }, [config, theme]);
  
  const handleSignOut = async () => {
    await signOut();
  };
  const brokerageName = config?.name || "Intranet Correduría";
  const logoUrl = config?.logo_url;

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 header-enhanced">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <SidebarTrigger className="h-8 w-8 sm:hidden sidebar-trigger" />
          {logoUrl && (
            <div className="logo-wrapper">
              <img 
                src={logoUrl} 
                alt={`Logo de ${brokerageName}`} 
                className="h-8 w-auto object-contain transition-transform duration-300 hover:scale-110" 
              />
            </div>
          )}
          <h1 className="text-sidebar-primary dark:text-white text-lg font-thin hidden sm:block header-title">
            {brokerageName}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 header-actions">
          <GlobalSearch />

          <Button variant="outline" size="icon" onClick={toggleTheme} className="theme-toggle">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <NotificationsDropdown />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full user-menu-trigger">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatarUrl} alt={profile?.name || ''} />
                    <AvatarFallback className="bg-primary text-white">
                      {profile?.name ? getInitials(profile.name) : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 user-menu-content" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.name || user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/profile">
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/settings">
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleSignOut}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
