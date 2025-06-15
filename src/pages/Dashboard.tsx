
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
    loading: usersLoading
  } = useUsers();
  const {
    delegations,
    loading: delegationsLoading
  } = useDelegations();
  const {
    companies,
    isLoading: companiesLoading
  } = useCompanies();
  const {
    products,
    isLoading: productsLoading
  } = useProducts();
  const {
    departments,
    loading: departmentsLoading
  } = useDepartments();
  const {
    news,
    loading: newsLoading
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
    loading: usersLoading
  }, {
    title: t.delegation.plural,
    value: delegations.length.toString(),
    icon: Building,
    description: `${t.delegation.plural} activas`,
    href: '/delegations',
    loading: delegationsLoading
  }, {
    title: t.company.plural,
    value: companies.length.toString(),
    icon: Building2,
    description: `${t.company.plural} registradas`,
    href: '/companies',
    loading: companiesLoading
  }, {
    title: t.product.plural,
    value: products.length.toString(),
    icon: Package,
    description: `${t.product.plural} disponibles`,
    href: '/products',
    loading: productsLoading
  }, {
    title: t.department.plural,
    value: departments.length.toString(),
    icon: Briefcase,
    description: `${t.department.plural} activos`,
    href: '/departments',
    loading: departmentsLoading
  }, {
    title: t.news.plural,
    value: news.length.toString(),
    icon: Newspaper,
    description: `${t.news.plural} publicadas`,
    href: '/news',
    loading: newsLoading
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
    </div>;
};
export default Dashboard;
