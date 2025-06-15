
import { useState, useEffect } from 'react';
import { useDemoAuth } from "./DemoAuthContext";
import { StatCard } from '@/components/StatCard';
import { Users, Building, Building2, Package, Briefcase, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

const getDemoDataLength = (key: string, defaultValue: any[]): number => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored).length : defaultValue.length;
  } catch (error) {
    console.error("Error parsing demo data from localStorage", error);
    return defaultValue.length;
  }
};

export const DemoDashboard = () => {
  const { user } = useDemoAuth();

  const [stats, setStats] = useState([
    { title: "Usuarios", value: "0", icon: Users, href: '/demo/users', description: "Total de usuarios demo" },
    { title: "Delegaciones", value: "0", icon: Building, href: '/demo/delegations', description: "Delegaciones demo activas" },
    { title: "Compañías", value: "0", icon: Building2, href: '/demo/companies', description: "Compañías demo registradas" },
    { title: "Productos", value: "0", icon: Package, href: '/demo/products', description: "Productos demo disponibles" },
    { title: "Departamentos", value: "0", icon: Briefcase, href: '/demo/departments', description: "Departamentos demo activos" },
    { title: "Noticias", value: "0", icon: Newspaper, href: '/demo/news', description: "Noticias demo publicadas" },
  ]);

  useEffect(() => {
    const userCount = getDemoDataLength("demo_users_list", [{ id: "1", name: "Ana Demo", email: "ana@demo.com", role: "admin" }, { id: "2", name: "Luis Demo", email: "luis@demo.com", role: "user" }]);
    const delegationCount = getDemoDataLength("demo_delegations_list", [{ id: "1", name: "Central Demo" }, { id: "2", name: "Sucursal Norte Demo" }]);
    const companyCount = getDemoDataLength("demo_companies_list", [{ id: "1", name: "Compañía Demo A" }, { id: "2", name: "Compañía Demo B" }]);
    const productCount = getDemoDataLength("demo_products_list", [{ id: "1", name: "Producto Demo X" }, { id: "2", name: "Producto Demo Y" }]);
    const departmentCount = getDemoDataLength("demo_departments_list", [{ id: "1", name: "Departamento Comercial Demo" }, { id: "2", name: "Departamento Siniestros Demo" }]);
    const newsCount = getDemoDataLength("demo_news_list", [{ id: "1", title: "Novedad Importante Demo" }, { id: "2", title: "Otra Noticia Demo" }]);
    
    setStats(prevStats => prevStats.map(stat => {
      switch (stat.title) {
        case "Usuarios": return { ...stat, value: userCount.toString() };
        case "Delegaciones": return { ...stat, value: delegationCount.toString() };
        case "Compañías": return { ...stat, value: companyCount.toString() };
        case "Productos": return { ...stat, value: productCount.toString() };
        case "Departamentos": return { ...stat, value: departmentCount.toString() };
        case "Noticias": return { ...stat, value: newsCount.toString() };
        default: return stat;
      }
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">
          Bienvenido, {user?.name || user?.email}
        </h1>
        <p className="text-muted-foreground mt-2">
          Panel de control de la demo de la plataforma.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Link to={stat.href} key={stat.title} className="block transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <StatCard 
              title={stat.title} 
              value={stat.value} 
              icon={stat.icon} 
              description={stat.description}
              loading={false} 
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
