
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useDelegations } from '@/hooks/useDelegations';
import { useCompanies } from '@/hooks/useCompanies';
import { useProducts } from '@/hooks/useProducts';
import { useDepartments } from '@/hooks/useDepartments';
import { useNews } from '@/hooks/useNews';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Package, FileText, Briefcase, Newspaper, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { users } = useUsers();
  const { delegations } = useDelegations();
  const { companies } = useCompanies();
  const { products } = useProducts();
  const { departments } = useDepartments();
  const { news } = useNews();

  const stats = [
    {
      title: 'Usuarios',
      value: users.length.toString(),
      icon: Users,
      description: 'Total de usuarios registrados',
      href: '/users'
    },
    {
      title: 'Delegaciones',
      value: delegations.length.toString(),
      icon: Building,
      description: 'Delegaciones activas',
      href: '/delegations'
    },
    {
      title: 'Compañías',
      value: companies.length.toString(),
      icon: Building2,
      description: 'Compañías registradas',
      href: '/companies'
    },
    {
      title: 'Productos',
      value: products.length.toString(),
      icon: Package,
      description: 'Productos disponibles',
      href: '/products'
    },
    {
      title: 'Departamentos',
      value: departments.length.toString(),
      icon: Briefcase,
      description: 'Departamentos activos',
      href: '/departments'
    },
    {
      title: 'Noticias',
      value: news.length.toString(),
      icon: Newspaper,
      description: 'Noticias publicadas',
      href: '/news'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">
          Bienvenido, {profile?.name || user?.user_metadata?.name || user?.email}
        </h1>
        <p className="text-muted-foreground mt-2">
          Panel de control del sistema de gestión interno
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link 
            to={stat.href} 
            key={stat.title} 
            className="block transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Sistema de Gestión</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sistema integral para la gestión de usuarios, delegaciones, compañías, productos, 
            departamentos y noticias de la correduría.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
