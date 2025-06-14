
import { Users, User, Link, Edit, Newspaper, Calendar } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const stats = [
    {
      title: "Usuarios Activos",
      value: 24,
      icon: <Users className="h-4 w-4" />,
      description: "8 administradores, 16 usuarios",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Delegaciones",
      value: 8,
      icon: <User className="h-4 w-4" />,
      description: "Todas las delegaciones activas",
      trend: { value: 0, isPositive: true }
    },
    {
      title: "Compañías",
      value: 45,
      icon: <Link className="h-4 w-4" />,
      description: "Compañías aseguradoras registradas",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Productos",
      value: 156,
      icon: <Edit className="h-4 w-4" />,
      description: "Productos de seguros disponibles",
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Noticias",
      value: 23,
      icon: <Newspaper className="h-4 w-4" />,
      description: "Publicadas este mes",
      trend: { value: 21, isPositive: true }
    },
    {
      title: "Actividad Hoy",
      value: 47,
      icon: <Calendar className="h-4 w-4" />,
      description: "Acciones realizadas hoy",
      trend: { value: 5, isPositive: false }
    }
  ];

  const recentActivity = [
    { action: "Usuario creado", user: "María García", time: "Hace 2 horas", type: "user" },
    { action: "Producto actualizado", user: "Carlos López", time: "Hace 3 horas", type: "product" },
    { action: "Noticia publicada", user: "Ana Martín", time: "Hace 5 horas", type: "news" },
    { action: "Compañía registrada", user: "José Ruiz", time: "Hace 1 día", type: "company" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'product': return <Edit className="h-4 w-4 text-green-500" />;
      case 'news': return <Newspaper className="h-4 w-4 text-orange-500" />;
      case 'company': return <Link className="h-4 w-4 text-purple-500" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Bienvenido a la intranet de Correduría de Seguros
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="corporate-button">
            Ver Reportes
          </Button>
          <Button variant="outline">
            Configuración
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sidebar-primary dark:text-white">
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-primary dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      por {activity.user}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sidebar-primary dark:text-white">
              Accesos Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-xs">Crear Usuario</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Link className="h-6 w-6" />
                <span className="text-xs">Nueva Compañía</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Edit className="h-6 w-6" />
                <span className="text-xs">Crear Producto</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Newspaper className="h-6 w-6" />
                <span className="text-xs">Publicar Noticia</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
