
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
import { Home } from 'lucide-react';

const breadcrumbNameMap: Record<string, string> = {
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

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="hidden md:flex mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
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
            <BreadcrumbSeparator key={`sep-${to}`} />,
            <BreadcrumbItem key={to}>
              {last ? (
                <BreadcrumbPage>{name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={to}>{name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
