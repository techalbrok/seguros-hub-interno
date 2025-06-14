
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsDropdown } from "./notifications/NotificationsDropdown";

export const Header = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    user,
    signOut,
    isAdmin
  } = useAuth();
  const {
    config
  } = useBrokerageConfig();
  
  const handleSignOut = async () => {
    await signOut();
  };
  const brokerageName = config?.name || "Intranet Correduría";
  const logoUrl = config?.logo_url;

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          {logoUrl && <img src={logoUrl} alt={`Logo de ${brokerageName}`} className="h-8 w-auto object-contain" />}
          <h1 className="text-sidebar-primary dark:text-white text-lg font-thin">
            {brokerageName}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <GlobalSearch />

          <Button variant="outline" size="sm" onClick={toggleTheme} className="transition-all duration-200 hover:scale-105">
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
          
          <NotificationsDropdown />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata.name || 'Usuario'}
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
