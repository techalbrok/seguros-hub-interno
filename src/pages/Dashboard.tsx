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
import { useBrokerageConfig, defaultTerminology } from '@/hooks/useBrokerageConfig';
import { SystemAlerts } from '@/components/SystemAlerts';
const Dashboard = () => {
  const {
    user,
    profile
  } = useAuth();
  const {
    users,
    loading: loadingUsers
  } = useUsers();
  const {
    delegations,
    loading: loadingDelegations
  } = useDelegations();
  const {
    companies,
    isLoading: loadingCompanies
  } = useCompanies();
  const {
    products,
    isLoading: loadingProducts
  } = useProducts();
  const {
    departments,
    loading: loadingDepartments
  } = useDepartments();
  const {
    news,
    loading: loadingNews
  } = useNews();
  const {
    config
  } = useBrokerageConfig();
  const t = config?.terminology || defaultTerminology;
  const stats = [{
    title: t.user.plural,
    value: users.length.toString(),
    icon: Users,
    description: `Total de ${t.user.plural.toLowerCase()} registrados`,
    href: '/users',
    loading: loadingUsers
  }, {
    title: t.delegation.plural,
    value: delegations.length.toString(),
    icon: Building,
    description: `${t.delegation.plural} activas`,
    href: '/delegations',
    loading: loadingDelegations
  }, {
    title: t.company.plural,
    value: companies.length.toString(),
    icon: Building2,
    description: `${t.company.plural} registradas`,
    href: '/companies',
    loading: loadingCompanies
  }, {
    title: t.product.plural,
    value: products.length.toString(),
    icon: Package,
    description: `${t.product.plural} disponibles`,
    href: '/products',
    loading: loadingProducts
  }, {
    title: t.department.plural,
    value: departments.length.toString(),
    icon: Briefcase,
    description: `${t.department.plural} activos`,
    href: '/departments',
    loading: loadingDepartments
  }, {
    title: t.news.plural,
    value: news.length.toString(),
    icon: Newspaper,
    description: `${t.news.plural} publicadas`,
    href: '/news',
    loading: loadingNews
  }];
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">
          Bienvenido, {profile?.name || user?.user_metadata?.name || user?.email}
        </h1>
        <p className="text-muted-foreground mt-2">
          Panel de control del sistema de gestión interno
        </p>
      </div>

      <SystemAlerts />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => <Link to={stat.href} key={stat.title} className="block transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg animate-fade-in" style={{
        animationDelay: `${index * 50}ms`
      }}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} description={stat.description} loading={stat.loading} />
          </Link>)}
      </div>

      <Card className="animate-fade-in" style={{
      animationDelay: `${stats.length * 50}ms`
    }}>
        
        
      </Card>
    </div>;
};
export default Dashboard;