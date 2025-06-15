
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
    <header className="h-16 border-b border-border/20 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 sticky top-0 z-50 header-premium">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-60" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/80 backdrop-blur-xl" />
      
      <div className="relative flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <SidebarTrigger className="h-8 w-8 sm:hidden sidebar-trigger-premium" />
          {logoUrl && (
            <div className="logo-wrapper-premium group">
              <div className="relative p-1 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border border-border/30 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img 
                  src={logoUrl} 
                  alt={`Logo de ${brokerageName}`} 
                  className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
            </div>
          )}
          <h1 className="text-sidebar-primary dark:text-white text-lg font-medium hidden sm:block header-title-premium">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {brokerageName}
            </span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-3 header-actions-premium">
          <div className="search-container-premium">
            <GlobalSearch />
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme} 
            className="theme-toggle-premium relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 relative z-10" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 z-10" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <div className="notification-container-premium">
            <NotificationsDropdown />
          </div>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full user-menu-trigger-premium group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full" />
                  <Avatar className="h-9 w-9 border-2 border-border/30 group-hover:border-primary/50 transition-all duration-300 relative z-10">
                    <AvatarImage src={profile?.avatarUrl} alt={profile?.name || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-medium">
                      {profile?.name ? getInitials(profile.name) : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 user-menu-content-premium" align="end" forceMount>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg" />
                  <div className="relative">
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
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors duration-200" asChild>
                      <Link to="/profile">
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors duration-200" asChild>
                        <Link to="/settings">
                          Configuración
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200" onClick={handleSignOut}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
