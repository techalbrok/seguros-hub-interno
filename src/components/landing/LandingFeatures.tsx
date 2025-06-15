
import { Users, Building, Building2, Package, Briefcase, Newspaper } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const features = [
  { icon: Users, title: "Gestión de Equipos", description: "Control total sobre usuarios, roles y permisos." },
  { icon: Building, title: "Gestión de Oficinas/Sucursales", description: "Administra múltiples ubicaciones desde un panel centralizado." },
  { icon: Building2, title: "Red de Proveedores", description: "Base de datos completa de proveedores y partners." },
  { icon: Package, title: "Catálogo de Productos/Servicios", description: "Organiza y gestiona tu oferta comercial de forma eficiente." },
  { icon: Briefcase, title: "Departamentos Internos", description: "Estructura organizacional clara y eficiente para tus equipos." },
  { icon: Newspaper, title: "Comunicación Interna", description: "Un portal de noticias y comunicados corporativos fácil de usar." },
];

export const LandingFeatures = () => {
  return (
    <section className="container py-24 sm:py-32 bg-muted/40 dark:bg-muted/20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-sidebar-primary dark:text-white">Una solución, infinitas posibilidades</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          HubCore se adapta a tu negocio. Nuestras herramientas están diseñadas para escalar y evolucionar contigo, optimizando cada área de tu empresa.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-background/80">
            <CardHeader>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg w-fit mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
