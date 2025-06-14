
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

const Dashboard = () => {
  const { user } = useAuth();
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
      description: 'Total de usuarios registrados'
    },
    {
      title: 'Delegaciones',
      value: delegations.length.toString(),
      icon: Building,
      description: 'Delegaciones activas'
    },
    {
      title: 'Compañías',
      value: companies.length.toString(),
      icon: Building2,
      description: 'Compañías registradas'
    },
    {
      title: 'Productos',
      value: products.length.toString(),
      icon: Package,
      description: 'Productos disponibles'
    },
    {
      title: 'Departamentos',
      value: departments.length.toString(),
      icon: Briefcase,
      description: 'Departamentos activos'
    },
    {
      title: 'Noticias',
      value: news.length.toString(),
      icon: Newspaper,
      description: 'Noticias publicadas'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">
          Bienvenido, {user?.user_metadata?.name || user?.email}
        </h1>
        <p className="text-muted-foreground">
          Panel de control del sistema de gestión interno
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
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
