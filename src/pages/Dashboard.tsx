
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

  return (
    <div className="space-y-8 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-dots-pattern opacity-30 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-6 fade-in-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 bg-clip-text text-transparent dark:from-white dark:to-white/80 mb-2">
            Bienvenido, {profile?.name || user?.user_metadata?.name || user?.email}
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Panel de control del sistema de gestión interno
          </p>
        </div>

        <div className="mb-8 fade-in-up" style={{ animationDelay: '100ms' }}>
          <SystemAlerts />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          {stats.map((stat, index) => (
            <Link 
              to={stat.href} 
              key={stat.title} 
              className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg fade-in-up stagger-animation" 
              style={{
                animationDelay: `${200 + index * 100}ms`
              }}
            >
              <StatCard 
                title={stat.title} 
                value={stat.value} 
                icon={stat.icon} 
                description={stat.description} 
                loading={stat.loading} 
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
