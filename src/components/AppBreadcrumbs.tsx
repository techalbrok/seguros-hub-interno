
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';

const breadcrumbNameMap: Record<string, string> = {
  'dashboard': 'Inicio',
  'users': 'Usuarios',
  'companies': 'Compañías',
  'products': 'Productos',
  'departments': 'Departamentos',
  'news': 'Noticias',
  'settings': 'Ajustes',
  'profile': 'Perfil',
  'create': 'Crear',
  'edit': 'Editar',
};

export const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  return (
    <div className="breadcrumbs-container-premium">
      <Breadcrumb className="hidden md:flex mb-6">
        <div className="flex items-center p-3 rounded-xl bg-background/60 backdrop-blur-md border border-border/30 shadow-lg">
          <BreadcrumbList className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                    <Home className="h-3.5 w-3.5" />
                  </div>
                  <span className="sr-only">Inicio</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              
              const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
              let name = breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);
              if (isUuid) {
                name = 'Detalle';
              }

              return [
                <BreadcrumbSeparator key={`sep-${to}`} className="text-muted-foreground/50">
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>,
                <BreadcrumbItem key={to}>
                  {last ? (
                    <BreadcrumbPage className="font-medium text-foreground bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1.5 rounded-lg border border-border/30">
                      {name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={to} 
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/10"
                      >
                        {name}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              ];
            })}
          </BreadcrumbList>
        </div>
      </Breadcrumb>
    </div>
  );
};
